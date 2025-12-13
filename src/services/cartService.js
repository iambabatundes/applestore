// services/cartService.js (Frontend) - Optimized Version
import { userHttpService } from "./http/index";
import { v4 as uuidv4 } from "uuid";

class CartService {
  constructor() {
    this.baseUrl = "/api/carts";

    // Multi-layer caching
    this.memoryCache = new Map();
    this.pendingRequests = new Map();

    // Optimistic update queue
    this.optimisticQueue = [];
    this.syncInProgress = false;

    // Performance monitoring
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      optimisticUpdates: 0,
      avgLatency: 0,
    };
  }

  /**
   * Get cart with aggressive caching
   * Returns immediately from cache, revalidates in background
   */
  async getCart(options = {}) {
    const cacheKey = "cart";
    const now = Date.now();

    // Check memory cache first (< 1ms)
    if (this.memoryCache.has(cacheKey) && !options.skipCache) {
      const cached = this.memoryCache.get(cacheKey);
      const age = now - cached.timestamp;

      // Fresh cache (< 30 seconds) - return immediately
      if (age < 30000) {
        this.metrics.cacheHits++;
        return cached.data;
      }

      // Stale cache (< 5 minutes) - return and revalidate
      if (age < 300000) {
        this.metrics.cacheHits++;
        this._revalidateInBackground();
        return cached.data;
      }
    }

    // Deduplicate concurrent requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Fetch from server
    const promise = this._fetchCartFromServer();
    this.pendingRequests.set(cacheKey, promise);

    try {
      const cart = await promise;
      return cart;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Ultra-fast add to cart with optimistic updates
   * Returns immediately with optimistic state
   * Target: < 10ms perceived latency
   */
  async addToCart(productId, quantity = 1, notes = "", metadata = {}) {
    const startTime = performance.now();

    try {
      // 1. Get current cart from cache (< 1ms)
      const currentCart = await this._getCachedCart();

      // 2. Apply optimistic update locally (< 5ms)
      const optimisticCart = this._applyOptimisticAdd(
        currentCart,
        productId,
        quantity,
        notes,
        metadata
      );

      // 3. Update cache immediately
      this._updateCache(optimisticCart);

      // 4. Generate idempotency key
      const idempotencyKey = uuidv4();

      // 5. Queue server request (don't await)
      this._queueServerUpdate({
        type: "add",
        productId,
        quantity,
        notes,
        metadata,
        idempotencyKey,
        optimisticCart,
        rollback: currentCart,
      });

      const latency = performance.now() - startTime;
      this.metrics.optimisticUpdates++;
      this.metrics.avgLatency = (this.metrics.avgLatency + latency) / 2;

      console.log("✅ Optimistic add completed", {
        latency: `${latency.toFixed(2)}ms`,
        productId,
        quantity,
      });

      // Return immediately with optimistic state
      return optimisticCart;
    } catch (error) {
      console.error("❌ Optimistic add failed", error);
      throw this._handleError(error);
    }
  }

  /**
   * Fast update with optimistic state
   */
  async updateQuantity(productId, quantity, notes = "") {
    const startTime = performance.now();

    try {
      const currentCart = await this._getCachedCart();

      const optimisticCart = this._applyOptimisticUpdate(
        currentCart,
        productId,
        quantity,
        notes
      );

      this._updateCache(optimisticCart);

      this._queueServerUpdate({
        type: "update",
        productId,
        quantity,
        notes,
        optimisticCart,
        rollback: currentCart,
      });

      const latency = performance.now() - startTime;
      console.log("✅ Optimistic update", {
        latency: `${latency.toFixed(2)}ms`,
      });

      return optimisticCart;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * Fast remove with optimistic state
   */
  async removeItem(productId) {
    try {
      const currentCart = await this._getCachedCart();

      const optimisticCart = this._applyOptimisticRemove(
        currentCart,
        productId
      );

      this._updateCache(optimisticCart);

      this._queueServerUpdate({
        type: "remove",
        productId,
        optimisticCart,
        rollback: currentCart,
      });

      return optimisticCart;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  /**
   * PRIVATE: Get cart from cache or fetch
   */
  async _getCachedCart() {
    const cached = this.memoryCache.get("cart");

    if (cached && Date.now() - cached.timestamp < 300000) {
      return cached.data;
    }

    return await this.getCart({ skipCache: true });
  }

  /**
   * PRIVATE: Fetch cart from server
   */
  async _fetchCartFromServer() {
    const startTime = performance.now();

    try {
      const response = await userHttpService.get(this.baseUrl);
      const cart = this._transformCart(response.data?.data || response.data);

      this._updateCache(cart);

      const latency = performance.now() - startTime;
      this.metrics.cacheMisses++;

      console.log("📡 Fetched from server", {
        latency: `${latency.toFixed(2)}ms`,
      });

      return cart;
    } catch (error) {
      console.error("Failed to fetch cart", error);
      throw error;
    }
  }

  /**
   * PRIVATE: Apply optimistic add
   */
  _applyOptimisticAdd(cart, productId, quantity, notes, metadata) {
    const optimisticCart = JSON.parse(JSON.stringify(cart)); // Deep clone
    const items = optimisticCart.items || [];

    const existingIndex = items.findIndex(
      (item) => item._id === productId || item.product?._id === productId
    );

    if (existingIndex >= 0) {
      // Update existing
      items[existingIndex].quantity += quantity;
      items[existingIndex].totalPrice =
        items[existingIndex].unitPrice * items[existingIndex].quantity;
    } else {
      // Add new (with placeholder data)
      items.push({
        _id: productId,
        product: { _id: productId },
        quantity,
        unitPrice: 0, // Will be updated from server
        totalPrice: 0,
        notes,
        metadata,
        _optimistic: true, // Flag for UI
      });
    }

    optimisticCart.items = items;
    this._recalculateTotals(optimisticCart);
    optimisticCart._optimistic = true;
    optimisticCart.timestamp = Date.now();

    return optimisticCart;
  }

  /**
   * PRIVATE: Apply optimistic update
   */
  _applyOptimisticUpdate(cart, productId, quantity, notes) {
    const optimisticCart = JSON.parse(JSON.stringify(cart));
    const items = optimisticCart.items || [];

    const index = items.findIndex(
      (item) => item._id === productId || item.product?._id === productId
    );

    if (index >= 0) {
      if (quantity === 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = quantity;
        items[index].totalPrice = items[index].unitPrice * quantity;
        if (notes) items[index].notes = notes;
      }
    }

    optimisticCart.items = items;
    this._recalculateTotals(optimisticCart);
    optimisticCart._optimistic = true;
    optimisticCart.timestamp = Date.now();

    return optimisticCart;
  }

  /**
   * PRIVATE: Apply optimistic remove
   */
  _applyOptimisticRemove(cart, productId) {
    return this._applyOptimisticUpdate(cart, productId, 0);
  }

  /**
   * PRIVATE: Recalculate cart totals
   */
  _recalculateTotals(cart) {
    const items = cart.items || [];

    cart.totals = cart.totals || {};
    cart.pricing = cart.pricing || {};

    cart.pricing.subtotal = items.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );

    cart.totals.items = items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    cart.pricing.total =
      cart.pricing.subtotal -
      (cart.pricing.discount || 0) +
      (cart.pricing.tax || 0) +
      (cart.pricing.shippingFee || 0);
  }

  /**
   * PRIVATE: Update memory cache
   */
  _updateCache(cart) {
    this.memoryCache.set("cart", {
      data: cart,
      timestamp: Date.now(),
    });

    // Also update summary cache
    this.memoryCache.set("cart-summary", {
      data: this._extractSummary(cart),
      timestamp: Date.now(),
    });
  }

  /**
   * PRIVATE: Extract cart summary
   */
  _extractSummary(cart) {
    return {
      itemCount: cart.totals?.items || 0,
      subtotal: cart.pricing?.subtotal || 0,
      total: cart.pricing?.total || 0,
      discount: cart.pricing?.discount || 0,
    };
  }

  /**
   * PRIVATE: Queue server update
   */
  _queueServerUpdate(operation) {
    this.optimisticQueue.push(operation);

    // Process queue with debouncing
    if (!this.syncInProgress) {
      setTimeout(() => this._processQueue(), 50);
    }
  }

  /**
   * PRIVATE: Process update queue
   */
  async _processQueue() {
    if (this.syncInProgress || this.optimisticQueue.length === 0) {
      return;
    }

    this.syncInProgress = true;

    while (this.optimisticQueue.length > 0) {
      const operation = this.optimisticQueue.shift();

      try {
        await this._syncOperation(operation);
      } catch (error) {
        console.error("Sync failed, rolling back", { operation, error });

        // Rollback on failure
        if (operation.rollback) {
          this._updateCache(operation.rollback);
        }

        // Show error to user
        this._notifyError(error, operation);
      }
    }

    this.syncInProgress = false;
  }

  /**
   * PRIVATE: Sync single operation to server
   */
  async _syncOperation(operation) {
    const startTime = performance.now();

    try {
      let response;

      switch (operation.type) {
        case "add":
          response = await userHttpService.post(
            `${this.baseUrl}/items`,
            {
              productId: operation.productId,
              quantity: operation.quantity,
              notes: operation.notes,
              metadata: operation.metadata,
            },
            {
              headers: {
                "idempotency-key": operation.idempotencyKey,
              },
            }
          );
          break;

        case "update":
          response = await userHttpService.put(
            `${this.baseUrl}/items/${operation.productId}`,
            {
              quantity: operation.quantity,
              notes: operation.notes,
            }
          );
          break;

        case "remove":
          response = await userHttpService.delete(
            `${this.baseUrl}/items/${operation.productId}`
          );
          break;

        default:
          throw new Error(`Unknown operation: ${operation.type}`);
      }

      // Update cache with server response
      const serverCart = this._transformCart(
        response.data?.data || response.data
      );
      this._updateCache(serverCart);

      const latency = performance.now() - startTime;
      console.log("✅ Synced to server", {
        type: operation.type,
        latency: `${latency.toFixed(2)}ms`,
      });
    } catch (error) {
      console.error("Sync operation failed", { operation, error });
      throw error;
    }
  }

  /**
   * PRIVATE: Revalidate cache in background
   */
  _revalidateInBackground() {
    setTimeout(async () => {
      try {
        await this._fetchCartFromServer();
      } catch (error) {
        console.error("Background revalidation failed", error);
      }
    }, 0);
  }

  /**
   * PRIVATE: Transform backend cart
   */
  _transformCart(backendCart) {
    if (!backendCart) return this._getEmptyCart();

    const cart = backendCart.cart || backendCart;

    return {
      items: (cart.items || []).map((item) => ({
        _id: item.product?._id || item.product,
        product: item.product,
        snapshot: item.snapshot,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        notes: item.notes || "",
        metadata: item.metadata || {},
        // UI fields
        name: item.snapshot?.name || item.product?.name || "Unknown Product",
        price: item.unitPrice,
        featureImage: item.snapshot?.featureImage || item.product?.featureImage,
        numberInStock: item.product?.stock || item.product?.numberInStock || 0,
        sku: item.snapshot?.sku || item.product?.sku,
      })),
      pricing: {
        subtotal: cart.subtotal || 0,
        discount: cart.discount || 0,
        tax: cart.tax || 0,
        shippingFee: cart.shippingFee || 0,
        total: cart.total || 0,
      },
      totals: {
        items: cart.totalItems || 0,
        savings: cart.totalSavings || 0,
      },
      metadata: cart.metadata || {},
      timestamp: Date.now(),
      _optimistic: false,
    };
  }

  /**
   * PRIVATE: Get empty cart
   */
  _getEmptyCart() {
    return {
      items: [],
      pricing: { subtotal: 0, discount: 0, tax: 0, shippingFee: 0, total: 0 },
      totals: { items: 0, savings: 0 },
      metadata: {},
      timestamp: Date.now(),
    };
  }

  /**
   * PRIVATE: Notify user of error
   */
  _notifyError(error, operation) {
    // Emit custom event for UI to handle
    window.dispatchEvent(
      new CustomEvent("cart-error", {
        detail: {
          message: error.message,
          operation: operation.type,
          productId: operation.productId,
        },
      })
    );
  }

  /**
   * PRIVATE: Handle errors
   */
  _handleError(error) {
    console.error("Cart Service Error:", error);

    if (error.response) {
      const data = error.response.data;
      const errorCode = data.code || data.error?.code;
      const errorMessage = data.message || data.error?.message;

      const errorMap = {
        INSUFFICIENT_STOCK: "Not enough stock available",
        PRODUCT_NOT_FOUND: "Product no longer available",
        PRODUCT_INACTIVE: "Product is not available",
        VALIDATION_ERROR: errorMessage || "Invalid data",
        CART_LOCKED: "Cart is being updated, please try again",
        default: errorMessage || "Failed to update cart",
      };

      throw new Error(errorMap[errorCode] || errorMap.default);
    }

    throw new Error(error.message || "An unexpected error occurred");
  }

  /**
   * Clear cache (for logout, etc.)
   */
  clearCache() {
    this.memoryCache.clear();
    this.pendingRequests.clear();
    this.optimisticQueue = [];
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      cacheHitRate:
        (this.metrics.cacheHits /
          (this.metrics.cacheHits + this.metrics.cacheMisses)) *
        100,
    };
  }
}

// Singleton
const cartService = new CartService();
export default cartService;

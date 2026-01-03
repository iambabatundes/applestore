// services/cartService.js
import { userHttpService } from "./http/index";
import { v4 as uuidv4 } from "uuid";

class CartService {
  constructor() {
    this.baseUrl = "/api/carts";

    this.cache = new Map();
    this.pendingRequests = new Map();

    // Metrics
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      apiCalls: 0,
      errors: 0,
      avgLatency: 0,
    };
  }

  async getCart(options = {}) {
    const cacheKey = "cart";
    const now = Date.now();

    // Check cache first
    if (this.cache.has(cacheKey) && !options.skipCache) {
      const cached = this.cache.get(cacheKey);
      const age = now - cached.timestamp;

      // Return fresh cache (< 30s)
      if (age < 30000) {
        this.metrics.cacheHits++;
        return cached.data;
      }

      // Stale cache (< 5min) - return and revalidate
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

  async addToCart(productId, quantity = 1, notes = "", metadata = {}) {
    const startTime = performance.now();
    const idempotencyKey = uuidv4();

    try {
      this.metrics.apiCalls++;

      const response = await userHttpService.post(
        `${this.baseUrl}`,
        {
          productId,
          quantity,
          notes,
          metadata,
        },
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        }
      );

      const cart = this._transformBackendResponse(response.data);
      this._updateCache(cart);

      const latency = performance.now() - startTime;
      this._updateMetrics(latency);

      return cart;
    } catch (error) {
      this.metrics.errors++;
      throw this._handleError(error);
    }
  }

  async updateQuantity(productId, quantity, notes = "") {
    const startTime = performance.now();

    try {
      this.metrics.apiCalls++;

      const response = await userHttpService.put(
        `${this.baseUrl}/${productId}`,
        {
          quantity,
          notes,
        }
      );

      const cart = this._transformBackendResponse(response.data);
      this._updateCache(cart);

      const latency = performance.now() - startTime;
      this._updateMetrics(latency);

      return cart;
    } catch (error) {
      this.metrics.errors++;
      throw this._handleError(error);
    }
  }

  async removeItem(productId) {
    try {
      this.metrics.apiCalls++;

      const response = await userHttpService.delete(
        `${this.baseUrl}/${productId}`
      );

      const cart = this._transformBackendResponse(response.data);
      this._updateCache(cart);

      return cart;
    } catch (error) {
      this.metrics.errors++;
      throw this._handleError(error);
    }
  }

  async saveForLater(productId) {
    try {
      this.metrics.apiCalls++;

      const response = await userHttpService.post(
        `${this.baseUrl}/${productId}/save-for-later`
      );

      const cart = this._transformBackendResponse(response.data);
      this._updateCache(cart);

      return cart;
    } catch (error) {
      this.metrics.errors++;
      throw this._handleError(error);
    }
  }

  async moveToCart(productId) {
    try {
      this.metrics.apiCalls++;

      const response = await userHttpService.post(
        `${this.baseUrl}/saved-items/${productId}/move-to-cart`
      );

      const cart = this._transformBackendResponse(response.data);
      this._updateCache(cart);

      return cart;
    } catch (error) {
      this.metrics.errors++;
      throw this._handleError(error);
    }
  }

  async removeFromSaved(productId) {
    try {
      this.metrics.apiCalls++;

      const response = await userHttpService.delete(
        `${this.baseUrl}/saved-items/${productId}`
      );

      const cart = this._transformBackendResponse(response.data);
      this._updateCache(cart);

      return cart;
    } catch (error) {
      this.metrics.errors++;
      throw this._handleError(error);
    }
  }

  async getSavedItems() {
    try {
      const response = await userHttpService.get(`${this.baseUrl}/saved-items`);
      return response.data.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async clearSavedItems() {
    try {
      this.metrics.apiCalls++;

      const response = await userHttpService.delete(
        `${this.baseUrl}/saved-items`
      );
      return response.data;
    } catch (error) {
      this.metrics.errors++;
      throw this._handleError(error);
    }
  }

  async validateForCheckout() {
    try {
      const response = await userHttpService.get(`${this.baseUrl}/validate`);
      return response.data.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async getCartSummary() {
    try {
      const response = await userHttpService.get(`${this.baseUrl}/summary`);
      return response.data.data;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  async clearCart() {
    try {
      this.metrics.apiCalls++;

      const response = await userHttpService.delete(this.baseUrl);

      // Clear cache
      this.cache.clear();

      return response.data;
    } catch (error) {
      this.metrics.errors++;
      throw this._handleError(error);
    }
  }

  async mergeCart(guestCartId) {
    try {
      const response = await userHttpService.post(`${this.baseUrl}/merge`, {
        guestCartId,
      });

      const cart = this._transformBackendResponse(response.data);
      this._updateCache(cart);

      return cart;
    } catch (error) {
      throw this._handleError(error);
    }
  }

  // Private methods
  async _fetchCartFromServer() {
    const startTime = performance.now();

    try {
      this.metrics.apiCalls++;
      this.metrics.cacheMisses++;

      const response = await userHttpService.get(this.baseUrl);

      const cart = this._transformBackendResponse(response.data);
      this._updateCache(cart);

      const latency = performance.now() - startTime;
      this._updateMetrics(latency);

      return cart;
    } catch (error) {
      this.metrics.errors++;
      throw this._handleError(error);
    }
  }

  _revalidateInBackground() {
    setTimeout(async () => {
      try {
        await this._fetchCartFromServer();
      } catch (error) {
        console.error("Background revalidation failed:", error);
      }
    }, 0);
  }

  _transformBackendResponse(backendResponse) {
    const responseData = backendResponse.data || backendResponse;
    const cart = responseData.cart || responseData;

    if (!cart) {
      return this._getEmptyCart();
    }

    return {
      id: cart.id || cart._id,

      // Items with proper structure
      items: (cart.items || []).map((item) => ({
        _id: item.product._id || item.product,
        product: item.product,
        snapshot: item.snapshot,
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        notes: item.notes || "",
        metadata: item.metadata || {},
        addedAt: item.addedAt,
        updatedAt: item.updatedAt,

        // UI convenience fields
        name: item.snapshot.name || item.product.name || "Unknown Product",
        price: item.unitPrice,
        featureImage: item.snapshot.featureImage || item.product.featureImage,
        numberInStock:
          typeof item.product.numberInStock === "number"
            ? item.product.numberInStock
            : undefined,

        sku: item.snapshot.sku || item.product.sku,
        isActive: item.product.isActive !== false,
      })),

      // Saved items
      savedItems: (cart.savedItems || []).map((item) => ({
        _id: item.product._id || item.product,
        product: item.product,
        snapshot: item.snapshot,
        quantity: item.quantity || 1,
        savedQuantity: item.savedQuantity || item.quantity || 1,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        notes: item.notes || "",
        metadata: item.metadata || {},
        savedAt: item.savedAt,
        addedAt: item.addedAt,
        updatedAt: item.updatedAt,

        // UI convenience fields
        name: item.snapshot?.name || item.product.name || "Unknown Product",
        price: item.unitPrice,
        featureImage: item.snapshot.featureImage || item.product.featureImage,
        numberInStock: item.product.numberInStock || 0,
        sku: item.snapshot.sku || item.product.sku,
        isActive: item.product.isActive !== false,
      })),

      subtotal: cart.subtotal || 0,

      // Summary information
      totalItems: cart.totalItems || 0,
      totalSavings: cart.totalSavings || 0,
      isEmpty: cart.isEmpty !== undefined ? cart.isEmpty : true,
      requiresShipping: cart.requiresShipping || false,

      // Status
      status: cart.status || "active",
      flags: cart.flags || {},

      // Metadata
      unavailableItems: responseData.unavailableItems || [],
      warnings: responseData.warnings || [],
      timestamp: Date.now(),
      _fromServer: true,
    };
  }

  _updateCache(cart) {
    this.cache.set("cart", {
      data: cart,
      timestamp: Date.now(),
    });
  }

  _getEmptyCart() {
    return {
      items: [],
      savedItems: [],
      subtotal: 0,
      totalItems: 0,
      totalSavings: 0,
      isEmpty: true,
      requiresShipping: false,
      unavailableItems: [],
      warnings: [],
      timestamp: Date.now(),
    };
  }

  _handleError(error) {
    console.error("Cart Service Error:", error);

    if (error.response?.data) {
      const errorData = error.response.data;

      const errorMessage =
        errorData.error?.message ||
        errorData.message ||
        "Cart operation failed";
      const errorType = errorData.error?.type || "CartError";
      const errorField = errorData.error?.field;

      const customError = new Error(errorMessage);
      customError.type = errorType;
      customError.field = errorField;
      customError.statusCode = error.response.status;

      // Attach additional error details
      if (errorData.error?.available !== undefined) {
        customError.available = errorData.error.available;
      }
      if (errorData.error?.requested !== undefined) {
        customError.requested = errorData.error.requested;
      }

      return customError;
    }

    return error;
  }

  _updateMetrics(latency) {
    this.metrics.avgLatency = (this.metrics.avgLatency + latency) / 2;
  }

  getMetrics() {
    return {
      ...this.metrics,
      cacheHitRate:
        (this.metrics.cacheHits /
          (this.metrics.cacheHits + this.metrics.cacheMisses)) *
        100,
      errorRate: (this.metrics.errors / this.metrics.apiCalls) * 100,
    };
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}

// Singleton instance
const cartService = new CartService();
export default cartService;

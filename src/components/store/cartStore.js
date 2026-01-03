// store/cartStore.js - Simplified to match backend
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import cartService from "../../services/cartService";
import { toast } from "react-toastify";

function sanitizeCartItem(item) {
  if (!item) return null;

  return {
    _id: item._id || item.id,
    product: item.product?._id || item.product,
    name: item.name || item.snapshot?.name || "",
    price: item.price || item.unitPrice || 0,
    unitPrice: item.unitPrice || item.price || 0,
    totalPrice: item.totalPrice || 0,
    quantity: item.quantity || 1,
    notes: item.notes || "",
    sku: item.sku || item.snapshot?.sku || "",
    numberInStock: item.numberInStock,
    isActive: item.isActive !== false,

    // Feature image
    featureImage:
      typeof item.featureImage === "string"
        ? item.featureImage
        : item.featureImage?.url ||
          item.featureImage?.filename ||
          item.snapshot?.featureImage ||
          "",

    // Snapshot data
    snapshot: item.snapshot
      ? {
          name: item.snapshot.name,
          sku: item.snapshot.sku,
          price: item.snapshot.price,
          salePrice: item.snapshot.salePrice,
          featureImage:
            typeof item.snapshot.featureImage === "string"
              ? item.snapshot.featureImage
              : item.snapshot.featureImage?.url || "",
          category:
            typeof item.snapshot.category === "string"
              ? item.snapshot.category
              : "",
          weight: item.snapshot.weight,
          isDigital: item.snapshot.isDigital || false,
        }
      : null,

    // Metadata
    metadata: item.metadata || {},
    addedAt: item.addedAt,
    updatedAt: item.updatedAt,
    savedAt: item.savedAt,
    savedQuantity: item.savedQuantity,

    // Optimistic update flags
    _optimistic: item._optimistic || false,
    _timestamp: item._timestamp || Date.now(),
  };
}

function sanitizeProduct(product) {
  if (!product) return null;

  return {
    _id: product._id || product.id,
    name: product.name || "",
    price: product.price || 0,
    salePrice: product.salePrice,
    // stock: product.stock || product.numberInStock || 0,
    numberInStock: product.numberInStock,
    sku: product.sku || "",
    isActive: product.isActive !== false,

    featureImage:
      typeof product.featureImage === "string"
        ? product.featureImage
        : product.featureImage?.url || product.featureImage?.filename || "",

    category:
      typeof product.category === "string"
        ? product.category
        : Array.isArray(product.category)
        ? product.category
            .map((c) =>
              typeof c === "string" ? c : c?.name || c?._id?.toString() || ""
            )
            .join(", ")
        : product.category?.name || product.category?._id?.toString() || "",

    weight: product.weight,
    dimensions: product.dimensions,
    isDigital: product.isDigital || false,
    promotion: product.promotion?._id || product.promotion,
  };
}

class OperationQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.maxRetries = 3;
  }

  add(operation) {
    this.queue.push({ ...operation, retries: 0 });
    if (!this.processing) {
      this.process();
    }
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const operation = this.queue.shift();

      try {
        await operation.execute();
      } catch (error) {
        console.error("Queue operation failed:", error);

        if (
          operation.retries < this.maxRetries &&
          operation.retryable !== false
        ) {
          operation.retries++;
          this.queue.unshift(operation);

          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, operation.retries) * 1000)
          );
        } else if (operation.onError) {
          operation.onError(error);
        }
      }
    }

    this.processing = false;
  }

  clear() {
    this.queue = [];
    this.processing = false;
  }
}

const operationQueue = new OperationQueue();

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      savedItems: [],
      serverCart: null,
      isLoading: false,
      error: null,
      lastSync: null,
      syncInProgress: false,
      pendingOperations: new Set(),
      validationErrors: {},
      stockWarnings: {},

      // Add item to cart
      addToCart: async (product, quantity = 1, notes = "") => {
        const sanitizedProduct = sanitizeProduct(product);
        const productId = sanitizedProduct._id;

        if (!sanitizedProduct || !productId) {
          throw new Error("Invalid product");
        }

        try {
          set((state) => ({
            pendingOperations: new Set(state.pendingOperations).add(productId),
            error: null,
          }));

          // Optimistic update
          set((state) => {
            const existingIndex = state.cartItems.findIndex(
              (item) => item._id === productId
            );

            let updatedItems;
            if (existingIndex >= 0) {
              updatedItems = [...state.cartItems];
              const existing = updatedItems[existingIndex];

              updatedItems[existingIndex] = sanitizeCartItem({
                ...existing,
                quantity: existing.quantity + quantity,
                totalPrice: existing.unitPrice * (existing.quantity + quantity),
                _optimistic: true,
                _timestamp: Date.now(),
              });
            } else {
              const optimisticItem = sanitizeCartItem({
                _id: productId,
                product: productId,
                name: sanitizedProduct.name,
                price: sanitizedProduct.salePrice || sanitizedProduct.price,
                featureImage: sanitizedProduct.featureImage,
                quantity: quantity,
                unitPrice: sanitizedProduct.salePrice || sanitizedProduct.price,
                totalPrice:
                  (sanitizedProduct.salePrice || sanitizedProduct.price) *
                  quantity,
                notes: notes,
                numberInStock: sanitizedProduct.stock,
                isActive: sanitizedProduct.isActive,
                sku: sanitizedProduct.sku,
                _optimistic: true,
                _timestamp: Date.now(),
              });

              updatedItems = [...state.cartItems, optimisticItem];
            }

            return { cartItems: updatedItems, error: null };
          });

          toast.success(`${sanitizedProduct.name} added to cart!`, {
            position: "top-right",
            autoClose: 2000,
            icon: "🛒",
          });

          // Queue server sync
          operationQueue.add({
            execute: async () => {
              try {
                const serverCart = await cartService.addToCart(
                  productId,
                  quantity,
                  notes,
                  { addedAt: new Date().toISOString() }
                );

                set((state) => {
                  const pendingOps = new Set(state.pendingOperations);
                  pendingOps.delete(productId);

                  return {
                    serverCart,
                    cartItems: (serverCart.items || []).map(sanitizeCartItem),
                    savedItems: (serverCart.savedItems || []).map(
                      sanitizeCartItem
                    ),
                    pendingOperations: pendingOps,
                    lastSync: new Date().toISOString(),
                    error: null,
                  };
                });
              } catch (error) {
                set((state) => {
                  const pendingOps = new Set(state.pendingOperations);
                  pendingOps.delete(productId);

                  const cartItems = state.cartItems.filter(
                    (item) => !(item._optimistic && item._id === productId)
                  );

                  return {
                    cartItems,
                    pendingOperations: pendingOps,
                    error: error.message,
                  };
                });

                toast.error(error.message || "Failed to add item", {
                  position: "top-right",
                  autoClose: 3000,
                });
              }
            },
            retryable: true,
          });

          return true;
        } catch (error) {
          console.error("Add to cart failed:", error);

          set((state) => {
            const pendingOps = new Set(state.pendingOperations);
            pendingOps.delete(productId);
            return {
              pendingOperations: pendingOps,
              error: error.message,
            };
          });

          toast.error(error.message || "Failed to add item", {
            position: "top-right",
            autoClose: 3000,
          });

          throw error;
        }
      },

      // Update quantity
      updateQuantity: async (productId, quantity, notes = "") => {
        try {
          set((state) => ({
            pendingOperations: new Set(state.pendingOperations).add(productId),
            error: null,
          }));

          const currentItem = get().cartItems.find(
            (item) => item._id === productId
          );

          const stock = currentItem?.numberInStock;
          if (stock !== undefined && stock !== null && quantity > stock) {
            throw new Error("Out of Stock");
          }

          // Optimistic update
          set((state) => {
            const updatedItems = state.cartItems.map((item) => {
              if (item._id === productId) {
                return sanitizeCartItem({
                  ...item,
                  quantity: quantity,
                  totalPrice: item.unitPrice * quantity,
                  notes: notes || item.notes,
                  _optimistic: true,
                });
              }
              return item;
            });

            return { cartItems: updatedItems };
          });

          // Queue server sync
          operationQueue.add({
            execute: async () => {
              try {
                const serverCart = await cartService.updateQuantity(
                  productId,
                  quantity,
                  notes
                );

                set((state) => {
                  const pendingOps = new Set(state.pendingOperations);
                  pendingOps.delete(productId);

                  return {
                    serverCart,
                    cartItems: (serverCart.items || []).map(sanitizeCartItem),
                    savedItems: (serverCart.savedItems || []).map(
                      sanitizeCartItem
                    ),
                    pendingOperations: pendingOps,
                    error: null,
                  };
                });
              } catch (error) {
                // Rollback
                set((state) => {
                  const pendingOps = new Set(state.pendingOperations);
                  pendingOps.delete(productId);

                  const cartItems = state.cartItems.map((item) => {
                    if (item._id === productId && currentItem) {
                      return sanitizeCartItem({
                        ...item,
                        quantity: currentItem.quantity,
                        totalPrice: item.unitPrice * currentItem.quantity,
                        _optimistic: false,
                      });
                    }
                    return item;
                  });

                  return {
                    cartItems,
                    pendingOperations: pendingOps,
                    error: error.message,
                  };
                });

                toast.error(error.message, {
                  position: "top-right",
                  autoClose: 3000,
                });
              }
            },
            retryable: true,
          });

          return true;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Remove item
      removeItem: async (productId) => {
        try {
          const item = get().cartItems.find((i) => i._id === productId);
          const itemName = item?.name || "Item";

          set((state) => ({
            pendingOperations: new Set(state.pendingOperations).add(productId),
          }));

          // Optimistic removal
          set((state) => ({
            cartItems: state.cartItems.filter((item) => item._id !== productId),
          }));

          toast.info(`${itemName} removed from cart`, {
            position: "top-right",
            autoClose: 2000,
          });

          // Queue server sync
          operationQueue.add({
            execute: async () => {
              try {
                const serverCart = await cartService.removeItem(productId);

                set((state) => {
                  const pendingOps = new Set(state.pendingOperations);
                  pendingOps.delete(productId);

                  return {
                    serverCart,
                    cartItems: (serverCart.items || []).map(sanitizeCartItem),
                    savedItems: (serverCart.savedItems || []).map(
                      sanitizeCartItem
                    ),
                    pendingOperations: pendingOps,
                    error: null,
                  };
                });
              } catch (error) {
                set((state) => {
                  const pendingOps = new Set(state.pendingOperations);
                  pendingOps.delete(productId);
                  return {
                    pendingOperations: pendingOps,
                    error: error.message,
                  };
                });

                toast.error("Failed to remove item", {
                  position: "top-right",
                  autoClose: 3000,
                });
              }
            },
            retryable: true,
          });

          return true;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      updateCustomQuantity: async (productId, quantity, notes = "") => {
        if (quantity < 10) {
          throw new Error("Custom quantity must be 10 or more");
        }
        return get().updateQuantity(productId, quantity, notes);
      },

      // Save for later operations
      saveForLater: async (productId) => {
        try {
          const item = get().cartItems.find((i) => i._id === productId);

          if (!item) {
            throw new Error("Item not found in cart");
          }

          // Optimistic update
          set((state) => {
            const savedItem = sanitizeCartItem({
              ...item,
              savedAt: new Date().toISOString(),
              savedQuantity: item.quantity || 1,
            });

            return {
              cartItems: state.cartItems.filter((i) => i._id !== productId),
              savedItems: [...state.savedItems, savedItem],
              error: null,
            };
          });

          toast.success("Item saved for later", {
            position: "top-right",
            autoClose: 2000,
          });

          const serverCart = await cartService.saveForLater(productId);

          set({
            serverCart,
            cartItems: (serverCart.items || []).map(sanitizeCartItem),
            savedItems: (serverCart.savedItems || []).map(sanitizeCartItem),
            error: null,
          });

          return true;
        } catch (error) {
          set({ error: error.message });
          toast.error(error.message || "Failed to save item", {
            position: "top-right",
            autoClose: 3000,
          });
          throw error;
        }
      },

      moveToCart: async (productId) => {
        try {
          const savedItem = get().savedItems.find(
            (item) => item._id === productId
          );

          if (!savedItem) {
            throw new Error("Item not found in saved items");
          }

          const serverCart = await cartService.moveToCart(productId);

          set({
            serverCart,
            cartItems: (serverCart.items || []).map(sanitizeCartItem),
            savedItems: (serverCart.savedItems || []).map(sanitizeCartItem),
            error: null,
          });

          toast.success("Item moved to cart", {
            position: "top-right",
            autoClose: 2000,
          });

          return true;
        } catch (error) {
          set({ error: error.message });
          toast.error(error.message || "Failed to move item to cart", {
            position: "top-right",
            autoClose: 3000,
          });
          throw error;
        }
      },

      removeFromSaved: async (productId) => {
        try {
          set((state) => ({
            savedItems: state.savedItems.filter(
              (item) => item._id !== productId
            ),
            error: null,
          }));

          const serverCart = await cartService.removeFromSaved(productId);

          set({
            serverCart,
            savedItems: (serverCart.savedItems || []).map(sanitizeCartItem),
            error: null,
          });

          return true;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      clearSaved: async () => {
        try {
          set({ savedItems: [], error: null });
          await cartService.clearSavedItems();
          return true;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Sync cart with server
      syncCart: async (options = {}) => {
        if (get().syncInProgress && !options.force) return;

        set({ syncInProgress: true, error: null });

        try {
          const serverCart = await cartService.getCart(options);

          set({
            serverCart,
            cartItems: (serverCart.items || []).map(sanitizeCartItem),
            savedItems: (serverCart.savedItems || []).map(sanitizeCartItem),
            lastSync: new Date().toISOString(),
            error: null,
            syncInProgress: false,
          });

          return serverCart;
        } catch (error) {
          set({
            error: error.message,
            syncInProgress: false,
          });
          throw error;
        }
      },

      // Validate for checkout
      validateCartForCheckout: async () => {
        try {
          const validation = await cartService.validateForCheckout();
          return validation;
        } catch (error) {
          return {
            isValid: false,
            errors: [error.message],
            warnings: [],
          };
        }
      },

      // Get cart summary
      getCartSummary: async () => {
        try {
          set({ isLoading: true, error: null });
          const summary = await cartService.getCartSummary();
          set({ error: null, isLoading: false });
          return summary;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Clear cart
      clearCart: async () => {
        try {
          set({ cartItems: [], error: null });

          toast.info("Cart cleared", {
            position: "top-right",
            autoClose: 2000,
          });

          await cartService.clearCart();

          set({ serverCart: null, error: null });

          return true;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Merge carts (for login)
      mergeCart: async (guestCartId) => {
        try {
          set({ isLoading: true, error: null });

          const serverCart = await cartService.mergeCart(guestCartId);

          set({
            serverCart,
            cartItems: (serverCart.items || []).map(sanitizeCartItem),
            savedItems: (serverCart.savedItems || []).map(sanitizeCartItem),
            isLoading: false,
            error: null,
          });

          toast.success("Carts merged successfully", {
            position: "top-right",
            autoClose: 2000,
          });

          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Utility methods
      setCartItems: (items) => {
        set({
          cartItems: Array.isArray(items) ? items.map(sanitizeCartItem) : [],
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      isPending: (productId) => {
        return get().pendingOperations.has(productId);
      },

      // Get cart totals (simplified - only subtotal)
      getCartTotals: () => {
        const { serverCart, cartItems } = get();

        if (serverCart) {
          return {
            itemCount: serverCart.totalItems || 0,
            uniqueItems: serverCart.items?.length || 0,
            subtotal: serverCart.subtotal || 0,
            totalSavings: serverCart.totalSavings || 0,
          };
        }

        const itemCount = cartItems.reduce((total, item) => {
          return total + (item.quantity || 1);
        }, 0);

        const subtotal = cartItems.reduce((total, item) => {
          return (
            total + (item.price || item.unitPrice || 0) * (item.quantity || 1)
          );
        }, 0);

        return {
          itemCount,
          uniqueItems: cartItems.length,
          subtotal,
          totalSavings: 0,
        };
      },

      // In cartStore.js - Replace the checkStockAvailability function with this:

      checkStockAvailability: (itemId) => {
        const item = get().cartItems.find((i) => i._id === itemId);

        if (!item) {
          return {
            itemId,
            error: "Item not found",
            isAvailable: false,
            status: "error",
          };
        }

        // If item is being updated optimistically, don't show stock errors yet
        if (item._optimistic || get().pendingOperations.has(itemId)) {
          return {
            itemId,
            itemName: item.name,
            currentQuantity: item.quantity || 1,
            availableStock: item.numberInStock,
            isAvailable: true,
            remaining: null,
            status: "pending",
          };
        }

        const quantity = item.quantity || 1;
        const stock = item.numberInStock;

        // If stock is undefined/null, assume it's available (don't show error)
        if (stock === undefined || stock === null) {
          return {
            itemId,
            itemName: item.name,
            currentQuantity: quantity,
            availableStock: stock,
            isAvailable: true,
            remaining: null,
            status: "available",
          };
        }

        const isAvailable = stock > 0 && quantity <= stock;

        return {
          itemId,
          itemName: item.name,
          currentQuantity: quantity,
          availableStock: stock,
          isAvailable: isAvailable,
          remaining: Math.max(0, stock - quantity),
          status:
            stock === 0
              ? "out_of_stock"
              : quantity <= stock
              ? "available"
              : "exceeds_stock",
        };
      },

      getStockWarnings: () => {
        const warnings = [];
        get().cartItems.forEach((item) => {
          const stockInfo = get().checkStockAvailability(item._id);
          if (!stockInfo.isAvailable) {
            warnings.push(stockInfo);
          }
        });
        return warnings;
      },

      autoFixStockIssues: async () => {
        const warnings = get().getStockWarnings();
        const results = [];

        for (const warning of warnings) {
          try {
            await get().updateQuantity(warning.itemId, warning.availableStock);
            results.push({
              itemId: warning.itemId,
              success: true,
              message: `Adjusted ${warning.itemName} to ${warning.availableStock}`,
            });
          } catch (error) {
            results.push({
              itemId: warning.itemId,
              success: false,
              message: error.message,
            });
          }
        }

        return results;
      },

      get isEmpty() {
        return get().cartItems.length === 0;
      },

      get selectedQuantities() {
        const quantities = {};
        get().cartItems.forEach((item) => {
          quantities[item._id] = item.quantity || 1;
        });
        return quantities;
      },

      get quantityTenPlus() {
        const quantities = {};
        get().cartItems.forEach((item) => {
          if ((item.quantity || 1) >= 10) {
            quantities[item._id] = item.quantity;
          }
        });
        return quantities;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      version: 8,
      partialize: (state) => ({
        cartItems: state.cartItems.map(sanitizeCartItem),
        savedItems: state.savedItems.map(sanitizeCartItem),
        lastSync: state.lastSync,
      }),
      migrate: (persistedState, version) => {
        if (version < 8) {
          return {
            ...persistedState,
            cartItems: (persistedState.cartItems || []).map(sanitizeCartItem),
            savedItems: (persistedState.savedItems || []).map(sanitizeCartItem),
            serverCart: null,
            syncInProgress: false,
            lastSync: persistedState.lastSync || null,
            pendingOperations: new Set(),
            validationErrors: {},
            stockWarnings: {},
          };
        }
        return persistedState;
      },
    }
  )
);

// Auto-sync on mount
if (typeof window !== "undefined") {
  const checkAndSyncCart = async () => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (token) {
      try {
        await useCartStore.getState().syncCart({ force: true });
        console.log("Cart synced successfully on mount");
      } catch (error) {
        console.error("Cart sync failed on mount:", error);
      }
    }
  };

  checkAndSyncCart();

  window.addEventListener("storage", (event) => {
    if (event.key === "accessToken" || event.key === "token") {
      checkAndSyncCart();
    }
  });
}

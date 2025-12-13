// store/cartStore.js - OPTIMIZED VERSION
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import cartService from "../../services/cartService";
import { toast } from "react-toastify";

// Queue for async operations
class OperationQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  add(operation) {
    this.queue.push(operation);
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
        if (operation.onError) {
          operation.onError(error);
        }
      }
    }

    this.processing = false;
  }
}

const operationQueue = new OperationQueue();

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      cartItems: [],
      savedItems: [],
      serverCart: null,
      isLoading: false,
      error: null,
      lastSync: null,
      syncInProgress: false,
      pendingOperations: new Set(),
      optimisticUpdates: new Map(), // Track optimistic updates

      // OPTIMIZED: Add to cart with instant feedback
      addToCart: async (product, quantity = 1, notes = "") => {
        const productId = product._id || product.id;

        try {
          // 1. INSTANT: Mark as pending
          set((state) => ({
            pendingOperations: new Set(state.pendingOperations).add(productId),
            error: null,
          }));

          // 2. INSTANT: Apply optimistic update (< 5ms)
          const optimisticItem = {
            _id: productId,
            product: product,
            name: product.name,
            price: product.salePrice || product.price,
            featureImage: product.featureImage,
            quantity: quantity,
            unitPrice: product.salePrice || product.price,
            totalPrice: (product.salePrice || product.price) * quantity,
            notes: notes,
            numberInStock: product.numberInStock,
            isActive: product.isActive,
            sku: product.sku,
            _optimistic: true,
            _timestamp: Date.now(),
          };

          set((state) => {
            const existingIndex = state.cartItems.findIndex(
              (item) => (item._id || item.product?._id) === productId
            );

            let updatedItems;
            if (existingIndex >= 0) {
              // Update existing item
              updatedItems = [...state.cartItems];
              updatedItems[existingIndex] = {
                ...updatedItems[existingIndex],
                quantity: updatedItems[existingIndex].quantity + quantity,
                totalPrice:
                  updatedItems[existingIndex].unitPrice *
                  (updatedItems[existingIndex].quantity + quantity),
                _optimistic: true,
              };
            } else {
              // Add new item
              updatedItems = [...state.cartItems, optimisticItem];
            }

            // Remove from saved if exists
            const savedItems = state.savedItems.filter(
              (item) => item._id !== productId
            );

            return {
              cartItems: updatedItems,
              savedItems,
              error: null,
            };
          });

          // 3. Show instant success feedback
          toast.success(`${product.name} added to cart!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            icon: "🛒",
          });

          // 4. ASYNC: Queue server sync
          operationQueue.add({
            execute: async () => {
              try {
                const serverCart = await cartService.addToCart(
                  productId,
                  quantity,
                  notes,
                  { addedAt: new Date().toISOString() }
                );

                // Update with server response
                set((state) => {
                  const pendingOps = new Set(state.pendingOperations);
                  pendingOps.delete(productId);

                  return {
                    serverCart,
                    cartItems: serverCart.items || state.cartItems,
                    pendingOperations: pendingOps,
                    lastSync: new Date().toISOString(),
                    error: null,
                  };
                });
              } catch (error) {
                console.error("Server sync failed:", error);

                // Rollback optimistic update
                set((state) => {
                  const pendingOps = new Set(state.pendingOperations);
                  pendingOps.delete(productId);

                  // Remove or revert the optimistic item
                  const cartItems = state.cartItems.filter(
                    (item) =>
                      !(
                        item._optimistic &&
                        (item._id || item.product?._id) === productId
                      )
                  );

                  return {
                    cartItems,
                    pendingOperations: pendingOps,
                    error: error.message,
                  };
                });

                toast.error(error.message || "Failed to add item to cart", {
                  position: "top-right",
                  autoClose: 3000,
                });
              }
            },
            onError: (error) => {
              console.error("Queue execution failed:", error);
            },
          });

          // 5. Remove pending state after brief delay
          setTimeout(() => {
            set((state) => {
              const pendingOps = new Set(state.pendingOperations);
              pendingOps.delete(productId);
              return { pendingOperations: pendingOps };
            });
          }, 100);

          return true;
        } catch (error) {
          // Remove pending state
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

      // OPTIMIZED: Update quantity with instant feedback
      updateQuantity: async (productId, quantity, notes = "") => {
        try {
          // Mark as pending
          set((state) => ({
            pendingOperations: new Set(state.pendingOperations).add(productId),
          }));

          // Apply optimistic update
          set((state) => {
            const updatedItems = state.cartItems.map((item) => {
              if ((item._id || item.product?._id) === productId) {
                return {
                  ...item,
                  quantity: quantity,
                  totalPrice: item.unitPrice * quantity,
                  notes: notes || item.notes,
                  _optimistic: true,
                };
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
                    cartItems: serverCart.items || state.cartItems,
                    pendingOperations: pendingOps,
                    error: null,
                  };
                });
              } catch (error) {
                console.error("Update quantity sync failed:", error);

                set((state) => {
                  const pendingOps = new Set(state.pendingOperations);
                  pendingOps.delete(productId);
                  return {
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
          });

          return true;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // OPTIMIZED: Remove item with instant feedback
      removeItem: async (productId) => {
        try {
          // Get item name for toast
          const item = get().cartItems.find(
            (i) => (i._id || i.product?._id) === productId
          );
          const itemName = item?.name || "Item";

          // Mark as pending
          set((state) => ({
            pendingOperations: new Set(state.pendingOperations).add(productId),
          }));

          // Apply optimistic removal
          set((state) => ({
            cartItems: state.cartItems.filter(
              (item) => (item._id || item.product?._id) !== productId
            ),
          }));

          // Show feedback
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
                    cartItems: serverCart.items || state.cartItems,
                    pendingOperations: pendingOps,
                    error: null,
                  };
                });
              } catch (error) {
                console.error("Remove item sync failed:", error);

                // Could add rollback logic here
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
          });

          return true;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Update custom quantity (10+)
      updateCustomQuantity: async (productId, quantity, notes = "") => {
        try {
          if (quantity < 10) {
            throw new Error("Custom quantity must be 10 or more");
          }
          return await get().updateQuantity(productId, quantity, notes);
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Sync cart with server (background refresh)
      syncCart: async (options = {}) => {
        if (get().syncInProgress && !options.force) return;

        set({ syncInProgress: true, error: null });

        try {
          const serverCart = await cartService.getCart();

          set({
            serverCart,
            cartItems: serverCart.items || [],
            lastSync: new Date().toISOString(),
            error: null,
            syncInProgress: false,
          });
        } catch (error) {
          set({
            error: error.message,
            syncInProgress: false,
          });
        }
      },

      // Save for later (local only - instant)
      saveForLater: (productId) => {
        try {
          set((state) => {
            const itemToSave = state.cartItems.find(
              (item) => (item._id || item.product?._id) === productId
            );

            if (!itemToSave) {
              throw new Error("Item not found in cart");
            }

            const alreadySaved = state.savedItems.find(
              (item) => item._id === productId
            );
            if (alreadySaved) {
              throw new Error("Item already saved for later");
            }

            const savedItem = {
              ...itemToSave,
              savedAt: new Date().toISOString(),
              savedQuantity: itemToSave.quantity || 1,
            };

            const updatedCartItems = state.cartItems.filter(
              (item) => (item._id || item.product?._id) !== productId
            );

            return {
              cartItems: updatedCartItems,
              savedItems: [...state.savedItems, savedItem],
              error: null,
            };
          });

          toast.success("Item saved for later", {
            position: "top-right",
            autoClose: 2000,
          });

          return true;
        } catch (error) {
          set({ error: error.message });
          toast.error(error.message, {
            position: "top-right",
            autoClose: 3000,
          });
          throw error;
        }
      },

      // Move from saved to cart (instant)
      moveToCart: async (productId) => {
        try {
          const savedItem = get().savedItems.find(
            (item) => item._id === productId
          );

          if (!savedItem) {
            throw new Error("Item not found in saved items");
          }

          // Apply locally first
          set((state) => {
            const updatedSavedItems = state.savedItems.filter(
              (item) => item._id !== productId
            );

            const cartItem = {
              ...savedItem,
              quantity: savedItem.savedQuantity || 1,
              _optimistic: true,
            };

            return {
              cartItems: [...state.cartItems, cartItem],
              savedItems: updatedSavedItems,
              error: null,
            };
          });

          toast.success("Item moved to cart", {
            position: "top-right",
            autoClose: 2000,
          });

          // Sync in background
          setTimeout(() => get().syncCart(), 100);

          return true;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Remove from saved items (instant)
      removeFromSaved: (productId) => {
        try {
          set((state) => ({
            savedItems: state.savedItems.filter(
              (item) => item._id !== productId
            ),
            error: null,
          }));

          return true;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Apply coupon
      applyCoupon: async (couponCode) => {
        try {
          set({ isLoading: true, error: null });

          const serverCart = await cartService.applyCoupon(couponCode);

          set({
            serverCart,
            cartItems: serverCart.items || [],
            isLoading: false,
            error: null,
          });

          toast.success("Coupon applied successfully!", {
            position: "top-right",
            autoClose: 2000,
          });

          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          toast.error(error.message, {
            position: "top-right",
            autoClose: 3000,
          });
          throw error;
        }
      },

      // Remove coupon
      removeCoupon: async () => {
        try {
          set({ isLoading: true, error: null });

          const serverCart = await cartService.removeCoupon();

          set({
            serverCart,
            cartItems: serverCart.items || [],
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Clear cart
      clearCart: async () => {
        try {
          // Apply locally first
          set({
            cartItems: [],
            error: null,
          });

          toast.info("Cart cleared", {
            position: "top-right",
            autoClose: 2000,
          });

          // Sync with server
          await cartService.clearCart();

          set({
            serverCart: null,
            error: null,
          });

          return true;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Clear saved items
      clearSaved: () => {
        set({ savedItems: [], error: null });
        return true;
      },

      // Update shipping address
      updateShippingAddress: async (addressId) => {
        try {
          set({ isLoading: true, error: null });
          const serverCart = await cartService.updateShippingAddress(addressId);
          set({ serverCart, isLoading: false, error: null });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Update shipping method
      updateShippingMethod: async (shippingRateId) => {
        try {
          set({ isLoading: true, error: null });
          const serverCart = await cartService.updateShippingMethod(
            shippingRateId
          );
          set({ serverCart, isLoading: false, error: null });
          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Get cart summary for checkout
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

      // Validate cart for checkout
      validateCartForCheckout: async () => {
        try {
          const validation = await cartService.validateForCheckout();
          return validation;
        } catch (error) {
          return {
            isValid: false,
            errors: [error.message],
            warnings: [],
            cart: null,
            summary: null,
          };
        }
      },

      // Set cart items
      setCartItems: (items) => {
        set({
          cartItems: Array.isArray(items) ? items : [],
          error: null,
        });
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Set loading state
      setLoading: (isLoading) => set({ isLoading }),

      // Check if item is pending
      isPending: (productId) => {
        return get().pendingOperations.has(productId);
      },

      // Calculate totals from server cart or local
      getCartTotals: () => {
        const serverCart = get().serverCart;
        const cartItems = get().cartItems;

        if (!serverCart && cartItems.length === 0) {
          return {
            itemCount: 0,
            uniqueItems: 0,
            subtotal: 0,
            discount: 0,
            tax: 0,
            shippingFee: 0,
            total: 0,
            totalSavings: 0,
          };
        }

        if (serverCart?.pricing) {
          return {
            itemCount: serverCart.totals?.items || 0,
            uniqueItems: serverCart.items?.length || 0,
            subtotal: serverCart.pricing.subtotal || 0,
            discount: serverCart.pricing.discount || 0,
            tax: serverCart.pricing.tax || 0,
            shippingFee: serverCart.pricing.shippingFee || 0,
            total: serverCart.pricing.total || 0,
            totalSavings: serverCart.totals?.savings || 0,
          };
        }

        // Fallback to local calculation
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
          discount: 0,
          tax: 0,
          shippingFee: 0,
          total: subtotal,
          totalSavings: 0,
        };
      },

      // Check if cart is empty
      get isEmpty() {
        return get().cartItems.length === 0;
      },

      // Get selected quantities (compatibility)
      get selectedQuantities() {
        const quantities = {};
        get().cartItems.forEach((item) => {
          quantities[item._id] = item.quantity || 1;
        });
        return quantities;
      },

      // Get quantity ten plus (compatibility)
      get quantityTenPlus() {
        const quantities = {};
        get().cartItems.forEach((item) => {
          if ((item.quantity || 1) >= 10) {
            quantities[item._id] = item.quantity;
          }
        });
        return quantities;
      },

      // Check stock availability
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

        const quantity = item.quantity || 1;
        const stock = item.numberInStock || 0;

        return {
          itemId,
          itemName: item.name,
          currentQuantity: quantity,
          availableStock: stock,
          isAvailable: quantity <= stock,
          remaining: Math.max(0, stock - quantity),
          status: quantity <= stock ? "available" : "exceeds_stock",
        };
      },

      // Get stock warnings
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

      // Auto-fix stock issues
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
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      version: 5,
      partialize: (state) => ({
        cartItems: state.cartItems,
        savedItems: state.savedItems,
        lastSync: state.lastSync,
      }),
      migrate: (persistedState, version) => {
        if (version < 5) {
          return {
            ...persistedState,
            savedItems: persistedState.savedItems || [],
            serverCart: null,
            syncInProgress: false,
            lastSync: persistedState.lastSync || null,
            pendingOperations: new Set(),
            optimisticUpdates: new Map(),
          };
        }
        return persistedState;
      },
    }
  )
);

// Initialize cart sync on store creation
if (typeof window !== "undefined") {
  const checkAndSyncCart = () => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (token) {
      setTimeout(() => {
        useCartStore.getState().syncCart();
      }, 2000);
    }
  };

  checkAndSyncCart();

  window.addEventListener("storage", (event) => {
    if (event.key === "accessToken" || event.key === "token") {
      checkAndSyncCart();
    }
  });
}

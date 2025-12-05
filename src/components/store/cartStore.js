import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      cartItems: [],
      selectedQuantities: {},
      quantityTenPlus: {},
      savedForLater: [],
      isLoading: false,
      error: null,

      validateStock: (item, quantity) => {
        if (!item) {
          throw new Error("Item not found");
        }

        const stock = item.numberInStock ?? item.numberInStock;

        if (stock !== undefined && quantity > stock) {
          throw new Error(
            `Only ${stock} item${stock !== 1 ? "s" : ""} available in stock`
          );
        }

        return true;
      },

      validateQuantity: (quantity, isCustom = false) => {
        const parsedQuantity = parseInt(quantity, 10);

        if (isNaN(parsedQuantity)) {
          throw new Error("Please enter a valid number");
        }

        if (parsedQuantity < 1) {
          throw new Error("Quantity must be at least 1");
        }

        if (isCustom && parsedQuantity < 10) {
          throw new Error("Custom quantity must be 10 or more");
        }

        return parsedQuantity;
      },

      getItemWithStock: (itemId) => {
        const state = get();
        const item = state.cartItems.find((i) => i._id === itemId);

        if (!item) {
          throw new Error("Item not found in cart");
        }

        // Ensure consistent stock field
        const stockItem = {
          ...item,
          numberInStock: item.numberInStock ?? item.numberInStock,
        };

        return stockItem;
      },

      // Set cart items with validation
      setCartItems: (items) => {
        const validatedItems = Array.isArray(items) ? items : [];
        set({
          cartItems: validatedItems,
          error: null,
        });
      },

      addToCart: (item) => {
        try {
          if (!item || !item._id) {
            throw new Error("Invalid item data");
          }

          set((state) => {
            const existingItem = state.cartItems.find(
              (i) => i._id === item._id
            );

            if (existingItem) {
              const currentQuantity =
                state.selectedQuantities[item._id] ||
                existingItem.quantity ||
                1;
              const newQuantity = currentQuantity + 1;

              // Use enhanced validation
              const stockItem = {
                ...existingItem,
                numberInStock:
                  existingItem.numberInStock ?? existingItem.numberInStock,
              };

              get().validateStock(stockItem, newQuantity);

              return {
                cartItems: state.cartItems.map((i) =>
                  i._id === item._id ? { ...i, quantity: newQuantity } : i
                ),
                selectedQuantities: {
                  ...state.selectedQuantities,
                  [item._id]: newQuantity,
                },
                error: null,
              };
            } else {
              // Validate initial quantity
              const stockItem = {
                ...item,
                numberInStock: item.numberInStock ?? item.numberInStock,
              };

              get().validateStock(stockItem, 1);

              return {
                cartItems: [...state.cartItems, { ...item, quantity: 1 }],
                selectedQuantities: {
                  ...state.selectedQuantities,
                  [item._id]: 1,
                },
                error: null,
              };
            }
          });
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Update quantity with enhanced validation
      updateQuantity: (itemId, quantity) => {
        try {
          set((state) => {
            const item = get().getItemWithStock(itemId);

            let newQuantity;
            if (quantity === "10+") {
              newQuantity = "10+";
            } else {
              // Validate quantity
              newQuantity = get().validateQuantity(quantity, false);

              // Validate stock
              get().validateStock(item, newQuantity);
            }

            return {
              selectedQuantities: {
                ...state.selectedQuantities,
                [itemId]: newQuantity,
              },
              quantityTenPlus: {
                ...state.quantityTenPlus,
                [itemId]:
                  quantity === "10+"
                    ? state.quantityTenPlus[itemId] || 10
                    : undefined,
              },
              cartItems: state.cartItems.map((i) =>
                i._id === itemId
                  ? {
                      ...i,
                      quantity:
                        quantity === "10+"
                          ? state.quantityTenPlus[itemId] || 10
                          : newQuantity,
                    }
                  : i
              ),
              error: null,
            };
          });
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      updateCustomQuantity: (itemId, quantity) => {
        try {
          set((state) => {
            const item = get().getItemWithStock(itemId);

            // Validate quantity (custom mode)
            const parsedQuantity = get().validateQuantity(quantity, true);

            // Validate stock
            get().validateStock(item, parsedQuantity);

            return {
              quantityTenPlus: {
                ...state.quantityTenPlus,
                [itemId]: parsedQuantity,
              },
              selectedQuantities: {
                ...state.selectedQuantities,
                [itemId]: parsedQuantity,
              },
              cartItems: state.cartItems.map((i) =>
                i._id === itemId ? { ...i, quantity: parsedQuantity } : i
              ),
              error: null,
            };
          });
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      validateCartForCheckout: () => {
        const state = get();
        const errors = [];

        state.cartItems.forEach((item) => {
          const quantity =
            state.quantityTenPlus[item._id] ??
            state.selectedQuantities[item._id] ??
            item.quantity ??
            1;

          const stock = item.numberInStock ?? item.numberInStock;

          if (stock !== undefined && quantity > stock) {
            errors.push({
              itemId: item._id,
              itemName: item.name,
              requested: quantity,
              available: stock,
              message: `Only ${stock} of "${item.name}" available in stock`,
            });
          }
        });

        return {
          isValid: errors.length === 0,
          errors,
          warnings:
            errors.length > 0
              ? "Some items exceed available stock. Please adjust quantities before checkout."
              : null,
        };
      },

      adjustQuantityToStock: (itemId) => {
        try {
          set((state) => {
            const item = get().getItemWithStock(itemId);
            const currentQuantity =
              state.quantityTenPlus[itemId] ??
              state.selectedQuantities[itemId] ??
              1;

            const maxStock = item.numberInStock ?? item.numberInStock;

            if (maxStock === undefined || currentQuantity <= maxStock) {
              // No adjustment needed
              return state;
            }

            // Adjust to max stock
            const adjustedQuantity = maxStock;
            const isCustom = currentQuantity >= 10;

            if (isCustom) {
              return {
                quantityTenPlus: {
                  ...state.quantityTenPlus,
                  [itemId]: adjustedQuantity,
                },
                selectedQuantities: {
                  ...state.selectedQuantities,
                  [itemId]: adjustedQuantity,
                },
                cartItems: state.cartItems.map((i) =>
                  i._id === itemId ? { ...i, quantity: adjustedQuantity } : i
                ),
                error: `Quantity adjusted to available stock (${adjustedQuantity})`,
              };
            } else {
              return {
                selectedQuantities: {
                  ...state.selectedQuantities,
                  [itemId]: adjustedQuantity,
                },
                cartItems: state.cartItems.map((i) =>
                  i._id === itemId ? { ...i, quantity: adjustedQuantity } : i
                ),
                error: `Quantity adjusted to available stock (${adjustedQuantity})`,
              };
            }
          });
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item._id !== itemId),
          selectedQuantities: Object.fromEntries(
            Object.entries(state.selectedQuantities).filter(
              ([key]) => key !== itemId
            )
          ),
          quantityTenPlus: Object.fromEntries(
            Object.entries(state.quantityTenPlus).filter(
              ([key]) => key !== itemId
            )
          ),
          error: null,
        }));
      },

      saveForLater: (itemId) => {
        set((state) => {
          const item = state.cartItems.find((i) => i._id === itemId);

          if (!item) return state;

          const savedItem = {
            ...item,
            _cartMetadata: {
              selectedQuantity: state.selectedQuantities[itemId],
              tenPlusQuantity: state.quantityTenPlus[itemId],
              originalQuantity: item.quantity,
              savedAt: new Date().toISOString(),
            },
          };

          return {
            cartItems: state.cartItems.filter((i) => i._id !== itemId),
            savedForLater: [...state.savedForLater, savedItem],
            selectedQuantities: Object.fromEntries(
              Object.entries(state.selectedQuantities).filter(
                ([key]) => key !== itemId
              )
            ),
            quantityTenPlus: Object.fromEntries(
              Object.entries(state.quantityTenPlus).filter(
                ([key]) => key !== itemId
              )
            ),
            error: null,
          };
        });
      },

      moveToCart: (itemId) => {
        set((state) => {
          const savedItem = state.savedForLater.find((i) => i._id === itemId);

          if (!savedItem) return state;

          // Extract metadata
          const metadata = savedItem._cartMetadata || {};
          const {
            selectedQuantity,
            tenPlusQuantity,
            originalQuantity,
            savedAt,
          } = metadata;

          // Determine quantity to restore
          let quantityToRestore;
          let isTenPlus = false;

          if (tenPlusQuantity !== undefined) {
            quantityToRestore = tenPlusQuantity;
            isTenPlus = true;
          } else if (selectedQuantity !== undefined) {
            quantityToRestore = selectedQuantity;
          } else if (originalQuantity !== undefined) {
            quantityToRestore = originalQuantity;
          } else {
            quantityToRestore = 1;
          }

          // Clean item metadata before adding to cart
          const { _cartMetadata, ...cleanItem } = savedItem;

          // Validate stock
          const stockItem = {
            ...cleanItem,
            numberInStock: cleanItem.numberInStock ?? cleanItem.numberInStock,
          };

          try {
            get().validateStock(stockItem, quantityToRestore);
          } catch (error) {
            // If out of stock, set to 0 and show error
            return {
              cartItems: [...state.cartItems, { ...cleanItem, quantity: 0 }],
              savedForLater: state.savedForLater.filter(
                (i) => i._id !== itemId
              ),
              selectedQuantities: {
                ...state.selectedQuantities,
                [itemId]: 0,
              },
              error: `Item moved to cart but quantity adjusted to 0: ${error.message}`,
            };
          }

          const updatedItem = {
            ...cleanItem,
            quantity: quantityToRestore,
          };

          return {
            cartItems: [...state.cartItems, updatedItem],
            savedForLater: state.savedForLater.filter((i) => i._id !== itemId),
            selectedQuantities: {
              ...state.selectedQuantities,
              [itemId]: quantityToRestore,
            },
            quantityTenPlus: isTenPlus
              ? {
                  ...state.quantityTenPlus,
                  [itemId]: quantityToRestore,
                }
              : state.quantityTenPlus,
            error: null,
          };
        });
      },

      removeFromSaved: (itemId) => {
        set((state) => ({
          savedForLater: state.savedForLater.filter((i) => i._id !== itemId),
          error: null,
        }));
      },

      clearCart: () =>
        set({
          cartItems: [],
          selectedQuantities: {},
          quantityTenPlus: {},
          error: null,
        }),

      // Clear saved items
      clearSaved: () => set({ savedForLater: [], error: null }),

      // Clear error
      clearError: () => set({ error: null }),

      // Set loading state
      setLoading: (isLoading) => set({ isLoading }),

      // Bulk update quantities
      updateQuantities: (quantities) =>
        set({ selectedQuantities: quantities, error: null }),

      // Get cart totals
      getCartTotals: () => {
        const state = get();
        const itemCount = state.cartItems.reduce((total, item) => {
          const quantity =
            state.quantityTenPlus[item._id] ??
            state.selectedQuantities[item._id] ??
            item.quantity ??
            1;
          return total + quantity;
        }, 0);

        return {
          itemCount,
          uniqueItems: state.cartItems.length,
        };
      },

      checkStockAvailability: (itemId) => {
        try {
          const item = get().getItemWithStock(itemId);
          const currentQuantity =
            get().quantityTenPlus[itemId] ??
            get().selectedQuantities[itemId] ??
            1;

          const stock = item.numberInStock;

          return {
            itemId,
            itemName: item.name,
            currentQuantity,
            availableStock: stock,
            isAvailable: stock === undefined || currentQuantity <= stock,
            remaining: stock !== undefined ? stock - currentQuantity : null,
            status:
              stock === undefined
                ? "unlimited"
                : currentQuantity <= stock
                ? "available"
                : "exceeds_stock",
          };
        } catch (error) {
          return {
            itemId,
            error: error.message,
            isAvailable: false,
            status: "error",
          };
        }
      },

      getStockWarnings: () => {
        const state = get();
        const warnings = [];

        state.cartItems.forEach((item) => {
          const stockInfo = get().checkStockAvailability(item._id);
          if (!stockInfo.isAvailable && stockInfo.status === "exceeds_stock") {
            warnings.push(stockInfo);
          }
        });

        return warnings;
      },

      autoFixStockIssues: () => {
        const warnings = get().getStockWarnings();
        const results = [];

        warnings.forEach((warning) => {
          try {
            get().adjustQuantityToStock(warning.itemId);
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
        });

        return results;
      },
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
      version: 2, // Increment version for new schema
      // Migrate function for future version updates
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migration logic for version 0 to 1
          return {
            ...persistedState,
            savedForLater: [],
            isLoading: false,
            error: null,
          };
        }
        if (version === 1) {
          // Migration logic for version 1 to 2 (adding validation helpers)
          return {
            ...persistedState,
            // No structural changes, just new methods
          };
        }
        return persistedState;
      },
    }
  )
);

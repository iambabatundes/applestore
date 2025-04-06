import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      setCartItems: (items) =>
        set({ cartItems: Array.isArray(items) ? items : [] }),
      selectedQuantities: {},
      quantityTenPlus: {},
      setCartItems: (items) => set({ cartItems: items }),

      addToCart: (item) => {
        set((state) => {
          const exists = state.cartItems.find((i) => i._id === item._id);
          if (exists) {
            return {
              cartItems: state.cartItems.map((i) =>
                i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
              ),
              selectedQuantities: {
                ...state.selectedQuantities,
                [item._id]: (state.selectedQuantities[item._id] || 0) + 1,
              },
            };
          } else {
            return {
              cartItems: [...state.cartItems, { ...item, quantity: 1 }],
              selectedQuantities: {
                ...state.selectedQuantities,
                [item._id]: 1,
              },
            };
          }
        });
      },

      handleDelete: (itemId) => {
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
        }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          const newQuantity =
            quantity === "10+" ? "10+" : parseInt(quantity) || 1;
          return {
            selectedQuantities: {
              ...state.selectedQuantities,
              [itemId]: newQuantity,
            },
            quantityTenPlus: {
              ...state.quantityTenPlus,
              [itemId]: quantity === "10+" ? "" : undefined, // Reset custom quantity input if not "10+"
            },
            cartItems: state.cartItems.map((item) =>
              item._id === itemId
                ? { ...item, quantity, total: item.price * quantity }
                : item
            ),
          };
        });
      },

      setCartItems: (cartItems) => set({ cartItems }),
      setSelectedQuantities: (quantities) =>
        set({ selectedQuantities: quantities }),
      setQuantityTenPlus: (quantities) => set({ quantityTenPlus: quantities }),

      clearCart: () =>
        set({ cartItems: [], selectedQuantities: {}, quantityTenPlus: {} }),
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);

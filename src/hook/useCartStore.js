import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      selectedQuantities: {},
      quantityTenPlus: {},

      addToCart: (product) =>
        set((state) => {
          const existingProduct = state.cartItems.find(
            (item) => item._id === product._id
          );
          if (existingProduct) {
            return {
              cartItems: state.cartItems.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            cartItems: [...state.cartItems, { ...product, quantity: 1 }],
          };
        }),

      setSelectedQuantities: (quantities) =>
        set(() => ({ selectedQuantities: quantities })),

      setQuantityTenPlus: (quantities) =>
        set(() => ({ quantityTenPlus: quantities })),

      handleDelete: (itemId) =>
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
        })),

      setCartItems: (items) => set(() => ({ cartItems: items })),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cartItems: state.cartItems,
        selectedQuantities: state.selectedQuantities,
        quantityTenPlus: state.quantityTenPlus,
      }), // Persist only these keys
    }
  )
);

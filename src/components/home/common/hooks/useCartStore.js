import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

      // Add item to the cart
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cartItems.find((i) => i._id === item._id);
          if (existingItem) {
            // If item exists, update quantity
            return {
              cartItems: state.cartItems.map((i) =>
                i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          // Add new item with quantity 1
          return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
        });
      },

      // Remove item from the cart by ID
      removeFromCart: (itemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item._id !== itemId),
        })),

      // Decrease item quantity, remove if quantity is 1
      decreaseQuantity: (itemId) =>
        set((state) => ({
          cartItems: state.cartItems
            .map((item) =>
              item._id === itemId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      // Clear the entire cart
      clearCart: () => set({ cartItems: [] }),

      // Check if item is already in the cart
      isItemInCart: (itemId) =>
        get().cartItems.some((item) => item._id === itemId),
    }),
    {
      name: "cart-storage", // LocalStorage key
    }
  )
);

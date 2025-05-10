import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProducts } from "../../../services/productService";

const shuffleArray = (array) => [...array].sort(() => 0.5 - Math.random());

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      loading: true,
      error: null,
      fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
          const { data } = await getProducts();
          set({ products: shuffleArray(data) });
        } catch (err) {
          set({ error: "Failed to load products" });
          console.error("Error fetching products:", err);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "product-store", // localStorage key
      partialize: (state) => ({ products: state.products }), // only persist products
    }
  )
);

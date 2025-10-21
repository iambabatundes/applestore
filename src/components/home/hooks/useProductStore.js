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
          const response = await getProducts();

          // Log to see the actual structure
          console.log("API Response:", response);

          // Extract products array from response
          // Adjust based on your actual API response structure
          const productsArray =
            response.data || response.products || response || [];

          if (!Array.isArray(productsArray)) {
            console.error("Products is not an array:", productsArray);
            set({ error: "Invalid data format", products: [] });
            return;
          }

          set({ products: shuffleArray(productsArray), error: null });
        } catch (err) {
          set({ error: "Failed to load products", products: [] });
          console.error("Error fetching products:", err);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "product-store",
      partialize: (state) => ({ products: state.products }),
    }
  )
);

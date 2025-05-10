import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProductsByCategorys } from "../../../services/productService";

const TTL_MS = 1000 * 60 * 60;

const useProductStore = create(
  persist(
    (set, get) => ({
      productsByCategory: {},
      loadingCategories: {},
      errors: {},

      fetchCategoryProducts: async (categoryName) => {
        const state = get();
        const cached = state.productsByCategory[categoryName];
        const now = Date.now();
        const isStale = !cached || now - (cached.timestamp || 0) > TTL_MS;

        if (!isStale) return;

        set((state) => ({
          loadingCategories: {
            ...state.loadingCategories,
            [categoryName]: true,
          },
          errors: { ...state.errors, [categoryName]: null },
        }));

        try {
          const { data } = await getProductsByCategorys(categoryName);
          set((state) => ({
            productsByCategory: {
              ...state.productsByCategory,
              [categoryName]: {
                data,
                timestamp: now,
              },
            },
            loadingCategories: {
              ...state.loadingCategories,
              [categoryName]: false,
            },
          }));
        } catch (error) {
          console.error("Failed to fetch products:", error);
          set((state) => ({
            errors: { ...state.errors, [categoryName]: error },
            loadingCategories: {
              ...state.loadingCategories,
              [categoryName]: false,
            },
          }));
        }
      },

      refreshCategoryProducts: async (categoryName) => {
        const now = Date.now();

        set((state) => ({
          loadingCategories: {
            ...state.loadingCategories,
            [categoryName]: true,
          },
          errors: { ...state.errors, [categoryName]: null },
        }));

        try {
          const { data } = await getProductsByCategorys(categoryName);
          set((state) => ({
            productsByCategory: {
              ...state.productsByCategory,
              [categoryName]: {
                data,
                timestamp: now,
              },
            },
            loadingCategories: {
              ...state.loadingCategories,
              [categoryName]: false,
            },
          }));
        } catch (error) {
          console.error("Refresh error:", error);
          set((state) => ({
            errors: { ...state.errors, [categoryName]: error },
            loadingCategories: {
              ...state.loadingCategories,
              [categoryName]: false,
            },
          }));
        }
      },

      // Optional: Clear cache per category
      clearCategoryCache: (categoryName) => {
        set((state) => {
          const updated = { ...state.productsByCategory };
          delete updated[categoryName];
          return { productsByCategory: updated };
        });
      },
    }),
    {
      name: "product-category-store",
      partialize: (state) => ({
        productsByCategory: state.productsByCategory,
      }),
    }
  )
);

export default useProductStore;

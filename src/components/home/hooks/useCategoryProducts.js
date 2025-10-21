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

      fetchCategoryProducts: async (categoryName, forceRefresh = false) => {
        const { productsByCategory } = get();
        const cached = productsByCategory[categoryName];
        const now = Date.now();
        const isStale = !cached || now - (cached.timestamp || 0) > TTL_MS;

        if (!forceRefresh && !isStale) return;

        set((state) => ({
          loadingCategories: {
            ...state.loadingCategories,
            [categoryName]: true,
          },
          errors: { ...state.errors, [categoryName]: null },
        }));

        try {
          const response = await getProductsByCategorys(categoryName);
          console.log("Category products response:", response);

          // Handle different response structures
          const productsArray =
            response.data || response.products || response || [];

          set((state) => ({
            productsByCategory: {
              ...state.productsByCategory,
              [categoryName]: {
                data: Array.isArray(productsArray) ? productsArray : [],
                timestamp: now,
              },
            },
            loadingCategories: {
              ...state.loadingCategories,
              [categoryName]: false,
            },
            errors: { ...state.errors, [categoryName]: null },
          }));
        } catch (error) {
          console.error("Fetch error:", error);
          console.error("Error status:", error.response?.status);

          // If 404, treat as empty results (not an error)
          if (error.response?.status === 404) {
            set((state) => ({
              productsByCategory: {
                ...state.productsByCategory,
                [categoryName]: {
                  data: [],
                  timestamp: now,
                },
              },
              loadingCategories: {
                ...state.loadingCategories,
                [categoryName]: false,
              },
              errors: { ...state.errors, [categoryName]: null },
            }));
          } else {
            // Real error (network, 500, etc.)
            set((state) => ({
              errors: {
                ...state.errors,
                [categoryName]: "Failed to load products",
              },
              loadingCategories: {
                ...state.loadingCategories,
                [categoryName]: false,
              },
              productsByCategory: {
                ...state.productsByCategory,
                [categoryName]: {
                  data: [],
                  timestamp: now,
                },
              },
            }));
          }
        }
      },

      refreshCategoryProducts: (categoryName) =>
        get().fetchCategoryProducts(categoryName, true),

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

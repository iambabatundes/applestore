import { publicHttpService, adminHttpService } from "./http/index";

// Use consistent base URL construction
const getApiEndpoint = (path = "") => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return path
    ? `${baseUrl}/api/categories/${path}`
    : `${baseUrl}/api/categories`;
};

function clearCategoriesCache() {
  adminHttpService.clearCache();
  publicHttpService.clearCache();
}

export async function getCategories(params = {}) {
  try {
    const { data } = await publicHttpService.get(getApiEndpoint(), { params });
    clearCategoriesCache();
    return data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    throw err;
  }
}

export async function getCategory(categoryId) {
  try {
    const { data } = await publicHttpService.get(getApiEndpoint(categoryId));
    clearCategoriesCache();
    return data;
  } catch (err) {
    console.error("Failed to fetch category:", err);
    throw err;
  }
}

export async function getCategoriesWithProducts(params = {}) {
  try {
    const { data } = await publicHttpService.get(
      getApiEndpoint("with-products"),
      { params }
    );
    clearCategoriesCache();
    return data;
  } catch (err) {
    console.error("Failed to fetch categories with products:", err);
    throw err;
  }
}

export async function getProductsByCategory(categoryId) {
  try {
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/products/category/${categoryId}`;

    const { data } = await publicHttpService.get(url);
    return data;
  } catch (err) {
    console.error(`Failed to fetch products for category ${categoryId}:`, err);
    throw err;
  }
}

// Get category by slug (SEO-friendly)
export async function getCategoryBySlug(slug) {
  try {
    const { data } = await publicHttpService.get(
      getApiEndpoint(`slug/${slug}`)
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch category by slug:", err);
    throw err;
  }
}

export async function saveCategory(formData, storageType = "local") {
  try {
    // Build URL with storage query parameter
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/api/categories?storage=${storageType}`;

    const { data } = await adminHttpService.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    clearCategoriesCache();
    return data;
  } catch (err) {
    console.error("Save category error:", err.response?.data || err.message);

    // Extract the actual error message from the response
    const errorMessage =
      err.response?.data?.message || "Failed to save category";

    // Create a new error with the actual backend message
    const error = new Error(errorMessage);
    error.response = err.response;
    error.status = err.response?.status;
    error.isDuplicate = err.response?.status === 409;
    error.field = "name"; // Since it's a duplicate name error

    console.log("Enhanced error object:", error);
    throw error;
  }
}

// Do the same for updateCategory
export async function updateCategory(
  categoryId,
  formData,
  storageType = "local"
) {
  try {
    // Build URL with storage query parameter
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/api/categories/${categoryId}?storage=${storageType}`;

    const { data } = await adminHttpService.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    clearCategoriesCache();
    return data;
  } catch (err) {
    const error = new Error(
      err.response?.data?.message || "Failed to update category"
    );
    error.response = err.response;
    throw error;
  }
}

export async function deleteCategory(categoryId) {
  try {
    const { data } = await adminHttpService.delete(getApiEndpoint(categoryId));
    return data;
    clearCategoriesCache();
  } catch (err) {
    console.error("Failed to delete category:", err);
    throw err;
  }
}

// Bulk operations for admin
export async function bulkDeleteCategories(categoryIds) {
  try {
    const { data } = await adminHttpService.post(
      getApiEndpoint("bulk-delete"),
      { categoryIds }
    );
    clearCategoriesCache();
    return data;
  } catch (err) {
    console.error("Failed to bulk delete categories:", err);
    throw err;
  }
}

export async function reorderCategories(categoryOrders) {
  try {
    const { data } = await adminHttpService.put(getApiEndpoint("reorder"), {
      categoryOrders,
    });
    return data;
  } catch (err) {
    console.error("Failed to reorder categories:", err);
    throw err;
  }
}

// Category status management
export async function toggleCategoryStatus(categoryId) {
  try {
    const { data } = await adminHttpService.patch(
      getApiEndpoint(`${categoryId}/toggle-status`)
    );
    return data;
  } catch (err) {
    console.error("Failed to toggle category status:", err);
    throw err;
  }
}

// Search and filtering
export async function searchCategories(query, filters = {}) {
  try {
    const { data } = await publicHttpService.get(getApiEndpoint("search"), {
      params: {
        q: query,
        ...filters,
      },
    });
    clearCategoriesCache();
    return data;
  } catch (err) {
    console.error("Failed to search categories:", err);
    throw err;
  }
}

// Get category hierarchy/tree structure
export async function getCategoryTree() {
  try {
    const { data } = await publicHttpService.get(getApiEndpoint("tree"));
    clearCategoriesCache();
    return data;
  } catch (err) {
    console.error("Failed to fetch category tree:", err);
    throw err;
  }
}

// Cache management helper
export function invalidateCategoryCache() {
  // Clear cache for category-related requests
  publicHttpService.clearCache();
  adminHttpService.clearCache();
}

// Get cached categories with TTL
export async function getCachedCategories(ttl = 5 * 60 * 1000) {
  try {
    // Use the service's built-in caching
    const { data } = await publicHttpService.get(getApiEndpoint(), {
      // This will be cached automatically by the service
      cache: { ttl },
    });
    return data;
  } catch (err) {
    console.error("Failed to fetch cached categories:", err);
    throw err;
  }
}

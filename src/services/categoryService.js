import { publicHttpService, adminHttpService } from "./http/index";

// Use consistent base URL construction
const getApiEndpoint = (path = "") => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return path
    ? `${baseUrl}/api/categories/${path}`
    : `${baseUrl}/api/categories`;
};

// CRUD Operations for Categories

// Public operations (no authentication required)
export async function getCategories(params = {}) {
  try {
    const { data } = await publicHttpService.get(getApiEndpoint(), { params });
    return data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    throw err;
  }
}

export async function getCategory(categoryId) {
  try {
    const { data } = await publicHttpService.get(getApiEndpoint(categoryId));
    return data;
  } catch (err) {
    console.error("Failed to fetch category:", err);
    throw err;
  }
}

// Get categories with products (public endpoint with additional data)
export async function getCategoriesWithProducts(params = {}) {
  try {
    const { data } = await publicHttpService.get(
      getApiEndpoint("with-products"),
      { params }
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch categories with products:", err);
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

// Admin operations (authentication required)
export async function saveCategory(category) {
  try {
    const { data } = await adminHttpService.post(getApiEndpoint(), category);
    return data;
  } catch (err) {
    console.error("Failed to save category:", err);
    throw err;
  }
}

export async function updateCategory(categoryId, category) {
  try {
    const { data } = await adminHttpService.put(
      getApiEndpoint(categoryId),
      category
    );
    return data;
  } catch (err) {
    console.error("Failed to update category:", err);
    throw err;
  }
}

export async function deleteCategory(categoryId) {
  try {
    const { data } = await adminHttpService.delete(getApiEndpoint(categoryId));
    return data;
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

import {
  publicHttpService,
  userHttpService,
  adminHttpService,
} from "./http/index.js";

const buildEndpoint = (path = "") => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return path ? `${baseUrl}/api/products${path}` : `${baseUrl}/api/products`;
};

// Public product operations
export async function getProducts(params = {}) {
  try {
    const { data } = await publicHttpService.get(buildEndpoint(), { params });
    return data;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    throw err;
  }
}

export async function getProduct(productId) {
  try {
    const { data } = await publicHttpService.get(
      buildEndpoint(`/${productId}`)
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch product:", err);
    throw err;
  }
}

export async function getProductsByCategorys(categoryId, params = {}) {
  try {
    const { data } = await publicHttpService.get(
      buildEndpoint(`/category/${categoryId}`),
      { params }
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch products by category:", err);
    throw err;
  }
}

export async function getProductsByTag(tagId, params = {}) {
  try {
    const { data } = await publicHttpService.get(
      buildEndpoint(`/tag/${tagId}`),
      { params }
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch products by tag:", err);
    throw err;
  }
}

export async function getProductsByPromotion(promotionName, params = {}) {
  try {
    const { data } = await publicHttpService.get(
      buildEndpoint(`/promotions/${promotionName}`),
      { params }
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch products by promotion:", err);
    throw err;
  }
}

// Search and filtering
export async function searchProducts(query, filters = {}) {
  try {
    const { data } = await publicHttpService.get(buildEndpoint("/search"), {
      params: {
        q: query,
        ...filters,
      },
    });
    return data;
  } catch (err) {
    console.error("Failed to search products:", err);
    throw err;
  }
}

// Get featured/trending products
export async function getFeaturedProducts(limit = 10) {
  try {
    const { data } = await publicHttpService.get(buildEndpoint("/featured"), {
      params: { limit },
    });
    return data;
  } catch (err) {
    console.error("Failed to fetch featured products:", err);
    throw err;
  }
}

// Get product reviews
export async function getProductReviews(productId, params = {}) {
  try {
    const { data } = await publicHttpService.get(
      buildEndpoint(`/${productId}/reviews`),
      { params }
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch product reviews:", err);
    throw err;
  }
}

// Get related products
export async function getRelatedProducts(productId, limit = 6) {
  try {
    const { data } = await publicHttpService.get(
      buildEndpoint(`/${productId}/related`),
      { params: { limit } }
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch related products:", err);
    throw err;
  }
}

// User-specific product operations
export async function getUserProducts(params = {}) {
  try {
    const { data } = await userHttpService.get(buildEndpoint("/me"), {
      params,
    });
    return data;
  } catch (err) {
    console.error("Failed to fetch user products:", err);
    throw err;
  }
}

// Wishlist operations using UserHttpService built-in methods
export async function addProductToWishlist(productId) {
  try {
    const { data } = await userHttpService.addToWishlist(productId);
    return data;
  } catch (err) {
    console.error("Failed to add product to wishlist:", err);
    throw err;
  }
}

export async function removeProductFromWishlist(productId) {
  try {
    const { data } = await userHttpService.removeFromWishlist(productId);
    return data;
  } catch (err) {
    console.error("Failed to remove product from wishlist:", err);
    throw err;
  }
}

export async function getUserWishlist() {
  try {
    const { data } = await userHttpService.getWishlist();
    return data;
  } catch (err) {
    console.error("Failed to fetch user wishlist:", err);
    throw err;
  }
}

// User reviews
export async function createProductReview(productId, reviewData) {
  try {
    const { data } = await userHttpService.createReview(
      productId,
      reviewData.rating,
      reviewData.review,
      reviewData.title
    );
    return data;
  } catch (err) {
    console.error("Failed to create product review:", err);
    throw err;
  }
}

// Admin product operations
export async function saveProduct(product) {
  try {
    const formData = createFormData(product);

    if (product._id) {
      const { data } = await adminHttpService.put(
        buildEndpoint(`/${product._id}`),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data;
    } else {
      const { data } = await adminHttpService.post(buildEndpoint(), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    }
  } catch (error) {
    console.error("Failed to save product:", error);
    throw error;
  }
}

export async function updateProduct(productId, product) {
  try {
    const formData = createFormData(product);
    const { data } = await adminHttpService.put(
      buildEndpoint(`/${productId}`),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const { data } = await adminHttpService.delete(
      buildEndpoint(`/${productId}`)
    );
    return data;
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
}

// Bulk admin operations
export async function bulkDeleteProducts(productIds) {
  try {
    const { data } = await adminHttpService.post(
      buildEndpoint("/bulk-delete"),
      { productIds }
    );
    return data;
  } catch (error) {
    console.error("Failed to bulk delete products:", error);
    throw error;
  }
}

export async function bulkUpdateProducts(updates) {
  try {
    const { data } = await adminHttpService.put(buildEndpoint("/bulk-update"), {
      updates,
    });
    return data;
  } catch (error) {
    console.error("Failed to bulk update products:", error);
    throw error;
  }
}

// Product status management
export async function toggleProductStatus(productId) {
  try {
    const { data } = await adminHttpService.patch(
      buildEndpoint(`/${productId}/toggle-status`)
    );
    return data;
  } catch (error) {
    console.error("Failed to toggle product status:", error);
    throw error;
  }
}

// Inventory management
export async function updateProductInventory(productId, inventory) {
  try {
    const { data } = await adminHttpService.put(
      buildEndpoint(`/${productId}/inventory`),
      inventory
    );
    return data;
  } catch (error) {
    console.error("Failed to update product inventory:", error);
    throw error;
  }
}

// Cache management
export function invalidateProductCache() {
  publicHttpService.clearCache();
  userHttpService.clearCache();
  adminHttpService.clearCache();
}

// Get cached products
export async function getCachedProducts(params = {}, ttl = 5 * 60 * 1000) {
  try {
    const { data } = await publicHttpService.get(buildEndpoint(), {
      params,
      cache: { ttl },
    });
    return data;
  } catch (err) {
    console.error("Failed to fetch cached products:", err);
    throw err;
  }
}

// Utility function for creating FormData (enhanced)
function createFormData(product) {
  const formData = new FormData();

  // Skip these fields entirely
  const skipFields = ["_id", "ratings", "createdAt", "updatedAt", "__v"];

  // Handle optional sale fields - only include if they have valid values
  const optionalSaleFields = [
    "salePrice",
    "saleStartDate",
    "saleEndDate",
    "discountPercentage",
    "colorSalePrice",
    "colorSaleStartDate",
    "colorSaleEndDate",
  ];

  Object.entries(product).forEach(([key, value]) => {
    if (skipFields.includes(key)) {
      return; // Skip these fields
    }

    if (optionalSaleFields.includes(key)) {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return; // Skip empty sale fields
      }
    }

    switch (key) {
      case "featureImage":
        if (value?.file) {
          formData.append("featureImage", value.file);
        } else if (typeof value === "string" && value) {
          formData.append("featureImage", value);
        }
        break;

      case "media":
        if (Array.isArray(value)) {
          value.forEach((file, index) => {
            if (file instanceof File) {
              formData.append("media", file);
            } else if (typeof file === "string" && file) {
              formData.append(`media[${index}]`, file);
            }
          });
        }
        break;

      case "attributes":
        if (Array.isArray(value)) {
          value.forEach((attr, index) => {
            if (attr && attr.key && attr.value) {
              formData.append(`attributes[${index}][key]`, attr.key);
              formData.append(`attributes[${index}][value]`, attr.value);
            }
          });
        }
        break;

      case "colors":
        if (Array.isArray(value)) {
          value.forEach((color, index) => {
            if (color && typeof color === "object") {
              Object.entries(color).forEach(([colorKey, colorValue]) => {
                if (colorKey === "_id" || !colorValue) return;

                if (colorKey === "colorImages") {
                  if (colorValue instanceof File) {
                    formData.append(
                      `colors[${index}][colorImages]`,
                      colorValue
                    );
                  } else if (typeof colorValue === "string" && colorValue) {
                    formData.append(
                      `colors[${index}][colorImages]`,
                      colorValue
                    );
                  }
                } else {
                  formData.append(`colors[${index}][${colorKey}]`, colorValue);
                }
              });
            }
          });
        }
        break;

      case "sizes":
        if (Array.isArray(value)) {
          value.forEach((size, index) => {
            if (size && typeof size === "object") {
              Object.entries(size).forEach(([sizeKey, sizeValue]) => {
                if (sizeKey === "_id") return;

                // Handle optional size sale fields
                if (
                  sizeKey.includes("Sale") &&
                  (!sizeValue || sizeValue === "")
                ) {
                  return;
                }

                if (sizeValue != null && sizeValue !== "") {
                  formData.append(`sizes[${index}][${sizeKey}]`, sizeValue);
                }
              });
            }
          });
        }
        break;

      case "capacity":
        if (Array.isArray(value)) {
          value.forEach((cap, index) => {
            if (cap && typeof cap === "object") {
              Object.entries(cap).forEach(([capKey, capValue]) => {
                if (capKey === "_id") return;

                // Handle optional capacity sale fields
                if (capKey.includes("Sale") && (!capValue || capValue === "")) {
                  return;
                }

                if (capValue != null && capValue !== "") {
                  formData.append(`capacity[${index}][${capKey}]`, capValue);
                }
              });
            }
          });
        }
        break;

      case "materials":
        if (Array.isArray(value)) {
          value.forEach((mat, index) => {
            if (mat && typeof mat === "object") {
              Object.entries(mat).forEach(([matKey, matValue]) => {
                if (matKey === "_id") return;

                // Handle optional material sale fields
                if (matKey.includes("Sale") && (!matValue || matValue === "")) {
                  return;
                }

                if (matValue != null && matValue !== "") {
                  formData.append(`materials[${index}][${matKey}]`, matValue);
                }
              });
            }
          });
        }
        break;

      default:
        if (value != null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === "object") {
                formData.append(`${key}[${index}]`, JSON.stringify(item));
              } else {
                formData.append(`${key}[]`, item);
              }
            });
          } else {
            formData.append(key, value);
          }
        }
        break;
    }
  });

  return formData;
}

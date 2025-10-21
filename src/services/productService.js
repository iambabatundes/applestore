import {
  publicHttpService,
  userHttpService,
  adminHttpService,
} from "./http/index.js";

const buildEndpoint = (path = "") => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return path ? `${baseUrl}/api/products${path}` : `${baseUrl}/api/products`;
};

function clearProductCache() {
  adminHttpService.clearCache();
  publicHttpService.clearCache();
}

// Public product operations
export async function getProducts(params = {}) {
  try {
    const { data } = await publicHttpService.get(buildEndpoint(), { params });
    clearProductCache();
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
    clearProductCache();
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
    clearProductCache();
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
    clearProductCache();
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
    clearProductCache();
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
    clearProductCache();
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
    clearProductCache();
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
    clearProductCache();
    return data;
  } catch (err) {
    console.error("Failed to fetch related products:", err);
    throw err;
  }
}

export async function getUserProducts(params = {}) {
  try {
    const { data } = await userHttpService.get(buildEndpoint("/me"), {
      params,
    });
    clearProductCache();
    return data;
  } catch (err) {
    console.error("Failed to fetch user products:", err);
    throw err;
  }
}

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
    clearProductCache();
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

export async function saveProduct(product) {
  try {
    const formData = createFormData(product);

    // Log FormData for debugging
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    if (product._id) {
      const { data } = await adminHttpService.put(
        buildEndpoint(`/${product._id}`),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      clearProductCache();
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

    console.log("Update FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const { data } = await adminHttpService.put(
      buildEndpoint(`/${productId}`),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    clearProductCache();
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
    clearProductCache();
    return data;
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
}

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

function createFormData(product) {
  const formData = new FormData();

  // Fields to skip entirely
  const skipFields = [
    "_id",
    "ratings",
    "createdAt",
    "updatedAt",
    "__v",
    "reviewCount",
    "averageRating",
    "viewCount",
    "purchaseCount",
    "reviews",
  ];

  const optionalSaleFields = [
    "salePrice",
    "saleStartDate",
    "saleEndDate",
    "discountPercentage",
  ];

  Object.entries(product).forEach(([key, value]) => {
    if (skipFields.includes(key)) {
      return;
    }

    // Handle optional sale fields
    if (optionalSaleFields.includes(key)) {
      if (!value || (typeof value === "string" && value.trim() === "")) {
        return;
      }
    }

    switch (key) {
      case "featureImage":
        // Handle new upload (has File object)
        if (value?.file instanceof File) {
          formData.append("featureImage", value.file);
        }
        // Handle existing image - send the Upload ID if available
        else if (value?._id) {
          formData.append("featureImage", value._id);
        }
        // Handle direct Upload ID string
        else if (typeof value === "string" && value) {
          formData.append("featureImage", value);
        }
        break;

      case "media":
        if (Array.isArray(value) && value.length > 0) {
          const newFiles = [];
          const existingIds = [];

          value.forEach((mediaItem) => {
            // Check if it's a new upload (has isNew flag or File object)
            if (mediaItem?.isNew && mediaItem?.file instanceof File) {
              newFiles.push(mediaItem.file);
            }
            // Direct File object (not wrapped)
            else if (mediaItem instanceof File) {
              newFiles.push(mediaItem);
            }
            // Existing media with _id (already uploaded)
            else if (!mediaItem?.isNew && mediaItem?._id) {
              // Validate it's a proper ObjectId
              if (
                typeof mediaItem._id === "string" &&
                mediaItem._id.match(/^[0-9a-fA-F]{24}$/)
              ) {
                existingIds.push(mediaItem._id);
              }
            }
            // Direct Upload ID string
            else if (
              typeof mediaItem === "string" &&
              mediaItem.match(/^[0-9a-fA-F]{24}$/)
            ) {
              existingIds.push(mediaItem);
            }
          });

          console.log("Media processing:", {
            totalMedia: value.length,
            newFiles: newFiles.length,
            existingIds: existingIds.length,
            existingIdsList: existingIds,
          });

          // Append new files for upload
          newFiles.forEach((file) => {
            formData.append("media", file);
          });

          // Append existing media IDs to preserve them
          existingIds.forEach((id, index) => {
            formData.append(`existingMedia[${index}]`, id);
          });
        }
        break;

      case "attributes":
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((attr, index) => {
            if (attr && attr.key && attr.value) {
              formData.append(`attributes[${index}][key]`, attr.key);
              formData.append(
                `attributes[${index}][value]`,
                typeof attr.value === "object"
                  ? JSON.stringify(attr.value)
                  : attr.value
              );
            }
          });
        }
        break;

      case "colors":
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((color, index) => {
            if (color && typeof color === "object") {
              Object.entries(color).forEach(([colorKey, colorValue]) => {
                // Skip internal fields and image data
                if (colorKey === "_id" || !colorValue) return;

                // Handle color images - NEW FILE UPLOAD
                if (colorKey === "colorImages") {
                  // Check if it's a new file upload (has file property)
                  if (colorValue?.file instanceof File) {
                    formData.append(`colorImages`, colorValue.file);
                    // formData.append(`colors[${index}][hasNewImage]`, "true");
                  }
                  // Skip if it's existing image data (preview URLs, etc.)
                  return;
                }

                // Handle color image reference (Upload ID) - EXISTING IMAGE
                if (colorKey === "colorImageRef") {
                  // Only send if it's a valid ObjectId string
                  if (
                    colorValue &&
                    typeof colorValue === "string" &&
                    colorValue.match(/^[0-9a-fA-F]{24}$/)
                  ) {
                    formData.append(
                      `colors[${index}][colorImageRef]`,
                      colorValue
                    );
                  } else if (
                    colorValue &&
                    typeof colorValue === "object" &&
                    colorValue._id
                  ) {
                    // If it's a populated object, send just the ID
                    formData.append(
                      `colors[${index}][colorImageRef]`,
                      colorValue._id
                    );
                  }
                  return;
                }

                // Handle sale price fields - skip if empty
                if (
                  (colorKey === "colorSalePrice" ||
                    colorKey === "colorSaleStartDate" ||
                    colorKey === "colorSaleEndDate") &&
                  (!colorValue || colorValue === "")
                ) {
                  return;
                }

                // Handle boolean fields
                if (colorKey === "isAvailable" || colorKey === "isDefault") {
                  formData.append(
                    `colors[${index}][${colorKey}]`,
                    colorValue ? "true" : "false"
                  );
                  return;
                }

                // Handle all other fields
                formData.append(`colors[${index}][${colorKey}]`, colorValue);
              });
            }
          });
        }
        break;

      case "sizes":
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((size, index) => {
            if (size && typeof size === "object") {
              Object.entries(size).forEach(([sizeKey, sizeValue]) => {
                if (sizeKey === "_id") return;

                // Skip empty sale fields
                if (
                  sizeKey.includes("Sale") &&
                  (!sizeValue || sizeValue === "")
                ) {
                  return;
                }

                // Handle boolean fields
                if (sizeKey === "isAvailable" || sizeKey === "isDefault") {
                  formData.append(
                    `sizes[${index}][${sizeKey}]`,
                    sizeValue ? "true" : "false"
                  );
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
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((cap, index) => {
            if (cap && typeof cap === "object") {
              Object.entries(cap).forEach(([capKey, capValue]) => {
                if (capKey === "_id") return;

                // Skip empty sale fields
                if (capKey.includes("Sale") && (!capValue || capValue === "")) {
                  return;
                }

                // Handle boolean fields
                if (capKey === "isAvailable" || capKey === "isDefault") {
                  formData.append(
                    `capacity[${index}][${capKey}]`,
                    capValue ? "true" : "false"
                  );
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
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((mat, index) => {
            if (mat && typeof mat === "object") {
              Object.entries(mat).forEach(([matKey, matValue]) => {
                if (matKey === "_id") return;

                // Skip empty sale fields
                if (matKey.includes("Sale") && (!matValue || matValue === "")) {
                  return;
                }

                // Handle boolean fields
                if (matKey === "isAvailable" || matKey === "isDefault") {
                  formData.append(
                    `materials[${index}][${matKey}]`,
                    matValue ? "true" : "false"
                  );
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
        // Handle arrays
        if (Array.isArray(value)) {
          value.forEach((item) => {
            if (typeof item === "object" && item !== null) {
              formData.append(`${key}[]`, JSON.stringify(item));
            } else {
              formData.append(`${key}[]`, item);
            }
          });
        }
        // Handle other values
        else if (value != null && value !== "") {
          formData.append(key, value);
        }
        break;
    }
  });

  return formData;
}

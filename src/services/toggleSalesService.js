import { adminHttpService } from "./http/index.js";

const TOGGLE_SALES_ENDPOINT = "/toggle-sales";

export async function saveSalePrice(salePrice) {
  try {
    if (import.meta.env.DEV) {
      console.log("Saving sale price:", salePrice);
    }

    const response = await adminHttpService.post(
      TOGGLE_SALES_ENDPOINT,
      salePrice
    );
    return response.data;
  } catch (err) {
    console.error("Failed to save sale price:", err);
    throw err;
  }
}

export async function getSalesPrices(params = {}) {
  try {
    const response = await adminHttpService.get(TOGGLE_SALES_ENDPOINT, {
      params,
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch sales prices:", err);
    throw err;
  }
}

export async function getSalePrice(salePriceId) {
  try {
    const response = await adminHttpService.get(
      `${TOGGLE_SALES_ENDPOINT}/${salePriceId}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch sale price:", err);
    throw err;
  }
}

export async function updateSalePrice(salePriceId, salePrice) {
  try {
    if (import.meta.env.DEV) {
      console.log("Updating sale price:", salePriceId, salePrice);
    }

    const response = await adminHttpService.put(
      `${TOGGLE_SALES_ENDPOINT}/${salePriceId}`,
      salePrice
    );
    return response.data;
  } catch (err) {
    console.error("Failed to update sale price:", err);
    throw err;
  }
}

export async function deleteSalePrice(salePriceId) {
  try {
    if (import.meta.env.DEV) {
      console.log("Deleting sale price:", salePriceId);
    }

    const response = await adminHttpService.delete(
      `${TOGGLE_SALES_ENDPOINT}/${salePriceId}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to delete sale price:", err);
    throw err;
  }
}

export async function toggleSalesStatus(salePriceId, isActive) {
  try {
    if (import.meta.env.DEV) {
      console.log("Toggling sales status:", salePriceId, isActive);
    }

    const response = await adminHttpService.patch(
      `${TOGGLE_SALES_ENDPOINT}/${salePriceId}/toggle`,
      {
        isActive,
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to toggle sales status:", err);
    throw err;
  }
}

export async function bulkUpdateSalesPrices(salesPrices) {
  try {
    if (import.meta.env.DEV) {
      console.log("Bulk updating sales prices:", salesPrices);
    }

    const response = await adminHttpService.put(
      `${TOGGLE_SALES_ENDPOINT}/bulk`,
      {
        salesPrices,
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to bulk update sales prices:", err);
    throw err;
  }
}

export async function activateSale(salePriceId, startDate, endDate) {
  try {
    if (import.meta.env.DEV) {
      console.log("Activating sale:", salePriceId, { startDate, endDate });
    }

    const response = await adminHttpService.post(
      `${TOGGLE_SALES_ENDPOINT}/${salePriceId}/activate`,
      {
        startDate,
        endDate,
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to activate sale:", err);
    throw err;
  }
}

export async function deactivateSale(salePriceId) {
  try {
    if (import.meta.env.DEV) {
      console.log("Deactivating sale:", salePriceId);
    }

    const response = await adminHttpService.post(
      `${TOGGLE_SALES_ENDPOINT}/${salePriceId}/deactivate`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to deactivate sale:", err);
    throw err;
  }
}

export async function scheduleSale(salePriceId, scheduleData) {
  try {
    if (import.meta.env.DEV) {
      console.log("Scheduling sale:", salePriceId, scheduleData);
    }

    const response = await adminHttpService.post(
      `${TOGGLE_SALES_ENDPOINT}/${salePriceId}/schedule`,
      scheduleData
    );
    return response.data;
  } catch (err) {
    console.error("Failed to schedule sale:", err);
    throw err;
  }
}

export async function getSalesAnalytics(params = {}) {
  try {
    const response = await adminHttpService.get(
      `${TOGGLE_SALES_ENDPOINT}/analytics`,
      { params }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch sales analytics:", err);
    throw err;
  }
}

export async function getActiveSales(params = {}) {
  try {
    const response = await adminHttpService.get(
      `${TOGGLE_SALES_ENDPOINT}/active`,
      { params }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch active sales:", err);
    throw err;
  }
}

export async function getUpcomingSales(params = {}) {
  try {
    const response = await adminHttpService.get(
      `${TOGGLE_SALES_ENDPOINT}/upcoming`,
      { params }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch upcoming sales:", err);
    throw err;
  }
}

export async function getExpiredSales(params = {}) {
  try {
    const response = await adminHttpService.get(
      `${TOGGLE_SALES_ENDPOINT}/expired`,
      { params }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch expired sales:", err);
    throw err;
  }
}

// Validation helpers for sales data
export function validateSalePrice(salePrice) {
  const errors = [];

  if (!salePrice) {
    errors.push("Sale price data is required");
    return { valid: false, errors };
  }

  if (!salePrice.productId) {
    errors.push("Product ID is required");
  }

  if (salePrice.salePrice === undefined || salePrice.salePrice === null) {
    errors.push("Sale price is required");
  }

  if (salePrice.salePrice !== undefined && salePrice.salePrice < 0) {
    errors.push("Sale price must be greater than or equal to 0");
  }

  if (salePrice.originalPrice !== undefined && salePrice.originalPrice < 0) {
    errors.push("Original price must be greater than or equal to 0");
  }

  if (
    salePrice.salePrice !== undefined &&
    salePrice.originalPrice !== undefined
  ) {
    if (salePrice.salePrice > salePrice.originalPrice) {
      errors.push("Sale price cannot be higher than original price");
    }
  }

  if (salePrice.startDate && salePrice.endDate) {
    const startDate = new Date(salePrice.startDate);
    const endDate = new Date(salePrice.endDate);

    if (startDate >= endDate) {
      errors.push("Start date must be before end date");
    }
  }

  if (salePrice.discountPercentage !== undefined) {
    if (
      salePrice.discountPercentage < 0 ||
      salePrice.discountPercentage > 100
    ) {
      errors.push("Discount percentage must be between 0 and 100");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function calculateDiscountPercentage(originalPrice, salePrice) {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (!salePrice || salePrice < 0) return 0;
  if (salePrice >= originalPrice) return 0;

  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export function calculateSalePrice(originalPrice, discountPercentage) {
  if (!originalPrice || originalPrice <= 0) return 0;
  if (!discountPercentage || discountPercentage <= 0) return originalPrice;
  if (discountPercentage >= 100) return 0;

  return Math.round(originalPrice * (1 - discountPercentage / 100) * 100) / 100;
}

// Cache-related functions
export async function getCachedSalesPrices(ttl = 5 * 60 * 1000) {
  try {
    const cacheKey = `sales_prices_${Date.now()}`;
    const cached = adminHttpService.cache?.get(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await getSalesPrices();

    if (adminHttpService.cache) {
      adminHttpService.cache.set(cacheKey, response, ttl);
    }

    return response;
  } catch (err) {
    console.error("Failed to get cached sales prices:", err);
    throw err;
  }
}

export function invalidateSalesCache() {
  if (adminHttpService.clearCache) {
    adminHttpService.clearCache();
    if (import.meta.env.DEV) {
      console.log("Sales cache invalidated");
    }
  }
}

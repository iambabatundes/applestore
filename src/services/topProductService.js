import { publicHttpService } from "./http/index";

// Use relative path - let the service handle base URL
const topProductsPath = "/api/top-products";

export function getTopProducts() {
  return publicHttpService.get(topProductsPath);
}

// Optional: Add more top products related functions
export function getTopProductsByCategory(categoryId) {
  return publicHttpService.get(`${topProductsPath}/category/${categoryId}`);
}

export function getTopProductsByTimeframe(timeframe = "week") {
  return publicHttpService.get(`${topProductsPath}?timeframe=${timeframe}`);
}

export function getTopProductsWithFilters(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const url = queryParams
    ? `${topProductsPath}?${queryParams}`
    : topProductsPath;

  return publicHttpService.get(url);
}

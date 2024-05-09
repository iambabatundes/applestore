import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/products";

export function getProducts() {
  return http.get(apiEndPoint);
}
export function getProduct(productId) {
  return http.get(apiEndPoint + "/" + productId);
}

export function saveProduct(product) {
  console.log("Saving tag:", product); //
  return http.post(apiEndPoint, product);
}

export function updateProduct(productId, product) {
  return http.put(apiEndPoint + "/" + productId, product);
}

export function deleteProduct(productId) {
  return http.delete(apiEndPoint + "/" + productId);
}

export function getProductsByTag(tagId) {
  return http.get(apiEndPoint + "/tag/" + tagId); // Assuming the backend endpoint is /products/tag/:tagId
}

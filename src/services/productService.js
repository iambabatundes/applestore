import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/products`;

function productUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getProducts() {
  return http.get(apiEndPoint);
}

export function getProduct(productId) {
  return http.get(productUrl(productId));
}

export function saveProduct(product) {
  console.log("Saving product:", product);
  if (product._id) {
    const body = { ...product };
    delete body._id;
    return http.put(productUrl(product._id), body);
  }
  return http.post(apiEndPoint, product);
}

export function updateProduct(productId, product) {
  return http.put(productUrl(productId), product);
}

export function deleteProduct(productId) {
  return http.delete(productUrl(productId));
}

export function getProductsByTag(tagId) {
  return http.get(`${apiEndPoint}/tag/${tagId}`);
}

import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/categories";

export function getCategories() {
  return http.get(apiEndPoint);
}

export function getCategory(categoryId) {
  return http.get(apiEndPoint + "/" + categoryId);
}

export function saveCategory(category) {
  console.log("Saving Category:", category);
  return http.post(apiEndPoint, category);
}

export function updateCategory(categoryId, category) {
  return http.put(apiEndPoint + "/" + categoryId, category);
}

export function deleteCategory(categoryId) {
  return http.delete(apiEndPoint + "/" + categoryId);
}

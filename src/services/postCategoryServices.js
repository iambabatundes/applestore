import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/post-categories";

export function getPostCategories() {
  return http.get(apiEndPoint);
}

export function getPostCategory(categoryId) {
  return http.get(apiEndPoint + "/" + categoryId);
}

export function savePostCategory(category) {
  console.log("Saving Category:", category);
  return http.post(apiEndPoint, category);
}

export function updatePostCategory(categoryId, category) {
  return http.put(apiEndPoint + "/" + categoryId, category);
}

export function deletePostCategory(categoryId) {
  return http.delete(apiEndPoint + "/" + categoryId);
}

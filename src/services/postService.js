import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/posts";

export function getPosts() {
  return http.get(apiEndPoint);
}
export function getPost(postId) {
  return http.get(apiEndPoint + "/" + postId);
}

export function savePost(post) {
  console.log("Saving post:", post); //
  return http.post(apiEndPoint, post);
}

export function updatePost(postId, post) {
  return http.put(apiEndPoint + "/" + postId, post);
}

export function deletePost(post) {
  return http.delete(apiEndPoint + "/" + post);
}

export function getPostsByTag(tagId) {
  return http.get(apiEndPoint + "/tag/" + tagId); // Assuming the backend endpoint is /products/tag/:tagId
}

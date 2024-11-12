import http from "../services/httpService";
// import config from "../config.json";
const apiEndPoint = "http://localhost:4000/api/tags";

// const apiEndPoint = config.apiUrl + "/tags";

export function getTags() {
  return http.get(apiEndPoint);
}

export function getTag(tagId) {
  return http.get(apiEndPoint + "/" + tagId);
}

export function saveTag(tag) {
  return http.post(apiEndPoint, tag);
}

export function updateTag(tagId, tag) {
  return http.put(apiEndPoint + "/" + tagId, tag);
}

export function deleteTag(tagId) {
  return http.delete(apiEndPoint + "/" + tagId);
}

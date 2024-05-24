import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/post-tags";

export function getPostTags() {
  return http.get(apiEndPoint);
}

export function getPostTag(tagId) {
  return http.get(apiEndPoint + "/" + tagId);
}

export function savePostTag(tag) {
  return http.post(apiEndPoint, tag);
}

// export function updateTag(tagId, tag) {
//   if (tag._id) {
//     const body = { ...tag };
//     delete body._id;
//     return http.put(apiEndPoint + "/" + tagId, body);
//   }

//   throw new Error("Cannot update tag without _id property");
// }

export function updatePostTag(tagId, tag) {
  return http.put(apiEndPoint + "/" + tagId, tag);
}

export function deletePostTag(tagId) {
  return http.delete(apiEndPoint + "/" + tagId);
}

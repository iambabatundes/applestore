import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/posts";
const tokenKey = "token";

function postUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getPosts() {
  return http.get(apiEndPoint);
}

export async function getUserPosts() {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    http.setJwt(token);
  }

  const { data } = await http.get(`${apiEndPoint}/me`);
  return data;
}

export function getPost(postId) {
  return http.get(postUrl(postId));
}

function createFormData(post, userId) {
  const formData = new FormData();

  if (userId && typeof userId === "object") {
    formData.append("userId", JSON.stringify(userId));
  }

  // if (userId) {
  //   formData.append("userId", userId._id);
  // }

  for (const key in post) {
    if (key === "_id") {
      continue; // Skip the _id field
    } else if (key === "postMainImage") {
      if (post[key] && post[key].file) {
        formData.append("postMainImage", post[key].file);
      }
    } else if (key === "media") {
      if (Array.isArray(post[key])) {
        post[key].forEach((file) => formData.append("media", file));
      }
    } else if (Array.isArray(post[key])) {
      post[key].forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, post[key]);
    }
  }

  return formData;
}

export function savePost(post, userId) {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    http.setJwt(token);
  }

  const formData = createFormData(post, userId);

  if (post._id) {
    return http.put(postUrl(post._id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  return http.post(apiEndPoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function updatePost(postId, post, userId) {
  const formData = createFormData(post, userId);

  return http.put(postUrl(postId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deletePost(postId) {
  return http.delete(postUrl(postId));
}

export function getPostsByTag(tagId) {
  return http.get(`${apiEndPoint}/tag/${tagId}`);
}

export function getPostByCategory(categoryId) {
  return http.get(`${apiEndPoint}/category/${categoryId}`);
}

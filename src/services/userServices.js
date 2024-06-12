import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/users`;

function userUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getUsers() {
  return http.get(apiEndPoint);
}

export function getUser(userId) {
  return http.get(userUrl(userId));
}

function createFormData(user) {
  const formData = new FormData();

  for (const key in user) {
    if (key === "_id") {
      continue; // Skip the _id field
    } else if (key === "profileImage") {
      if (user[key] && user[key].file) {
        formData.append("profileImage", user[key].file);
      }
    } else if (Array.isArray(user[key])) {
      user[key].forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, user[key]);
    }
  }

  return formData;
}

export function saveUser(user) {
  console.log("Saving tag:", user); //
  return http.post(apiEndPoint, user);
}

export function updateUser(userId, user) {
  const formData = createFormData(user);

  return http.put(userUrl(userId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteUser(userId) {
  return http.delete(userUrl(userId));
}

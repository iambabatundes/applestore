import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/users/profile`;

function createFormData(user) {
  const formData = new FormData();

  for (const key in user) {
    if (key === "_id") {
      continue; // Skip the _id field
    } else if (key === "profileImage" && user[key] && user[key].file) {
      formData.append("profileImage", user[key].file);
    } else {
      formData.append(key, user[key]);
    }
  }

  return formData;
}

export function updateUser(user) {
  const formData = createFormData(user);

  return http.put(apiEndPoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

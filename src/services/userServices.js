import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/users`;
const tokenKey = "token";

function userUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getUsers() {
  return http.get(apiEndPoint);
}

export function getUser(userId) {
  return http.get(userUrl(userId));
}

export async function getUserProfile() {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    http.setJwt(token);
  }

  const { data } = await http.get(`${apiEndPoint}/me`);
  return data;
}

export function createUser(user) {
  return http.post(apiEndPoint, {
    firstName: user.firstName,
    username: user.username,
    phoneNumber: user.phoneNumber,
    email: user.email,
    password: user.password,
  });
}

export function verifyUser({ email, phoneNumber }, verificationCode) {
  return http.post(`${apiEndPoint}/verify`, {
    email,
    phoneNumber,
    verificationCode,
  });
}

export function resendValidationCode(email, phoneNumber) {
  return http.post(`${apiEndPoint}/resend-code`, { email, phoneNumber });
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

export function updateUser(user) {
  const formData = createFormData(user);

  return http.put(`${apiEndPoint}/profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteUser(userId) {
  return http.delete(userUrl(userId));
}

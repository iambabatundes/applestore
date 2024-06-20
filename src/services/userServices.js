import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/users`;
const apiEndUser = `${config.apiUrl}/users/register`;
const apiEndVerify = `${config.apiUrl}/users/verify`;
const apiEndRegistration = `${config.apiUrl}/users/complete-registration`;
const apiEndResendCode = `${config.apiUrl}/users/resend-code`;

function userUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getUsers() {
  return http.get(apiEndPoint);
}

export function getUser(userId) {
  return http.get(userUrl(userId));
}

export function createUser(emailPhone) {
  return http.post(apiEndUser, emailPhone);
}

export function verifyUser(emailPhone, verificationCode) {
  return http.post(apiEndVerify, emailPhone, verificationCode);
}

export function completeRegistration(user) {
  return http.post(apiEndRegistration, { user });
}
export function ResendValidationCode(emailPhone) {
  return http.post(apiEndResendCode, emailPhone);
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

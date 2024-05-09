import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/users";

export function getUsers() {
  return http.get(apiEndPoint);
}
export function getUser(userId) {
  return http.get(apiEndPoint + "/" + userId);
}

export function saveUser(user) {
  console.log("Saving tag:", user); //
  return http.post(apiEndPoint, user);
}

export function updateUser(userId, user) {
  return http.put(apiEndPoint + "/" + userId, user);
}

export function deleteUser(userId) {
  return http.delete(apiEndPoint + "/" + userId);
}

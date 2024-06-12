// services/adminService.js
import http from "./httpService";
import config from "../config.json";

const endPoint = `${config.apiUrl}/admin/me`;
const tokenKey = "token";

export async function getAdminUser() {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    http.setJwt(token);
  }

  const { data } = await http.get(endPoint);
  return data;
}

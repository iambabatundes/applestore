import http from "./httpService";
import { jwtDecode } from "jwt-decode"; // Ensure this matches the actual named export from 'jwt-decode'
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/admin/auth";
const tokenKey = "token";

http.setJwt(getJwt());

async function adminlogin(email, password) {
  const { data: jwt } = await http.post(apiEndPoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
}

function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

function adminlogout() {
  localStorage.removeItem(tokenKey);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (error) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

export { adminlogin, loginWithJwt, adminlogout, getCurrentUser, getJwt };

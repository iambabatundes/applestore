import http from "./httpService";
import { jwtDecode } from "jwt-decode";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/auth";
const endPoint = `${config.apiUrl}/users/me`;
// const apiEndPointCheck = config.apiUrl + "/auth/check-user";

const tokenKey = "token";

async function getUser() {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    http.setJwt(token);
  }

  const { data } = await http.get(endPoint);
  return data;
}

http.setJwt(getJwt());

// async function checkUser(emailPhone) {
//   const { data } = await http.post(apiEndPointCheck, { emailPhone });
//   return data;
// }

async function login(email, password) {
  const { data: jwt } = await http.post(apiEndPoint, { email, password });
  localStorage.setItem(tokenKey, jwt);
}

function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
}

function logout() {
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

export { getUser, login, loginWithJwt, logout, getCurrentUser, getJwt };

import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/addresses";
const tokenKey = "token";

function addressUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getAddresses() {
  return http.get(apiEndPoint);
}

export function getAddress(addressId) {
  return http.get(addressUrl(addressId));
}

export async function getUserAddress() {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    http.setJwt(token);
  }

  const { data } = await http.get(`${apiEndPoint}/me`);
  return data;
}

export async function saveAddress(address) {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    http.setJwt(token);
  }
  return http.post(apiEndPoint, address);
}

export function updateAddress(addressId, address) {
  return http.put(addressUrl(addressId), address);
}

export function deleteAddress(postId) {
  return http.delete(addressUrl(postId));
}

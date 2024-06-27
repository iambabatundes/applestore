import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/address";

function addressUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getAddresses() {
  return http.get(apiEndPoint);
}

export function getAddress(addressId) {
  return http.get(addressUrl(addressId));
}

export function saveAddress(address) {
  return http.post(apiEndPoint, address);
}

export function updateAddress(addressId, address) {
  return http.put(addressUrl(addressId), address);
}

export function deleteAddress(postId) {
  return http.delete(addressUrl(postId));
}

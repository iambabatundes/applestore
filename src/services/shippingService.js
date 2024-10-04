import http from "../services/httpService";
// import config from "../config.json";

const apiEndPoint = "http://localhost:4000/api/shipping-rates";
// const apiEndPoint = config.apiUrl + "/shipping-rates";

export function getShippingRates() {
  return http.get(apiEndPoint);
}

export function getShippingRate(shippingId) {
  return http.get(apiEndPoint + "/" + shippingId);
}

export function saveShippingRate(shipping) {
  return http.post(apiEndPoint, shipping);
}

export function updateShippingRate(shippingId, shipping) {
  return http.put(apiEndPoint + "/" + shippingId, shipping);
}

export function deleteShippingRate(shippingId) {
  return http.delete(apiEndPoint + "/" + shippingId);
}

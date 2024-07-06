import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/orders`;

function orderUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function fetchUsersOrder(userId) {
  return http.get(`${apiEndPoint}/users/${userId}`);
}

export function getOrders() {
  return http.get(apiEndPoint);
}

export function getOrder(orderId) {
  return http.get(orderUrl(orderId));
}

export function saveOrder(order) {
  if (order._id) {
    const body = { ...order };
    delete body._id;
    return http.put(orderUrl(order._id), body);
  }
  return http.post(apiEndPoint, order);
}

export function deleteOrder(orderId) {
  return http.delete(orderUrl(orderId));
}

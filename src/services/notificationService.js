import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/notifications`;

function notificationUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getNotifications() {
  return http.get(apiEndPoint);
}

export function getNotification(notificationId) {
  return http.get(notificationUrl(notificationId));
}

export function createNotification(notification) {
  return http.post(apiEndPoint, notification);
}

import { userHttpService, adminHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/notifications`;

function notificationUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getNotifications() {
  try {
    const { data } = await userHttpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch notifications:", err);
    throw err;
  }
}

export async function getNotification(notificationId) {
  try {
    const { data } = await userHttpService.get(notificationUrl(notificationId));
    return data;
  } catch (err) {
    console.error("Failed to fetch notification:", err);
    throw err;
  }
}

export async function createNotification(notification) {
  try {
    const { data } = await adminHttpService.post(apiEndPoint, notification);
    return data;
  } catch (err) {
    console.error("Failed to create notification:", err);
    throw err;
  }
}

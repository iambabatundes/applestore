import { userHttpService, adminHttpService } from "./http/index.js";

const notificationsPath = "/api/notifications";

function notificationUrl(id) {
  return `${notificationsPath}/${id}`;
}

// User functions - managing personal notifications
export async function getNotifications() {
  try {
    const { data } = await userHttpService.get(notificationsPath);
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

export async function markNotificationAsRead(notificationId) {
  try {
    const { data } = await userHttpService.put(
      `${notificationUrl(notificationId)}/read`
    );
    return data;
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
    throw err;
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const { data } = await userHttpService.put(`${notificationsPath}/read-all`);
    return data;
  } catch (err) {
    console.error("Failed to mark all notifications as read:", err);
    throw err;
  }
}

export async function deleteNotification(notificationId) {
  try {
    const { data } = await userHttpService.delete(
      notificationUrl(notificationId)
    );
    return data;
  } catch (err) {
    console.error("Failed to delete notification:", err);
    throw err;
  }
}

export async function getUnreadNotificationCount() {
  try {
    const { data } = await userHttpService.get(
      `${notificationsPath}/unread-count`
    );
    return data;
  } catch (err) {
    console.error("Failed to get unread notification count:", err);
    throw err;
  }
}

// Admin functions - creating and managing system notifications
export async function createNotification(notification) {
  try {
    const { data } = await adminHttpService.post(
      notificationsPath,
      notification
    );
    return data;
  } catch (err) {
    console.error("Failed to create notification:", err);
    throw err;
  }
}

export async function getAllNotifications() {
  try {
    const { data } = await adminHttpService.get(notificationsPath);
    return data;
  } catch (err) {
    console.error("Failed to fetch all notifications:", err);
    throw err;
  }
}

export async function updateNotification(notificationId, notification) {
  try {
    const { data } = await adminHttpService.put(
      notificationUrl(notificationId),
      notification
    );
    return data;
  } catch (err) {
    console.error("Failed to update notification:", err);
    throw err;
  }
}

export async function deleteNotificationAdmin(notificationId) {
  try {
    const { data } = await adminHttpService.delete(
      notificationUrl(notificationId)
    );
    return data;
  } catch (err) {
    console.error("Failed to delete notification (admin):", err);
    throw err;
  }
}

export async function sendBulkNotification(notificationData) {
  try {
    const { data } = await adminHttpService.post(
      `${notificationsPath}/bulk`,
      notificationData
    );
    return data;
  } catch (err) {
    console.error("Failed to send bulk notification:", err);
    throw err;
  }
}

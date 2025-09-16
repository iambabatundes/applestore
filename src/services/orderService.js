import { userHttpService, adminHttpService } from "./http/index";

// Use relative path - let services handle their base URLs
const ordersPath = "/api/orders";

function orderUrl(id) {
  return `${ordersPath}/${id}`;
}

export async function fetchUsersOrder(userId) {
  try {
    const { data } = await userHttpService.get(`${ordersPath}/users/${userId}`);
    return data;
  } catch (err) {
    console.error("Failed to fetch user's orders:", err);
    throw err;
  }
}

export async function getUserOrders() {
  try {
    const { data } = await userHttpService.get(`${ordersPath}/me`);
    return data;
  } catch (err) {
    console.error("Failed to fetch user orders:", err);
    throw err;
  }
}

export async function getOrders() {
  try {
    const { data } = await adminHttpService.get(ordersPath);
    return data;
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    throw err;
  }
}

export async function getOrder(orderId) {
  try {
    const { data } = await adminHttpService.get(orderUrl(orderId));
    return data;
  } catch (err) {
    console.error("Failed to fetch order:", err);
    throw err;
  }
}

export async function saveOrder(order) {
  try {
    if (order._id) {
      const body = { ...order };
      delete body._id;
      const { data } = await userHttpService.put(orderUrl(order._id), body);
      return data;
    }
    const { data } = await userHttpService.post(ordersPath, order);
    return data;
  } catch (err) {
    console.error("Failed to save order:", err);
    throw err;
  }
}

export async function deleteOrder(orderId) {
  try {
    const { data } = await adminHttpService.delete(orderUrl(orderId));
    return data;
  } catch (err) {
    console.error("Failed to delete order:", err);
    throw err;
  }
}

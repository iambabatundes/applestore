import { userHttpService, adminHttpService } from "./http/index";

const ordersPath = "/api/orders";

function orderUrl(id) {
  return `${ordersPath}/${id}`;
}

export async function getOrders(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const { data } = await adminHttpService.get(
      `${ordersPath}${queryString ? `?${queryString}` : ""}`
    );
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

export async function getUserOrders(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const { data } = await userHttpService.get(
      `${ordersPath}/me${queryString ? `?${queryString}` : ""}`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch user orders:", err);
    throw err;
  }
}

export async function fetchUsersOrder(userId) {
  try {
    const { data } = await adminHttpService.get(
      `${ordersPath}/users/${userId}`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch user's orders:", err);
    throw err;
  }
}

export async function createOrder(order) {
  try {
    const { data } = await userHttpService.post(ordersPath, order);
    return data;
  } catch (err) {
    console.error("Failed to create order:", err);
    throw err;
  }
}

export async function updateOrderStatus(orderId, statusData, isBulk = false) {
  try {
    if (isBulk) {
      const { data } = await adminHttpService.patch(
        `${ordersPath}/bulk/status`,
        statusData
      );
      return data;
    } else {
      const { data } = await adminHttpService.patch(
        `${orderUrl(orderId)}/status`,
        statusData
      );
      return data;
    }
  } catch (err) {
    console.error("Failed to update order status:", err);
    throw err;
  }
}

export async function cancelOrder(orderId, cancelData = {}) {
  try {
    const { data } = await userHttpService.post(
      `${orderUrl(orderId)}/cancel`,
      cancelData
    );
    return data;
  } catch (err) {
    console.error("Failed to cancel order:", err);
    throw err;
  }
}

export async function refundOrder(orderId, refundData) {
  try {
    const { data } = await adminHttpService.post(
      `${orderUrl(orderId)}/refund`,
      refundData
    );
    return data;
  } catch (err) {
    console.error("Failed to process refund:", err);
    throw err;
  }
}

export async function createShippingLabel(orderId) {
  try {
    const { data } = await adminHttpService.post(
      `${orderUrl(orderId)}/shipping-label`
    );
    return data;
  } catch (err) {
    console.error("Failed to create shipping label:", err);
    throw err;
  }
}

export async function trackShipment(orderId) {
  try {
    const { data } = await userHttpService.get(`${orderUrl(orderId)}/tracking`);
    return data;
  } catch (err) {
    console.error("Failed to track shipment:", err);
    throw err;
  }
}

export async function getShippingRates(shippingData) {
  try {
    const { data } = await userHttpService.post(
      `${ordersPath}/shipping-rates`,
      shippingData
    );
    return data;
  } catch (err) {
    console.error("Failed to get shipping rates:", err);
    throw err;
  }
}

export async function getRevenueAnalytics(startDate, endDate) {
  try {
    const { data } = await adminHttpService.get(
      `${ordersPath}/analytics/revenue`,
      {
        params: { startDate, endDate },
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch revenue analytics:", err);
    throw err;
  }
}

export async function getTopProducts(startDate, endDate, limit = 10) {
  try {
    const { data } = await adminHttpService.get(
      `${ordersPath}/analytics/top-products`,
      {
        params: { startDate, endDate, limit },
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch top products:", err);
    throw err;
  }
}

export async function getUserOrderStats(userId) {
  try {
    const { data } = await adminHttpService.get(
      `${ordersPath}/users/${userId}/stats`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch user order stats:", err);
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

export async function restoreOrder(orderId) {
  try {
    const { data } = await adminHttpService.post(
      `${orderUrl(orderId)}/restore`
    );
    return data;
  } catch (err) {
    console.error("Failed to restore order:", err);
    throw err;
  }
}

export function getExportURL(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return `${ordersPath}/export/csv${queryString ? `?${queryString}` : ""}`;
}

// export async function exportOrdersCSV(filters = {}) {
//   try {
//     const response = await adminHttpService.get(
//       `${ordersPath}/export/csv`,
//       {
//         params: filters,
//         responseType: "blob",
//       }
//     );

//     // Create download link
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `orders-${Date.now()}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();

//     return { success: true };
//   } catch (err) {
//     console.error("Failed to export orders:", err);
//     throw err;
//   }
// }

// Legacy support - deprecated

export async function saveOrder(order) {
  console.warn(
    "saveOrder is deprecated. Use createOrder or updateOrderStatus instead."
  );
  return createOrder(order);
}

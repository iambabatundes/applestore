import {
  adminHttpService,
  userHttpService,
  publicHttpService,
} from "./http/index.js";

const couponsPath = "/api/coupons";

function couponUrl(id) {
  return `${couponsPath}/${id}`;
}

function clearCouponCache() {
  adminHttpService.clearCache();
  publicHttpService.clearCache();
}

export async function getCoupons(params = {}) {
  try {
    const response = await adminHttpService.get(couponsPath, { params });
    clearCouponCache();

    return {
      data: response.data.data || [],
      pagination: response.data.pagination || null,
    };
  } catch (err) {
    console.error("Failed to fetch coupons:", err);
    throw err;
  }
}

export async function getActiveCoupons() {
  try {
    const response = await adminHttpService.get(`${couponsPath}/active`);
    clearCouponCache();
    return response.data.data || [];
  } catch (err) {
    console.error("Failed to fetch active coupons:", err);
    throw err;
  }
}

export async function getCoupon(couponId) {
  try {
    const response = await adminHttpService.get(couponUrl(couponId));
    clearCouponCache();
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch coupon:", err);
    throw err;
  }
}

export async function saveCoupon(coupon) {
  try {
    const response = await adminHttpService.post(couponsPath, coupon);
    clearCouponCache();
    return response.data.data;
  } catch (err) {
    console.error("Failed to create coupon:", err);
    throw err;
  }
}

export async function updateCoupon(couponId, coupon) {
  try {
    const response = await adminHttpService.put(couponUrl(couponId), coupon);
    clearCouponCache();
    return response.data.data;
  } catch (err) {
    console.error("Failed to update coupon:", err);
    throw err;
  }
}

export async function deleteCoupon(couponId) {
  try {
    const response = await adminHttpService.delete(couponUrl(couponId));
    clearCouponCache();
    return response.data.data;
  } catch (err) {
    console.error("Failed to delete coupon:", err);
    throw err;
  }
}

export async function activateCoupon(couponId) {
  try {
    const response = await adminHttpService.patch(
      `${couponUrl(couponId)}/activate`
    );
    clearCouponCache();
    return response.data.data;
  } catch (err) {
    console.error("Failed to activate coupon:", err);
    throw err;
  }
}

export async function getCouponStats() {
  try {
    const response = await adminHttpService.get(`${couponsPath}/admin/stats`);
    return response.data.data;
  } catch (err) {
    console.error("Failed to fetch coupon stats:", err);
    throw err;
  }
}

export async function validateCoupon(code, subtotal, items = []) {
  try {
    const response = await userHttpService.post(`${couponsPath}/validate`, {
      code,
      subtotal,
      items,
    });
    return response.data.data;
  } catch (err) {
    console.error("Failed to validate coupon:", err);
    throw err;
  }
}

export async function applyCoupon(code, orderId, subtotal, items = []) {
  try {
    const response = await userHttpService.post(`${couponsPath}/apply`, {
      code,
      orderId,
      subtotal,
      items,
    });
    clearCouponCache();
    return response.data.data;
  } catch (err) {
    console.error("Failed to apply coupon:", err);
    throw err;
  }
}

export async function rollbackCoupon(code, orderId, reason) {
  try {
    const response = await userHttpService.post(`${couponsPath}/rollback`, {
      code,
      orderId,
      reason,
    });
    clearCouponCache();
    return response.data;
  } catch (err) {
    console.error("Failed to rollback coupon:", err);
    throw err;
  }
}

export async function getUserAvailableCoupons() {
  try {
    const response = await userHttpService.get(`${couponsPath}/user/available`);
    return response.data.data || [];
  } catch (err) {
    console.error("Failed to fetch available coupons:", err);
    throw err;
  }
}

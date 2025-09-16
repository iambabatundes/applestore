import {
  adminHttpService,
  userHttpService,
  publicHttpService,
} from "./http/index.js";

const couponsPath = "/api/coupons";

function couponUrl(id) {
  return `${couponsPath}/${id}`;
}

export async function getCoupons() {
  try {
    const { data } = await adminHttpService.get(couponsPath);
    return data;
  } catch (err) {
    console.error("Failed to fetch coupons:", err);
    throw err;
  }
}

export async function getCoupon(couponId) {
  try {
    const { data } = await adminHttpService.get(couponUrl(couponId));
    return data;
  } catch (err) {
    console.error("Failed to fetch coupon:", err);
    throw err;
  }
}

export async function saveCoupon(coupon) {
  try {
    const { data } = await adminHttpService.post(couponsPath, coupon);
    return data;
  } catch (err) {
    console.error("Failed to create coupon:", err);
    throw err;
  }
}

export async function updateCoupon(couponId, coupon) {
  try {
    const { data } = await adminHttpService.put(couponUrl(couponId), coupon);
    return data;
  } catch (err) {
    console.error("Failed to update coupon:", err);
    throw err;
  }
}

export async function deleteCoupon(couponId) {
  try {
    const { data } = await adminHttpService.delete(couponUrl(couponId));
    return data;
  } catch (err) {
    console.error("Failed to delete coupon:", err);
    throw err;
  }
}

// User functions - applying and validating coupons
export async function applyCoupon(couponCode) {
  try {
    const { data } = await userHttpService.post(`${couponsPath}/apply`, {
      code: couponCode,
    });
    return data;
  } catch (err) {
    console.error("Failed to apply coupon:", err);
    throw err;
  }
}

export async function validateCoupon(couponCode, cartTotal = null) {
  try {
    const { data } = await userHttpService.post(`${couponsPath}/validate`, {
      code: couponCode,
      cartTotal,
    });
    return data;
  } catch (err) {
    console.error("Failed to validate coupon:", err);
    throw err;
  }
}

// Public functions - get active/public coupons
export async function getPublicCoupons() {
  try {
    const { data } = await publicHttpService.get(`${couponsPath}/public`);
    return data;
  } catch (err) {
    console.error("Failed to fetch public coupons:", err);
    throw err;
  }
}

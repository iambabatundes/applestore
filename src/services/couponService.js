import { userHttpService, adminHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/coupons`;

function couponUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getCoupons() {
  try {
    const { data } = await adminHttpService.get(apiEndPoint);
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
    const { data } = await adminHttpService.post(apiEndPoint, coupon);
    return data;
  } catch (err) {
    console.error("Failed to save coupon:", err);
    throw err;
  }
}

export async function validateCoupon(coupon) {
  try {
    const { data } = await userHttpService.post(`${apiEndPoint}/validate`, {
      coupon,
    });
    return data;
  } catch (err) {
    console.error("Failed to validate coupon:", err);
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

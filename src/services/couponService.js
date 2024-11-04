import http from "../services/httpService";
// import config from "../config.json";

const apiEndPoint = "http://localhost:4000/api/coupons";

export function getCoupons() {
  return http.get(apiEndPoint);
}

export function getCoupon(couponId) {
  return http.get(apiEndPoint + "/" + couponId);
}

export function saveCoupon(coupon) {
  return http.post(apiEndPoint, coupon);
}

export function validateCoupon(coupon) {
  return http.post(apiEndPoint + "/validate" + coupon);
}

export function updateCoupon(couponId, coupon) {
  return http.put(apiEndPoint + "/" + couponId, coupon);
}

export function deleteCoupon(couponId) {
  return http.delete(`${apiEndPoint}/${couponId}`);
}

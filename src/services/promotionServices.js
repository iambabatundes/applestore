import http from "../services/httpService";
// import config from "../config.json";

// const apiEndPoint = config.apiUrl + "/promotions";
const apiEndPoint = "http://localhost:4000/api/promotions";

export function getPromotions() {
  return http.get(apiEndPoint);
}

export function getPromotion(promotionId) {
  return http.get(apiEndPoint + "/" + promotionId);
}

export function savePromotion(promotion) {
  return http.post(apiEndPoint, promotion);
}

export function updatePromotion(promotionId, promotion) {
  return http.put(apiEndPoint + "/" + promotionId, promotion);
}

export function deletePromotion(promotionId) {
  return http.delete(apiEndPoint + "/" + promotionId);
}

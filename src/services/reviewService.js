import http from "../services/httpService";
import config from "../config.json";

const apiEndpoint = `${config.apiUrl}/reviews`;

export function getReviews() {
  return http.get(apiEndpoint);
}

export function getReviewById(reviewId) {
  return http.get(`${apiEndpoint}/${reviewId}`);
}

export function voteReview(reviewId, type) {
  return http.post(`${apiEndpoint}/${reviewId}/vote`, { vote: type });
}

export function reportReview(reviewId, reason) {
  return http.post(`/reviews/${reviewId}/report`, { reason });
}

export function getReviewsByProduct(productId, page = 1, limit = 10) {
  return http.get(
    `${apiEndpoint}/products/${productId}?page=${page}&limit=${limit}`
  );
}

export function createReview(productId, reviewData) {
  return http.post(`${apiEndpoint}?productId=${productId}`, reviewData);
}

export function updateReview(reviewId, reviewData) {
  return http.put(`${apiEndpoint}/${reviewId}`, reviewData);
}

export function deleteReview(reviewId) {
  return http.delete(`${apiEndpoint}/${reviewId}`);
}

export function getReportedReviews(status = "pending", page = 1, limit = 10) {
  return http.get(
    `/reviews/reports?status=${status}&page=${page}&limit=${limit}`
  );
}

export function updateReviewReportStatus(reviewId, status) {
  return http.patch(`/reviews/reports/${reviewId}/report-status`, {
    status,
  });
}

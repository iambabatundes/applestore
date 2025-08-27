import {
  httpService,
  publicHttpService,
  userHttpService,
  adminHttpService,
} from "../services/httpService";
const apiEndpoint = `${import.meta.env.VITE_API_URL}/api/reviews`;

export async function getReviews() {
  try {
    return publicHttpService.get(apiEndpoint);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    throw err;
  }
}

export async function getReviewById(reviewId) {
  try {
    return publicHttpService.get(`${apiEndpoint}/${reviewId}`);
  } catch (err) {
    console.error("Failed to fetch review:", err);
    throw err;
  }
}

export async function voteReview(reviewId, type) {
  try {
    return userHttpService.post(`${apiEndpoint}/${reviewId}/vote`, {
      vote: type,
    });
  } catch (err) {
    console.error("Failed to vote on review:", err);
    throw err;
  }
}

export async function reportReview(reviewId, reason) {
  try {
    return userHttpService.post(`${apiEndpoint}/${reviewId}/report`, {
      reason,
    });
  } catch (err) {
    console.error("Failed to report review:", err);
    throw err;
  }
}

export async function getReviewsByProduct(productId, page = 1, limit = 10) {
  try {
    return publicHttpService.get(
      `${apiEndpoint}/products/${productId}?page=${page}&limit=${limit}`
    );
  } catch (err) {
    console.error("Failed to fetch reviews by product:", err);
    throw err;
  }
}

export async function createReview(productId, reviewData) {
  try {
    return userHttpService.post(
      `${apiEndpoint}?productId=${productId}`,
      reviewData
    );
  } catch (err) {
    console.error("Failed to create review:", err);
    throw err;
  }
}

export async function updateReview(reviewId, reviewData) {
  try {
    return adminHttpService.put(`${apiEndpoint}/${reviewId}`, reviewData);
  } catch (err) {
    console.error("Failed to update review:", err);
    throw err;
  }
}

export async function deleteReview(reviewId) {
  try {
    const { data } = await adminHttpService.delete(
      `${apiEndpoint}/${reviewId}`
    );
    return data;
  } catch (err) {
    console.error("Failed to delete review:", err);
    throw err;
  }
}

export async function getReportedReviews(
  status = "pending",
  page = 1,
  limit = 10
) {
  try {
    const { data } = await adminHttpService.get(
      `${apiEndpoint}/reports?status=${status}&page=${page}&limit=${limit}`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch reported reviews:", err);
    throw err;
  }
}

export async function updateReviewReportStatus(reviewId, status) {
  try {
    const { data } = await adminHttpService.patch(
      `${apiEndpoint}/reports/${reviewId}/report-status`,
      { status }
    );
    return data;
  } catch (err) {
    console.error("Failed to update review report status:", err);
    throw err;
  }
}

// export function voteReview(reviewId, type) {
//   return http.post(`${apiEndpoint}/${reviewId}/vote`, { vote: type });
// }

// export function reportReview(reviewId, reason) {
//   return http.post(`/reviews/${reviewId}/report`, { reason });
// }

// export function getReviewsByProduct(productId, page = 1, limit = 10) {
//   return http.get(
//     `${apiEndpoint}/products/${productId}?page=${page}&limit=${limit}`
//   );
// }

// export function createReview(productId, reviewData) {
//   return http.post(`${apiEndpoint}?productId=${productId}`, reviewData);
// }

// export function updateReview(reviewId, reviewData) {
//   return http.put(`${apiEndpoint}/${reviewId}`, reviewData);
// }

// export function deleteReview(reviewId) {
//   return http.delete(`${apiEndpoint}/${reviewId}`);
// }

// export function getReportedReviews(status = "pending", page = 1, limit = 10) {
//   return http.get(
//     `/reviews/reports?status=${status}&page=${page}&limit=${limit}`
//   );
// }

// export function updateReviewReportStatus(reviewId, status) {
//   return http.patch(`/reviews/reports/${reviewId}/report-status`, {
//     status,
//   });
// }

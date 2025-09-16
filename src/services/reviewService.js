import {
  publicHttpService,
  userHttpService,
  adminHttpService,
} from "./http/index";

// Reviews endpoint - base path only (services will handle their specific base URLs)
const reviewsPath = "/api/reviews";

export async function getReviews() {
  try {
    return publicHttpService.get(reviewsPath);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    throw err;
  }
}

export async function getReviewById(reviewId) {
  try {
    return publicHttpService.get(`${reviewsPath}/${reviewId}`);
  } catch (err) {
    console.error("Failed to fetch review:", err);
    throw err;
  }
}

export async function voteReview(reviewId, type) {
  try {
    return userHttpService.post(`${reviewsPath}/${reviewId}/vote`, {
      vote: type,
    });
  } catch (err) {
    console.error("Failed to vote on review:", err);
    throw err;
  }
}

export async function reportReview(reviewId, reason) {
  try {
    return userHttpService.post(`${reviewsPath}/${reviewId}/report`, {
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
      `${reviewsPath}/products/${productId}?page=${page}&limit=${limit}`
    );
  } catch (err) {
    console.error("Failed to fetch reviews by product:", err);
    throw err;
  }
}

export async function createReview(productId, reviewData) {
  try {
    return userHttpService.post(
      `${reviewsPath}?productId=${productId}`,
      reviewData
    );
  } catch (err) {
    console.error("Failed to create review:", err);
    throw err;
  }
}

export async function updateReview(reviewId, reviewData) {
  try {
    return adminHttpService.put(`${reviewsPath}/${reviewId}`, reviewData);
  } catch (err) {
    console.error("Failed to update review:", err);
    throw err;
  }
}

export async function deleteReview(reviewId) {
  try {
    const { data } = await adminHttpService.delete(
      `${reviewsPath}/${reviewId}`
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
      `${reviewsPath}/reports?status=${status}&page=${page}&limit=${limit}`
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
      `${reviewsPath}/reports/${reviewId}/report-status`,
      { status }
    );
    return data;
  } catch (err) {
    console.error("Failed to update review report status:", err);
    throw err;
  }
}

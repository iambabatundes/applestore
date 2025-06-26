import { useState, useEffect, useCallback } from "react";
import { getReviewsByProduct } from "../../../../services/reviewService";
import { getCurrentUser } from "../../../../services/authService";

export default function useProductReviews(productId, limit = 10) {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?._id;

  const resetState = () => {
    setReviews([]);
    setTotalReviews(0);
    setRating(0);
    setPage(1);
    setHasMore(true);
    setError(null);
    setInitialLoading(true);
  };

  const loadMore = useCallback(async () => {
    if (!productId || loading || !hasMore) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await getReviewsByProduct(productId, page, limit);
      if (data?.reviews) {
        setReviews((prev) => [...prev, ...data.reviews]);
        setTotalReviews(data.totalCount || 0);
        setRating(data.averageRating || 0);
        setHasMore(data.reviews.length === limit);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more reviews:", err);
      setError("Something went wrong while loading reviews.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [productId, page, limit, loading, hasMore]);

  useEffect(() => {
    if (productId) {
      resetState();
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      loadMore();
    }
  }, [productId, loadMore]);

  return {
    reviews,
    totalReviews,
    rating,
    hasMore,
    loading,
    initialLoading,
    error,
    loadMore,
    currentUserId,
  };
}

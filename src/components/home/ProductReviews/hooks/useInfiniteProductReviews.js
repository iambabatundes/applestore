import { useState, useEffect } from "react";
import { getReviewsByProduct } from "../../../../services/reviewService";

export default function useProductReviews(productId, page = 1, limit = 10) {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getReviewsByProduct(productId, page, limit);
        setReviews(data.reviews || []);
        setTotalReviews(data.totalCount || 0);
        setRating(data.averageRating || 0);
      } catch (err) {
        console.error("Failed to load reviews", err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [productId, page, limit]);

  return { reviews, totalReviews, rating, loading, error };
}

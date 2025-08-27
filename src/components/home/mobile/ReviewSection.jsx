import React, { useState } from "react";
import useProductReviews from "../../hooks/useProductReviews";
import ReviewItem from "./ReviewItem";
import ReviewModal from "./ReviewModal";

import { useLocation } from "react-router-dom";
export default function ReviewSection({ productId }) {
  const { reviews, totalReviews, rating, loading } =
    useProductReviews(productId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.action === "vote" && location.state?.reviewId) {
      setIsModalOpen(true);
    }
  }, [location.state]);

  if (loading) return <div className="review-loading">Loading reviews...</div>;
  if (!reviews.length) return null;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <section className="review-section">
      <header className="review-header" onClick={handleOpenModal}>
        <h3>Reviews ({totalReviews})</h3>
        <span className="review-average">
          {rating.toFixed(1)}
          <StarRating rating={rating} totalStars={5} />
        </span>
      </header>

      <ReviewImagesCarousel reviews={reviews} />

      <div className="review-list-preview">
        <ReviewItem review={reviews[0]} />
      </div>

      {isModalOpen && (
        <ReviewModal
          productId={productId}
          onClose={handleCloseModal}
          totalReviews={totalReviews}
          rating={rating}
        />
      )}
    </section>
  );
}

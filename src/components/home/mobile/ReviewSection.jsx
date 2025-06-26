import React, { useState } from "react";
import useProductReviews from "../../hooks/useProductReviews";
import ReviewItem from "./ReviewItem";
// import StarRating from "../common/StarRating";
import ReviewModal from "./ReviewModal";

export default function ReviewSection({ productId }) {
  const { reviews, totalReviews, rating, loading } =
    useProductReviews(productId);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

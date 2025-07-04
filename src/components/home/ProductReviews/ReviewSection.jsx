import React, { useState, useMemo } from "react";
import "./styles/reviewSection.css";
import ReviewModal from "./ReviewModal";
import ReviewItem from "./ReviewItem";
import StarRating from "../common/starRating";

export default function ReviewSection({
  product,
  reviews,
  totalReviews,
  rating,
  loading,
  error,
  currentUserId,
  hasPurchased,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Pick a random review using useMemo
  const randomReview = useMemo(() => {
    if (!loading && reviews.length > 0) {
      const index = Math.floor(Math.random() * reviews.length);
      return reviews[index];
    }
    return null;
  }, [reviews, loading]);

  return (
    <section className="review-section">
      <header className="review-header" onClick={handleOpenModal}>
        <h3>Reviews ({product.reviewCount})</h3>
        <span className="productCard__product-rating">
          {product.ratings > 0
            ? `${parseFloat(product.ratings).toFixed(1)} Rating`
            : "0.0"}
        </span>
        <span className="review-average">
          <StarRating
            rating={parseFloat(product.ratings).toFixed(1)}
            totalStars={5}
          />
        </span>
      </header>

      <div onClick={handleOpenModal} className="review-preview">
        {loading && <div>Loading reviews...</div>}
        {error && <div className="error-text">{error}</div>}
        {!loading && reviews.length === 0 && <div>No reviews yet.</div>}
        {!loading && randomReview && (
          <ReviewItem
            key={randomReview._id}
            review={randomReview}
            currentUserId={currentUserId}
          />
        )}
      </div>

      {isModalOpen && (
        <ReviewModal
          productId={product}
          onClose={handleCloseModal}
          totalReviews={totalReviews}
          rating={rating}
          loading={loading}
          reviews={reviews}
          hasPurchased={hasPurchased}
        />
      )}
    </section>
  );
}

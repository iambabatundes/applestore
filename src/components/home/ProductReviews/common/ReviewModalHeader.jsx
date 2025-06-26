import StarRating from "../../common/starRating";
import "../styles/reviewModalHeader.css";

export default function ReviewModalHeader({
  rating,
  totalReviews,
  hasPurchased,
  onClose,
}) {
  return (
    <div className="reviewModal__header">
      {hasPurchased && (
        <button className="reviewModal__writeBtn">✍️ Write a Review</button>
      )}

      {/* <button className="reviewModal__closeBtn" onClick={onClose}>
        ✕
      </button> */}

      {/* <article className="review__rating-info">
        <h4 className="review__rating-score">{rating.toFixed(1)}</h4>
        <StarRating rating={parseFloat(rating).toFixed(1)} />
        <p className="review__total-reviews">{totalReviews} reviews</p>
      </article> */}
    </div>
  );
}

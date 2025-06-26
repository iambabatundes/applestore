import React from "react";
import StarRating from "../common/starRating";
import "./review.css";

export default function ReviewSummary({
  rating = 0,
  totalReviews = 0,
  onClick,
}) {
  return (
    <div className="review-summary" onClick={onClick}>
      <div className="review-summary__rating">
        <span>{rating.toFixed(1)}</span>
        <StarRating rating={rating} totalStars={5} />
      </div>
      <div className="review-summary__count">
        <span>({totalReviews} reviews)</span>
      </div>
    </div>
  );
}

import React from "react";
import StarRating from "./starRating";

export default function ProductRating({
  rating,
  reviews,
  numberOfSales,
  onRatingChange,
}) {
  return (
    <div className="productCard__rating">
      {rating && (
        <StarRating
          rating={rating}
          totalStars={5}
          size={15}
          onRatingChange={onRatingChange}
          initialRating={rating}
          readOnly={true}
        />
      )}

      {reviews && (
        <div className="productCard__details">
          <span>{reviews} Reviews</span>
        </div>
      )}

      {numberOfSales && (
        <span className="productCard__product-sold">{numberOfSales}</span>
      )}
    </div>
  );
}

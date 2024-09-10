import React from "react";
import StarRating from "./starRating";

export default function ProductRating({
  rating,
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
      {numberOfSales && (
        <span className="productCard__product-sold">{numberOfSales}</span>
      )}
    </div>
  );
}

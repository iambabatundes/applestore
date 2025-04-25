import React from "react";
import StarRating from "./starRating";
import "../styles/productRating.css";

export default function ProductRating({
  rating = 0,
  reviews = 0,
  purchaseCount = 0,
}) {
  return (
    <div className="productCard__rating">
      <StarRating totalStars={5} rating={rating || 0} readOnly={true} />
      <span className="productCard__product-rating">
        {rating > 0 ? `${rating} Rating` : "0.0"}
      </span>
      <div className="productCard__details">
        <span className="productCard__review">
          {reviews > 0 ? `${reviews} Reviews` : "0 Review"}
        </span>
      </div>

      <span className="productCard__product-sold">
        {purchaseCount > 0 ? `${purchaseCount}  sold` : "0 sold"}
      </span>
    </div>
  );
}

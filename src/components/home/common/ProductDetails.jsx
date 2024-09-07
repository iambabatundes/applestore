import React from "react";
import StarRating from "./starRating";
import "../styles/productCard.css";

export default function ProductDetails({ item, handleRatingChange }) {
  return (
    <div className="productCard__details">
      <div className="productCard__rating">
        {item.rating && (
          <StarRating
            rating={item.rating}
            totalStars={5}
            size={15}
            onRatingChange={handleRatingChange}
            readOnly={true}
          />
        )}
        {item.numberOfSales && (
          <span className="productCard__product-sold">
            {item.numberOfSales}
          </span>
        )}
      </div>

      <div className="productCard__price">
        <span className="currency">{item.currency}</span>
        <span className="whole">{item.whole}</span>
        <span className="fraction">.{item.fraction}</span>
      </div>
    </div>
  );
}

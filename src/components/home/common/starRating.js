import React from "react";
import Star from "./star";

const StarRating = ({ totalStars = 5, rating = 0, readOnly = false }) => {
  const fullStars = Math.floor(rating);
  const decimalPart = rating % 1;
  const fillPercentage = Math.round(decimalPart * 100);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {Array.from({ length: totalStars }, (_, index) => {
        const isFull = index < fullStars;
        const isLastStar = index === fullStars;

        return (
          <Star
            key={index}
            filled={isFull}
            fillPercentage={isLastStar ? fillPercentage : isFull ? 100 : 0}
            readOnly={readOnly}
          />
        );
      })}
    </div>
  );
};

export default StarRating;

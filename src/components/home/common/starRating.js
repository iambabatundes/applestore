import React, { useState } from "react";
import Star from "./star";

const StarRating = ({
  totalStars = 5,
  initialRating = 0,
  readOnly = false,
  onRatingChange,
  // totalRatings = 100,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(undefined);

  const handleClick = (value) => {
    if (!readOnly) {
      setRating(value);
      if (onRatingChange) {
        onRatingChange(value);
      }
    }
  };

  const displayRating = hover !== undefined ? hover : rating;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {Array.from({ length: totalStars }, (_, index) => {
        const isHalf = displayRating > index && displayRating < index + 1;
        return (
          <Star
            key={index}
            filled={index < Math.floor(displayRating)}
            halfFilled={isHalf}
            onClick={() => handleClick(index + 1)}
            onMouseEnter={() => !readOnly && setHover(index + 1)}
            onMouseLeave={() => setHover(undefined)}
            ratingValue={`${displayRating.toFixed(1)}`}
          />
        );
      })}
    </div>
  );
};

export default StarRating;

import React from "react";
import "../styles/bigSave.css";

const Star = ({
  filled,
  halfFilled,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ratingValue,
}) => {
  return (
    <div className="star-container">
      <svg
        className="bigSave__star-main"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="bigSave__star"
          d="M12 .587l3.668 7.431 8.167 1.18-5.92 5.76 1.397 8.139L12 18.897l-7.312 3.845 1.396-8.139L.165 9.198l8.167-1.18z"
          fill={filled ? "#191919" : halfFilled ? "url(#half)" : "#e8e8e8"}
        />
        {halfFilled && (
          <defs>
            <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
              <stop offset="50%" stopColor="#191919" />
              <stop offset="50%" stopColor="#e8e8e8" />
            </linearGradient>
          </defs>
        )}
      </svg>
      <div className="tooltip">{ratingValue}</div>
    </div>
  );
};

export default Star;

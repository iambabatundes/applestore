import React from "react";
import "../styles/reviewFilters.css";

export default function ReviewFilters({
  reviews,
  ratingFilter,
  setRatingFilter,
  showOnlyPhotos,
  setShowOnlyPhotos,
}) {
  const getCount = (star) => {
    if (star === 0) return reviews.length;
    return reviews.filter((r) => Math.floor(r.rating) === star).length;
  };

  const photoCount = reviews.filter((r) => r.hasMedia).length;

  const starOptions = [
    { label: "All", value: 0 },
    { label: "5★", value: 5 },
    { label: "4★", value: 4 },
    { label: "3★", value: 3 },
    { label: "2★", value: 2 },
    { label: "1★", value: 1 },
  ];

  return (
    <div className="reviewFilters">
      <div className="reviewFilters__tabs">
        {starOptions.map(({ label, value }) => (
          <button
            title={`Includes ${value}.0 – ${value}.9`}
            key={value}
            onClick={() => setRatingFilter(value)}
            className={`tab-button ${ratingFilter === value ? "active" : ""}`}
          >
            {label} ({getCount(value)})
          </button>
        ))}

        <button
          onClick={() => setShowOnlyPhotos(!showOnlyPhotos)}
          className={`tab-button media-button ${
            showOnlyPhotos ? "active" : ""
          }`}
        >
          📷 ({photoCount})
        </button>
      </div>
    </div>
  );
}

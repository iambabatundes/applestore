import React, { useState } from "react";
import { createReview } from "../../../services/reviewService";
import StarRating from "../../common/starRating";

export default function ReviewForm({ productId }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [media, setMedia] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("review", review);
    media.forEach((file) => formData.append("reviewMedia", file));

    await createReview(productId, formData);
    setReview("");
    setRating(0);
    setMedia([]);
    // Refresh review list logic here if needed
  };

  return (
    <form className="reviewForm" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>
      <StarRating rating={rating} onRatingChange={setRating} />
      <textarea
        placeholder="Write your experience..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => setMedia([...e.target.files])}
      />
      <button type="submit">Submit Review</button>
    </form>
  );
}

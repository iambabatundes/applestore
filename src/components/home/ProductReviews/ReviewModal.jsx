import React, { useEffect, useRef, useCallback, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import StarRating from "../common/starRating";
import ReviewItem from "./ReviewItem";
import ReviewFilters from "./common/ReviewFilters";
import "./styles/reviewModal.css";
import useReviewFilters from "./hooks/useReviewFilters";
import useModalScrollHandler from "./hooks/useModalScrollHandler";
import useDragToClose from "./hooks/useDragToClose";
import ReviewModalHeader from "./common/ReviewModalHeader";

export default function ReviewModal({
  onClose,
  reviews,
  totalReviews,
  rating,
  loadMore,
  hasMore,
  loading,
  currentUserId,
  hasPurchased,
}) {
  const [showOnlyPhotos, setShowOnlyPhotos] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const modalRef = useRef();
  const scrollRef = useRef();
  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useDragToClose(y, api, onClose);
  const handleScroll = useModalScrollHandler(scrollRef, {
    hasMore,
    loading,
    loadMore,
  });

  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const filtered = useReviewFilters(reviews, {
    ratingFilter,
    showOnlyPhotos,
    searchQuery,
  });

  return (
    <div className="reviewModal__overlay" onClick={onClose}>
      <animated.div
        {...bind()}
        className="reviewModal__content"
        role="dialog"
        aria-modal="true"
        aria-label="Product Reviews"
        style={{ y }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <div
          className="reviewModal__dragHandle"
          onClick={(e) => e.stopPropagation()}
        />

        <ReviewModalHeader
          rating={rating}
          totalReviews={totalReviews}
          hasPurchased={hasPurchased}
          onClose={onClose}
        />

        <ReviewFilters
          showOnlyPhotos={showOnlyPhotos}
          setShowOnlyPhotos={setShowOnlyPhotos}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          reviews={reviews}
        />

        <div
          className="reviewModal__scrollArea"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {filtered.length === 0 && !loading && <p>No matching reviews.</p>}
          {filtered.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              currentUserId={currentUserId}
            />
          ))}
          {loading && <p className="reviewModal__loading">Loading more...</p>}
          {!hasMore && <p className="reviewModal__end">No more reviews.</p>}
        </div>
      </animated.div>
    </div>
  );
}

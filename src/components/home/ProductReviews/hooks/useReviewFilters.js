import { useMemo } from "react";

export default function useReviewFilters(
  reviews,
  { ratingFilter, showOnlyPhotos, searchQuery }
) {
  return useMemo(() => {
    return reviews.filter((review) => {
      const matchRating =
        ratingFilter === 0 || Math.floor(review.rating) === ratingFilter;
      const matchPhotos = !showOnlyPhotos || review.hasMedia === true;
      const matchText =
        searchQuery.trim() === "" ||
        review.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRating && matchPhotos && matchText;
    });
  }, [reviews, ratingFilter, showOnlyPhotos, searchQuery]);
}

import { useState, useEffect } from "react";

export default function useCarousel(
  totalItems,
  visibleCards,
  autoScroll,
  scrollInterval
) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNextCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex + 1) % (totalItems - visibleCards + 1)
    );
  };

  const handlePrevCard = () => {
    setCurrentCardIndex(
      (prevIndex) =>
        (prevIndex + totalItems - 1) % (totalItems - visibleCards + 1)
    );
  };

  useEffect(() => {
    if (autoScroll) {
      const interval = setInterval(() => {
        handleNextCard();
      }, scrollInterval);
      return () => clearInterval(interval);
    }
  }, [currentCardIndex, autoScroll, scrollInterval]);

  return { currentCardIndex, handleNextCard, handlePrevCard };
}

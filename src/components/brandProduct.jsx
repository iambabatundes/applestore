import React, { useState, useEffect } from "react";
import Card from "./brandCard";
import cards from "./brandData";
import "../components/styles/brandProduct.css";

export default function BrandProduct() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(5);

  const handleNextCard = () => {
    const nextIndex = (currentCardIndex + 1) % cards.length;
    setCurrentCardIndex(nextIndex);
  };

  const handlePrevCard = () => {
    const prevIndex = (currentCardIndex + cards.length - 1) % cards.length;
    setCurrentCardIndex(prevIndex);
  };

  const updateCardsPerPage = () => {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 768) {
      setCardsPerPage(1);
    } else if (viewportWidth < 1024) {
      setCardsPerPage(3);
    } else {
      setCardsPerPage(5);
    }
  };

  useEffect(() => {
    // Update the number of cards per page on window resize
    window.addEventListener("resize", updateCardsPerPage);
    // Initial update on component mount
    updateCardsPerPage();
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateCardsPerPage);
    };
  }, []);

  const cardsToDisplay = [];

  for (let i = 0; i < cardsPerPage; i++) {
    const cardIndex = (currentCardIndex + i) % cards.length;
    cardsToDisplay.push(cards[cardIndex]);
  }

  return (
    <section className="slides">
      <h1 className="slides__title">Popular professional services</h1>

      <button
        className="slides-button slider-button-prev"
        onClick={handlePrevCard}
      >
        <span className="slider-button-icon">
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </span>
      </button>

      <div className="slides__card">
        {cardsToDisplay.map((card) => (
          <Card item={card} key={card._id} className={card.className} />
        ))}
      </div>

      <button
        className="slides-button slider-button-next"
        onClick={handleNextCard}
      >
        <span className="slider-button-icon">
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </span>
      </button>
    </section>
  );
}

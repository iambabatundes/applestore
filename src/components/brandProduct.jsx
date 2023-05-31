import React, { useState } from "react";
import Card from "./brandCard";
import cards from "./brandData";
import "../components/styles/brandProduct.css";

export default function BrandProduct() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNextCard = () => {
    const nextIndex = (currentCardIndex + 5) % (cards.length - 5);
    setCurrentCardIndex(nextIndex);
  };

  const handlePrevCard = () => {
    const prevIndex =
      (currentCardIndex + cards.length - 1) % (cards.length - 5);
    setCurrentCardIndex(prevIndex);
  };

  const cardsToDisplay = cards.slice(currentCardIndex, currentCardIndex + 5);

  return (
    <section className="slides">
      <h1 className="slides__title">Popular professional service</h1>

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
          <Card item={card} key={card._id} />
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

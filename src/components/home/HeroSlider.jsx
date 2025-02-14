import React, { useState, useEffect } from "react";
import "./styles/heroSlider.css";
import HeroCard from "./heroCard";
import cards from "./heroDatas";
import { getRandomColor, getContrastYIQ } from "./utils/colorUtils";

export default function HeroSlider({ selectedCurrency, conversionRate }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleNextCard = () => {
    const nextIndex = (currentCardIndex + 1) % (cards.length - 3);
    setCurrentCardIndex(nextIndex);
  };

  const handlePrevCard = () => {
    const prevIndex =
      (currentCardIndex + cards.length - 1) % (cards.length - 3);
    setCurrentCardIndex(prevIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextCard();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentCardIndex]);

  const cardsToDisplay = cards.slice(currentCardIndex, currentCardIndex + 3);

  return (
    <section className="hero-slider">
      <div className="promo-text">
        <p>Starts: Aug 19, 03:00 EST</p>
        <h1>BACK TO SCHOOL</h1>
        <section className="promoText__menu">
          <article className="promoText">
            <h5 className="promoText__up">UP</h5>
            <h5 className="promoText__up">TO</h5>
          </article>
          <h2>50%</h2>
          <span className="">OFF</span>
        </section>
      </div>

      <div className="promo-cards-wrapper">
        <button
          className="heroSlides-button heroSlides-button-prev"
          onClick={handlePrevCard}
        >
          <span className="heroSlides-button-icon">
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </span>
        </button>

        <div className="promo-cards">
          {cardsToDisplay.map((card, index) => {
            const backgroundColor = getRandomColor();
            const textColor = getContrastYIQ(backgroundColor);
            return (
              <HeroCard
                card={card}
                index={index}
                key={index}
                backgroundColor={backgroundColor}
                textColor={textColor}
                conversionRate={conversionRate}
                selectedCurrency={selectedCurrency}
              />
            );
          })}
        </div>

        <button
          className="heroSlides-button heroSlides-button-next"
          onClick={handleNextCard}
        >
          <span className="heroSlides-button-icon">
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </section>
  );
}

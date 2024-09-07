import React, { useState, useEffect } from "react";
import "./styles/bigSave.css";
import { getProducts } from "./common/productDatas";
import ProductCard from "./common/productCard";
import ArrowButton from "./common/arrowButton";
import useCarousel from "./hooks/useCarousel";

export default function BigSave({
  addToCart,
  cartItems,
  visibleCards = 4,
  autoScroll = true,
  scrollInterval = 3000,
  selectedCurrency,
  conversionRate,
}) {
  const [products, setProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const { currentCardIndex, handleNextCard, handlePrevCard } = useCarousel(
    products.length,
    visibleCards,
    autoScroll && !isHovered,
    scrollInterval
  );

  useEffect(() => {
    const fetchedProducts = getProducts();
    setProducts(fetchedProducts);
  }, []);

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  const cardsToDisplay = products.slice(
    currentCardIndex,
    currentCardIndex + visibleCards
  );

  return (
    <section className="big-save">
      <div className="big-save-header">
        <div className="big-save-banner"></div>
      </div>

      <div
        className="bigSave__cards-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ArrowButton
          direction="left"
          onClick={handlePrevCard}
          className={isHovered ? "show-arrow" : "hide-arrow"}
        />

        <div className="bigSave__product">
          {cardsToDisplay.map((product) => {
            return (
              <ProductCard
                key={product.id}
                addToCart={addToCart}
                item={product}
                handleRatingChange={handleRatingChange}
                cartItems={cartItems}
                productName={product}
                conversionRate={conversionRate}
                selectedCurrency={selectedCurrency}
              />
            );
          })}
        </div>

        <ArrowButton
          direction="right"
          onClick={handleNextCard}
          className={`${
            isHovered ? "show-arrow" : "hide-arrow"
          } arrowButton__nextBtn`}
        />
      </div>
    </section>
  );
}

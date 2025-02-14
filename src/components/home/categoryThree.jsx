import React, { useState, useEffect } from "react";
import "./styles/categoryThree.css";
import ArrowButton from "./common/arrowButton";
import ProductCard from "./common/productCard";
import { getProductsByCategorys } from "../../services/productService";
import useCarousel from "./hooks/useCarousel";
import imagePhone from "./images/Purple Sale Mockups.jpg";

export default function CategoryThree({
  addToCart,
  cartItems,
  visibleCards = 4,
  autoScroll = true,
  scrollInterval = 3000,
  selectedCurrency,
  conversionRate,
  currencySymbols,
}) {
  const [products, setProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const { currentCardIndex, handleNextCard, handlePrevCard } = useCarousel(
    products.length,
    visibleCards,
    autoScroll && !isHovered,
    scrollInterval
  );

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await getProductsByCategorys("Phone & Communications");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching furniture category products:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  const cardsToDisplay = products.slice(
    currentCardIndex,
    currentCardIndex + visibleCards
  );

  return (
    <section className="cat3__main">
      <div className="cat3__wrapper">
        <div className="cat3__promo-container">
          <img
            src={imagePhone}
            alt="Best Selling Furniture"
            className="cat3__promo-image"
          />
        </div>
        <div
          className="cat3__cards-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ArrowButton
            direction="left"
            onClick={handlePrevCard}
            className={isHovered ? "show-arrow" : "hide-arrow"}
          />

          <div className="cat3__product-list">
            {cardsToDisplay.map((product) => (
              <ProductCard
                key={product._id}
                addToCart={addToCart}
                item={product}
                handleRatingChange={handleRatingChange}
                cartItems={cartItems}
                productName={product}
                conversionRate={conversionRate}
                selectedCurrency={selectedCurrency}
                currencySymbols={currencySymbols}
              />
            ))}
          </div>

          <ArrowButton
            direction="right"
            onClick={handleNextCard}
            className={`${
              isHovered ? "show-arrow" : "hide-arrow"
            } arrowButton__nextBtn`}
          />
        </div>
      </div>
    </section>
  );
}

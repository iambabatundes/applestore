import React, { useState, useEffect } from "react";
import "./styles/categoryTwo.css";
import ProductCard from "./common/productCard";
import useCarousel from "./hooks/useCarousel";
import imageFu from "./images/Best Selling Furniture.jpg";
import useProductStore from "./hooks/useCategoryProducts";
import CarouselControls from "./common/CarouselControls";

export default function CategoryTwo({
  addToCart,
  cartItems,
  visibleCards = 4,
  autoScroll = true,
  scrollInterval = 3000,
  selectedCurrency,
  conversionRate,
  currencySymbols,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryName = "Furniture";
  const { fetchCategoryProducts, productsByCategory, loading, errors } =
    useProductStore();

  useEffect(() => {
    fetchCategoryProducts(categoryName);
  }, [categoryName, fetchCategoryProducts]);

  const productsData = productsByCategory[categoryName];
  const products = productsData?.data || [];

  const { currentCardIndex, handleNextCard, handlePrevCard } = useCarousel(
    products.length,
    visibleCards,
    autoScroll && !isHovered,
    scrollInterval
  );

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  const cardsToDisplay = products.slice(
    currentCardIndex,
    currentCardIndex + visibleCards
  );

  return (
    <section className="cat2__main">
      <div className="cat2__wrapper">
        <div className="cat2__promo-container">
          <img
            src={imageFu}
            alt="Best Selling Furniture"
            className="cat2__promo-image"
          />
        </div>
        <div
          className="cat2__cards-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CarouselControls
            isHovered={isHovered}
            onNext={handleNextCard}
            onPrev={handlePrevCard}
          />

          <div className="cat2__product-list">
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
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from "react";
import ProductCard from "./common/productCard";
import "../styles/choice.css";
import CarouselControls from "./common/CarouselControls";
import useCarousel from "./hooks/useCarousel";
import useProductStore from "./hooks/useCategoryProducts";

export default function Choice({
  visibleCards = 5,
  autoScroll = true,
  scrollInterval = 3000,
  addToCart,
  cartItems,
  conversionRate,
  selectedCurrency,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryName = "Category";
  const { fetchCategoryProducts, productsByCategory, loading, errors } =
    useProductStore();

  useEffect(() => {
    fetchCategoryProducts(categoryName);
  }, [categoryName, fetchCategoryProducts]);

  const productsData = productsByCategory[categoryName];
  const products = productsData?.data || [];
  // const products = productsData?.data?.results || [];

  const { currentCardIndex, handleNextCard, handlePrevCard } = useCarousel(
    products.length,
    visibleCards,
    autoScroll && !isHovered,
    scrollInterval
  );

  const cardsToDisplay = products.slice(
    currentCardIndex,
    currentCardIndex + visibleCards
  );

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  return (
    <section className="choice__cards">
      <div className="choice__cards-wrapper">
        <div
          className="choice__cards-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CarouselControls
            isHovered={isHovered}
            onNext={handleNextCard}
            onPrev={handlePrevCard}
          />

          <div className="choice__product">
            {cardsToDisplay.map((product, index) => {
              return (
                <ProductCard
                  key={product._id}
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
        </div>
      </div>
    </section>
  );
}

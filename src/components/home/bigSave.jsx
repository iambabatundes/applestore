import { useState, useEffect } from "react";
import "./styles/bigSave.css";
import ProductCard from "./common/productCard";
import useCarousel from "./hooks/useCarousel";
import CarouselControls from "./common/CarouselControls";
import useProductStore from "./hooks/useCategoryProducts";
import imagePhone from "./images/Purple Sale Mockups.jpg";

export default function BigSave({
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

  const categoryName = "Women's Clothing";
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

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  const cardsToDisplay = products.slice(
    currentCardIndex,
    currentCardIndex + visibleCards
  );

  return (
    <section className="big-save">
      <div className="bigSave__wrapper">
        <div className="bigSave__promo-container">
          <img
            src={imagePhone}
            alt="Best Selling Furniture"
            className="big-save-banner"
          />
        </div>

        <div
          className="bigSave__cards-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CarouselControls
            onNext={handleNextCard}
            onPrev={handlePrevCard}
            isHovered={isHovered}
          />

          <div className="bigSave__product">
            {cardsToDisplay.map((product) => {
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
                  currencySymbols={currencySymbols}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

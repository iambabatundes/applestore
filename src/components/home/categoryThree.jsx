import { useState, useEffect } from "react";
import "./styles/categoryThree.css";
import ProductCard from "./common/productCard";
import useCarousel from "./hooks/useCarousel";
import imagePhone from "./images/Purple Sale Mockups.jpg";
import CarouselControls from "./common/CarouselControls";
import useProductStore from "./hooks/useCategoryProducts";

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
  const [isHovered, setIsHovered] = useState(false);

  const categoryName = "Phone & Communications";
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
          <CarouselControls
            isHovered={isHovered}
            onNext={handleNextCard}
            onPrev={handlePrevCard}
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
                // currencySymbols={currencySymbols}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

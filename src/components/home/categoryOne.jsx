import React, { useState, useEffect } from "react";
import "./styles/categoryOne.css";
import ArrowButton from "./common/arrowButton";
import ProductCard from "./common/productCard";
import { getProductsByCategorys } from "../../services/productService";
import useCarousel from "./hooks/useCarousel";
// import s1 from "./images/s1.png";
import s2 from "./images/s2.png";
import s55 from "./images/s55.png";
import s211 from "./images/s211.png";
import s244 from "./images/s3442.png";

export default function CategoryOne({
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const { currentCardIndex, handleNextCard, handlePrevCard } = useCarousel(
    products.length,
    visibleCards,
    autoScroll && !isHovered,
    scrollInterval
  );

  useEffect(() => {
    async function fetctProducts() {
      try {
        const { data } = await getProductsByCategorys("Shoes");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching category products:", error);
      }
    }

    fetctProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  const cardsToDisplay = products.slice(
    currentCardIndex,
    currentCardIndex + visibleCards
  );

  const images = [s2, s55, s211, s244];

  return (
    <section className="categoryOne__main">
      <div className="cat__promo-container">
        <div className="cat__promo-card">
          <div className="cat__promo-content">
            <h3 className="cat__promo-title">NEW COLLECTION</h3>
            <h1 className="cat__promo-heading">SUPER SPEED</h1>

            <div className="cat__slider-container">
              <div
                className="cat__slider"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {images.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Slide ${index}`}
                    className="cat__slideImage"
                  />
                ))}
              </div>
            </div>
            <div className="cat__price-tag">
              <p>ONLY</p> $50
            </div>
            <button className="cat__order-now">ORDER NOW</button>
          </div>
        </div>
      </div>

      <div
        className="categoryOne__cards-wrapper"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ArrowButton
          direction="left"
          onClick={handlePrevCard}
          className={isHovered ? "show-arrow" : "hide-arrow"}
        />

        <div className="categoryOne__product">
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

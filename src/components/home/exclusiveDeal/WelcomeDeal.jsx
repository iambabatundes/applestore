import React, { useState, useEffect } from "react";
import "../styles/exclusiveDeal.css";
import productImage from "../images/produ1.avif";
import productImage1 from "../images/produ2.avif";
import { formatPrice } from "../common/utils";

export default function WelcomeDeal({
  selectedCurrency = "NGN",
  conversionRate = 1,
}) {
  const products = [
    {
      image: productImage,
      price: 23000.0,
      oldPrice: 80000.0,
    },
    {
      image: productImage1,
      price: 25000.0,
      oldPrice: 90000.0,
    },
    {
      image: productImage1,
      price: 30000.0,
      oldPrice: 100000.0,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [currentIndex]);

  const handlePrev = () => {
    const newIndex =
      currentIndex === 0 ? products.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      currentIndex === products.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="welcomeDeal">
      <header className="welcomeDeal__header-container">
        <h1 className="welcomeDeal__header">Welcome Deal</h1>
        <h4 className="welcomeDeal__subHeader">Your Exclusive Price</h4>
      </header>

      <div className="welcomeDeal__carousel">
        {products.map((product, index) => {
          const {
            currency: saleCurrency,
            whole: saleWhole,
            fraction: saleFraction,
          } = formatPrice(product.price, selectedCurrency, conversionRate);
          const {
            currency: originalCurrency,
            whole: originalWhole,
            fraction: originalFraction,
          } = product.oldPrice
            ? formatPrice(product.oldPrice, selectedCurrency, conversionRate)
            : {};

          return (
            <div
              key={index}
              className={`welcomeDeal__slide ${
                index === currentIndex ? "active" : ""
              }`}
            >
              <img
                src={product.image}
                alt={`Product ${index + 1}`}
                className="welcomeDeal__productImage"
              />
              <div className="welcomeDeal__price-main">
                <h1 className="welcomeDeal__price">
                  <span className="currency">{saleCurrency}</span>
                  <span className="whole">{saleWhole}</span>
                  <span className="fraction">.{saleFraction}</span>
                </h1>
                {product.oldPrice && (
                  <span className="welcomeDeal__oldprice">
                    <span className="currency">{originalCurrency}</span>
                    <span className="whole">{originalWhole}</span>
                    <span className="fraction">.{originalFraction}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="welcomeDeal__control welcomeDeal__control-left"
        onClick={handlePrev}
      >
        &#10094;
      </button>
      <button
        className="welcomeDeal__control welcomeDeal__control-right"
        onClick={handleNext}
      >
        &#10095;
      </button>

      <div className="welcomeDeal__dots">
        {products.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

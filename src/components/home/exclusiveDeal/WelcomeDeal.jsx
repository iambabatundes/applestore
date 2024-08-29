import React, { useState, useEffect } from "react";
import "../styles/exclusiveDeal.css";
import productImage from "../images/produ1.avif";
import productImage1 from "../images/produ2.avif";

export default function WelcomeDeal() {
  const products = [
    {
      image: productImage,
      price: "NGN23,000.00",
      oldPrice: "NGN80,000.00",
    },
    {
      image: productImage1,
      price: "NGN25,000.00",
      oldPrice: "NGN90,000.00",
    },
    {
      image: productImage1,
      price: "NGN30,000.00",
      oldPrice: "NGN100,000.00",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000); // Change slide every 5 seconds

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
        {products.map((product, index) => (
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
              <h1 className="welcomeDeal__price">{product.price}</h1>
              <span className="welcomeDeal__oldprice">{product.oldPrice}</span>
            </div>
          </div>
        ))}
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

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/welcomeDeal.css";
import { formatPrice } from "../common/utils";
import { getProductsByPromotion } from "../../../services/productService";

import config from "../../../config.json";

export default function WelcomeDeal({
  selectedCurrency = "NGN",
  conversionRate = 1,
  user,
}) {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await getProductsByPromotion("WelcomeDeal");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="welcomeDeal">
      {!user && (
        <section className="welcomeDeal__action">
          <button className="welcomeDeal__btn welcomeDeal__register">
            <Link to="/register">Register</Link>
          </button>

          <button className="welcomeDeal__btn welcomeDeal__signIn">
            <Link to="/login">Sign in</Link>
          </button>
        </section>
      )}

      <header className="welcomeDeal__header-container">
        <h1 className="welcomeDeal__header">Welcome Deals</h1>
        <h4 className="welcomeDeal__subHeader">Your Exclusive Price</h4>
      </header>

      <div className="welcomeDeal__carousel">
        {products.length > 0 ? (
          products.map((product, index) => {
            const { currency, whole, fraction } = formatPrice(
              product.price,
              selectedCurrency,
              conversionRate
            );

            return (
              <div
                key={product._id}
                className={`welcomeDeal__slide ${
                  index === currentIndex ? "active" : ""
                }`}
              >
                <img
                  src={
                    product.featureImage && product.featureImage.filename
                      ? `${config.mediaUrl}/uploads/${product.featureImage.filename}`
                      : "/default-image.jpg"
                  }
                  alt={`Product ${index + 1}`}
                  className="welcomeDeal__productImage"
                />
                <div className="welcomeDeal__price-main">
                  <h1 className="welcomeDeal__price">
                    <span className="currency">{currency}</span>
                    <span className="whole">{whole}</span>
                    <span className="fraction">.{fraction}</span>
                  </h1>
                  {product.salePrice && (
                    <span className="welcomeDeal__oldprice">
                      <span className="currency">{currency}</span>
                      <span className="whole">
                        {
                          formatPrice(
                            product.salePrice,
                            selectedCurrency,
                            conversionRate
                          ).whole
                        }
                      </span>
                      <span className="fraction">
                        .
                        {
                          formatPrice(
                            product.salePrice,
                            selectedCurrency,
                            conversionRate
                          ).fraction
                        }
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>No products available for First Comers.</p>
        )}
      </div>

      {products.length > 1 && (
        <div className="welcomeDeal__dots">
          {products.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

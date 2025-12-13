// EmptyCart.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../../components/home/common/productCard";
import { useProductStore } from "../../components/home/hooks/useProductStore";
import "./styles/emptyCart.css";
import ProductSkeletonCard from "../../components/home/moreToLove/ProductSkeletonCard";

export default function EmptyCart({
  companyName,
  conversionRate,
  selectedCurrency,
  addToCart,
  cartItems,
}) {
  const { products, loading, error, fetchProducts } = useProductStore();
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }

    console.log(`User viewed empty cart (logged in) - ${companyName}`);
  }, [companyName]);

  useEffect(() => {
    if (products.length > 0 && !loading) {
      // Filter available products
      const availableProducts = products.filter(
        (product) => product.numberInStock > 0 || product.inStock
      );

      // Shuffle and get top 4
      const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
      setRecommendedProducts(shuffled.slice(0, 4));
    }
  }, [products, loading]);

  const handleShopNow = () => {
    navigate("/");
  };

  const handleRatingChange = (newRating) => {
    console.log(`New rating: ${newRating}`);
  };

  return (
    <div className="cart-empty-container">
      <div className="cart-empty-content">
        {/* Icon */}
        <svg
          className="cart-empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>

        {/* Title & Subtitle */}
        <h1 className="cart-empty-title">Your {companyName} cart is empty</h1>
        <p className="cart-empty-subtitle">
          Add items to your cart and they will appear here. Ready to get
          started?
        </p>

        {/* Primary Action */}
        <button onClick={handleShopNow} className="cart-empty-shop-button">
          Start Shopping at {companyName}
        </button>

        {/* Recommendations Section */}
        <div className="cart-empty-recommendations">
          <h2 className="cart-empty-recommendations-title">
            Popular {companyName} products you might like
          </h2>

          {loading ? (
            <div className="cart-empty-products-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="cart-empty-skeleton-wrapper">
                  <ProductSkeletonCard />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="cart-empty-error">
              <p>Could not load recommendations</p>
              <button onClick={fetchProducts} className="cart-empty-retry-btn">
                Try Again
              </button>
            </div>
          ) : recommendedProducts.length > 0 ? (
            <div className="cart-empty-products-grid product-card-style">
              {recommendedProducts.map((product) => (
                <div key={product._id} className="cart-empty-product-wrapper">
                  <ProductCard
                    item={product}
                    addToCart={addToCart}
                    handleRatingChange={handleRatingChange}
                    cartItems={cartItems}
                    conversionRate={conversionRate}
                    selectedCurrency={selectedCurrency}
                    productName={product}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="cart-empty-no-products">
              <p>No products available at the moment</p>
              <button
                onClick={handleShopNow}
                className="cart-empty-shop-now-btn"
              >
                Browse All Products
              </button>
            </div>
          )}

          {/* View All Link */}
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link
              to="/products"
              style={{
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: "500",
                fontSize: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              View all {companyName} products
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

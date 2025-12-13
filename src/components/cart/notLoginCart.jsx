// NotLoginCart.jsx - Updated
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/notLoginCart.css";

export default function NotLoginCart({ companyName }) {
  const navigate = useNavigate();

  // Track cart empty view for analytics
  useEffect(() => {
    // You can implement analytics tracking here
    console.log("User viewed empty cart (not logged in)");
  }, []);

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="cart-not-login-container">
      <div className="cart-not-login-content">
        {/* Icon */}
        <svg
          className="cart-not-login-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>

        {/* Title & Subtitle */}
        <h1 className="cart-not-login-title">
          Your {companyName} Cart is empty
        </h1>
        <p className="cart-not-login-subtitle">
          Sign in to see your items or continue shopping to add products to your
          cart
        </p>

        {/* Action Buttons */}
        <div className="cart-not-login-buttons">
          <Link
            to="/login"
            className="cart-not-login-button cart-not-login-button-primary"
          >
            Sign in to your account
          </Link>
          <button
            onClick={handleContinueShopping}
            className="cart-not-login-button cart-not-login-button-secondary"
          >
            Continue shopping
          </button>
        </div>

        {/* Create Account Option */}
        <div style={{ marginTop: "24px" }}>
          <p
            style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px" }}
          >
            New to {companyName}?
          </p>
          <Link
            to="/register"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Create your {companyName} account
          </Link>
        </div>

        {/* Features/Benefits */}
        <div className="cart-not-login-features">
          <div className="cart-not-login-feature">
            <svg
              className="cart-not-login-feature-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="cart-not-login-feature-title">Free Delivery</h3>
            <p className="cart-not-login-feature-description">
              Free delivery on orders over $50
            </p>
          </div>

          <div className="cart-not-login-feature">
            <svg
              className="cart-not-login-feature-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="cart-not-login-feature-title">Secure Checkout</h3>
            <p className="cart-not-login-feature-description">
              Your payment information is protected
            </p>
          </div>

          <div className="cart-not-login-feature">
            <svg
              className="cart-not-login-feature-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="cart-not-login-feature-title">Easy Returns</h3>
            <p className="cart-not-login-feature-description">
              30-day return policy on most items
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

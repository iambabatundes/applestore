import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import PriceDisplay from "../utils/priceDisplay";
import "./styles/cartSummary.css";

export default function CartSummary({
  totalItem,
  price,
  selectedCurrency,
  isCartValid = true,
}) {
  const navigate = useNavigate();

  const { cartItems, validateCartForCheckout } = useCartStore();

  const handleCheckout = () => {
    if (!isCartValid) {
      alert("Please fix cart issues before proceeding to checkout");
      return;
    }

    const validation = validateCartForCheckout();
    if (!validation.isValid) {
      alert(validation.warnings);
      return;
    }

    navigate("/checkout");
  };

  return (
    <aside
      className="cart-summary-container"
      role="complementary"
      aria-label="Order summary"
    >
      {/* Free Shipping Banner */}
      {!pricingBreakdown.hasFreeShipping &&
        pricingBreakdown.amountToFreeShipping > 0 && (
          <div className="cart-summary-banner">
            <svg
              className="cart-summary-banner-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 18.5a1.5 1.5 0 0 1-1 1.5 1.5 1.5 0 1 1-1-1.5m1.5-9l1.96 2.5L17 13.5V12m-11 6.5A1.5 1.5 0 0 1 4.5 20 1.5 1.5 0 0 1 3 18.5 1.5 1.5 0 0 1 4.5 17c.39 0 .74.15 1 .39V13H2v-2h4V9.5h2.1l2 2H15V13H8.5v2.5h2.02c.26-.24.61-.39 1-.39a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5c-.39 0-.74-.15-1-.39h-4c-.26.24-.61.39-1 .39z" />
            </svg>
            <div className="cart-summary-banner-text">
              Add{" "}
              <strong>
                {selectedCurrency}
                {pricingBreakdown.amountToFreeShipping}
              </strong>{" "}
              more to qualify for <strong>FREE Shipping</strong>
            </div>
          </div>
        )}

      {pricingBreakdown.hasFreeShipping && (
        <div className="cart-summary-banner success">
          <svg
            className="cart-summary-banner-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <div className="cart-summary-banner-text">
            <strong>Congratulations!</strong> You've qualified for FREE Shipping
          </div>
        </div>
      )}

      {/* Main Summary Card */}
      <div className="cart-summary-card">
        {/* Subtotal */}
        <div className="cart-summary-section">
          <div className="cart-summary-row main">
            <span className="cart-summary-label">
              Subtotal ({totalItem} {totalItem === 1 ? "item" : "items"}):
            </span>
            <span className="cart-summary-value">
              <PriceDisplay
                price={pricingBreakdown.subtotal}
                currency={selectedCurrency}
                conversionRate={1}
              />
            </span>
          </div>

          <div className="cart-checkout-button">
            <button
              className={`cart-summary-checkout-btn ${
                !isCartValid ? "disabled" : ""
              }`}
              onClick={handleCheckout}
              disabled={!isCartValid}
            >
              {isCartValid ? (
                <>
                  <svg
                    className="cart-summary-checkout-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Proceed to Checkout
                </>
              ) : (
                <>
                  <svg
                    className="cart-summary-checkout-icon"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  Fix Cart Issues
                </>
              )}
            </button>

            {/* Continue Shopping Link */}
            <Link to="/" className="cart-summary-continue-link">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="cart-summary-trust">
          <div className="cart-summary-trust-item">
            <svg
              className="cart-summary-trust-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            <span>Secure Checkout</span>
          </div>
          <div className="cart-summary-trust-item">
            <svg
              className="cart-summary-trust-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 7h-8v6h8V7zm-2 4h-4V9h4v2zm4-9h-2v2h2V2zm0 18h-2v2h2v-2zM2 22h2v-2H2v2zm0-18h2V2H2v2zm2 14v-2H2c0 1.1.9 2 2 2zm-2-4h2v-2H2v2zm4-10H4v2h2V4zm12 16h-2v2h2v-2zm-8 0H8v2h2v-2zm6 0h-2v2h2v-2zm0-18V4h-2v2h2zM8 4H6v2h2V4z" />
            </svg>
            <span>Easy Returns</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="cart-summary-payment-methods">
          <span className="cart-summary-payment-label">We accept:</span>
          <div className="cart-summary-payment-icons">
            <div className="cart-summary-payment-icon">💳</div>
            <div className="cart-summary-payment-icon">🏦</div>
            <div className="cart-summary-payment-icon">📱</div>
            <div className="cart-summary-payment-icon">💰</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

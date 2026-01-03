// cart/cartSummary.jsx - Simplified (no coupon, tax, shipping)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PriceDisplay from "../utils/priceDisplay";
import "./styles/cartSummary.css";
import { useCartStore } from "../store/cartStore";

export default function CartSummary({
  totals,
  selectedCurrency,
  isCartValid = true,
  conversionRate = 1,
}) {
  const navigate = useNavigate();
  const { validateCartForCheckout } = useCartStore();

  const { itemCount, subtotal, totalSavings } = totals;

  const handleCheckout = async () => {
    if (!isCartValid) {
      alert("Please fix cart issues before proceeding to checkout");
      return;
    }

    try {
      const validation = await validateCartForCheckout();
      if (!validation.isValid) {
        alert(validation.errors[0] || "Cart validation failed");
        return;
      }

      // Navigate to checkout - where shipping, tax, and payment will be handled
      navigate("/checkout");
    } catch (error) {
      alert("Unable to proceed to checkout: " + error.message);
    }
  };

  return (
    <aside
      className="cart-summary-container"
      role="complementary"
      aria-label="Order summary"
    >
      {/* Main Summary Card */}
      <div className="cart-summary-card">
        <div className="cart-summary-section">
          {/* Subtotal */}
          <div className="cart-summary-row main">
            <span className="cart-summary-label">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):
            </span>
            <span className="cart-summary-value total">
              <PriceDisplay
                price={subtotal}
                currency={selectedCurrency}
                conversionRate={conversionRate}
              />
            </span>
          </div>

          {/* Total Savings */}
          {totalSavings > 0 && (
            <div className="cart-summary-row savings">
              <span className="cart-summary-label">You're saving:</span>
              <span className="cart-summary-value positive">
                <PriceDisplay
                  price={totalSavings}
                  currency={selectedCurrency}
                  conversionRate={conversionRate}
                />
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="cart-summary-divider"></div>

          {/* Info Text */}
          <div className="cart-summary-info-text">
            Shipping, taxes, and discounts calculated at checkout
          </div>

          {/* Checkout Button */}
          <div className="cart-checkout-button">
            <button
              className={`cart-summary-checkout-btn ${
                !isCartValid ? "disabled" : ""
              }`}
              onClick={handleCheckout}
              disabled={!isCartValid || itemCount === 0}
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
          <div className="cart-summary-trust-item">
            <svg
              className="cart-summary-trust-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 18.5a1.5 1.5 0 0 1-1 1.5 1.5 1.5 0 1 1-1-1.5m1.5-9l1.96 2.5L17 13.5V12m-11 6.5A1.5 1.5 0 0 1 4.5 20 1.5 1.5 0 0 1 3 18.5 1.5 1.5 0 0 1 4.5 17c.39 0 .74.15 1 .39V13H2v-2h4V9.5h2.1l2 2H15V13H8.5v2.5h2.02c.26-.24.61-.39 1-.39a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5c-.39 0-.74-.15-1-.39h-4c-.26.24-.61.39-1 .39z" />
            </svg>
            <span>Free Shipping Over $100</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="cart-summary-payment-methods">
          <span className="cart-summary-payment-label">We accept:</span>
          <div className="cart-summary-payment-icons">
            <div className="cart-summary-payment-icon" title="Visa">
              💳
            </div>
            <div className="cart-summary-payment-icon" title="MasterCard">
              🏦
            </div>
            <div className="cart-summary-payment-icon" title="Apple Pay">
              📱
            </div>
            <div className="cart-summary-payment-icon" title="PayPal">
              💰
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

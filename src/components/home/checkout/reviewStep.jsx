import React, { useState } from "react";

export default function ReviewStep({
  selectedAddress,
  selectedPaymentMethod,
  orderPreview,
  appliedCoupon,
  cartItems,
  onAddressChange,
  onPaymentChange,
}) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: orderPreview?.currency || "USD",
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate estimated delivery date (5-7 business days)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDays = 5;
    const maxDays = 7;

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    return {
      min: formatDate(minDate),
      max: formatDate(maxDate),
    };
  };

  const deliveryEstimate = getEstimatedDelivery();

  return (
    <div className="review-step">
      <div className="step-header">
        <h2 className="step-title">
          <span className="step-number">3</span>
          Review Your Order
        </h2>
        <p className="step-description">
          Please review all details carefully before placing your order
        </p>
      </div>

      <div className="review-sections">
        {/* Order Items Review */}
        <div className="review-section">
          <div className="review-section-header">
            <h3>
              <i className="fa fa-shopping-cart"></i> Order Items (
              {cartItems?.length || 0})
            </h3>
          </div>
          <div className="review-items-list">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div key={index} className="review-item">
                  <div className="review-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="review-item-placeholder">
                        <i className="fa fa-box"></i>
                      </div>
                    )}
                  </div>
                  <div className="review-item-details">
                    <h4 className="review-item-name">{item.name}</h4>
                    {item.variant && (
                      <p className="review-item-variant">
                        Variant: {item.variant}
                      </p>
                    )}
                    <p className="review-item-quantity">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="review-item-price">
                    <span className="review-item-unit-price">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="review-item-total">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="review-empty-items">
                <i className="fa fa-shopping-cart"></i>
                <p>No items in cart</p>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address Review */}
        <div className="review-section">
          <div className="review-section-header">
            <h3>
              <i className="fa fa-map-marker-alt"></i> Shipping Address
            </h3>
            <button className="btn-link" onClick={onAddressChange}>
              <i className="fa fa-edit"></i> Change
            </button>
          </div>
          {selectedAddress ? (
            <div className="review-address">
              <div className="review-address-icon">
                <i className="fa fa-home"></i>
              </div>
              <div className="review-address-details">
                <p className="review-name">{selectedAddress.fullName}</p>
                <p className="review-address-line">
                  {selectedAddress.address}
                  {selectedAddress.address2 && `, ${selectedAddress.address2}`}
                </p>
                <p className="review-address-line">
                  {selectedAddress.city}, {selectedAddress.state}{" "}
                  {selectedAddress.zipCode}
                </p>
                <p className="review-address-line">{selectedAddress.country}</p>
                {selectedAddress.phoneNumber && (
                  <p className="review-phone">
                    <i className="fa fa-phone"></i>{" "}
                    {selectedAddress.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="review-missing">
              <i className="fa fa-exclamation-triangle"></i>
              <p>No shipping address selected</p>
            </div>
          )}
        </div>

        {/* Payment Method Review */}
        <div className="review-section">
          <div className="review-section-header">
            <h3>
              <i className="fa fa-credit-card"></i> Payment Method
            </h3>
            <button className="btn-link" onClick={onPaymentChange}>
              <i className="fa fa-edit"></i> Change
            </button>
          </div>
          {selectedPaymentMethod ? (
            <div className="review-payment">
              <div className="review-payment-icon">
                <i
                  className={`fa ${
                    selectedPaymentMethod.type === "card"
                      ? selectedPaymentMethod.card?.brand === "visa"
                        ? "fa-cc-visa"
                        : selectedPaymentMethod.card?.brand === "mastercard"
                        ? "fa-cc-mastercard"
                        : selectedPaymentMethod.card?.brand === "amex"
                        ? "fa-cc-amex"
                        : "fa-credit-card"
                      : "fa-credit-card"
                  }`}
                ></i>
              </div>
              <div className="review-payment-details">
                <p className="review-payment-name">
                  {selectedPaymentMethod.displayName}
                </p>
                {selectedPaymentMethod.type === "card" &&
                  selectedPaymentMethod.card && (
                    <>
                      <p className="review-payment-info">
                        {selectedPaymentMethod.card.brand} ••••{" "}
                        {selectedPaymentMethod.card.last4}
                      </p>
                      <p className="review-payment-expiry">
                        Expires {selectedPaymentMethod.card.expiryMonth}/
                        {selectedPaymentMethod.card.expiryYear}
                      </p>
                    </>
                  )}
              </div>
            </div>
          ) : (
            <div className="review-missing">
              <i className="fa fa-exclamation-triangle"></i>
              <p>No payment method selected</p>
            </div>
          )}
        </div>

        {/* Delivery Estimate */}
        <div className="review-section review-delivery">
          <div className="review-section-header">
            <h3>
              <i className="fa fa-truck"></i> Estimated Delivery
            </h3>
          </div>
          <div className="review-delivery-info">
            <div className="review-delivery-icon">
              <i className="fa fa-shipping-fast"></i>
            </div>
            <div className="review-delivery-details">
              <p className="review-delivery-date">
                <strong>Expected between:</strong>
              </p>
              <p className="review-delivery-range">
                {deliveryEstimate.min} - {deliveryEstimate.max}
              </p>
              <p className="review-delivery-note">
                <i className="fa fa-info-circle"></i> Delivery times are
                estimates and may vary based on your location
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="review-section review-order-summary">
          <div className="review-section-header">
            <h3>
              <i className="fa fa-receipt"></i> Order Summary
            </h3>
          </div>
          {orderPreview ? (
            <div className="review-totals">
              <div className="review-row">
                <span>Subtotal</span>
                <span>{formatCurrency(orderPreview.subtotal)}</span>
              </div>

              {orderPreview.discount > 0 && (
                <div className="review-row discount">
                  <span>
                    <i className="fa fa-tag"></i> Discount
                    {appliedCoupon && (
                      <span className="coupon-badge">{appliedCoupon.code}</span>
                    )}
                  </span>
                  <span className="discount-amount">
                    -{formatCurrency(orderPreview.discount)}
                  </span>
                </div>
              )}

              <div className="review-row">
                <span>Shipping</span>
                <span>
                  {orderPreview.shippingFee === 0 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    formatCurrency(orderPreview.shippingFee)
                  )}
                </span>
              </div>

              <div className="review-row">
                <span>
                  Tax
                  {orderPreview.taxBreakdown &&
                    orderPreview.taxBreakdown.length > 0 && (
                      <button
                        className="tax-info-btn"
                        type="button"
                        title="View tax breakdown"
                      >
                        <i className="fa fa-info-circle"></i>
                      </button>
                    )}
                </span>
                <span>{formatCurrency(orderPreview.tax)}</span>
              </div>

              <div className="review-row total">
                <span>Total</span>
                <span>{formatCurrency(orderPreview.total)}</span>
              </div>

              {orderPreview.taxBreakdown &&
                orderPreview.taxBreakdown.length > 0 && (
                  <details className="tax-breakdown-details">
                    <summary>View Tax Breakdown</summary>
                    <div className="tax-breakdown-content">
                      {orderPreview.taxBreakdown.map((item, idx) => (
                        <div key={idx} className="tax-breakdown-item">
                          <span className="tax-item-name">
                            {item.productName}
                          </span>
                          <span className="tax-item-amount">
                            {formatCurrency(item.totalTax)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
            </div>
          ) : (
            <div className="review-loading">
              <i className="fa fa-spinner fa-spin"></i>
              <p>Calculating totals...</p>
            </div>
          )}
        </div>

        {/* Order Notes (Optional) */}
        <div className="review-section">
          <div className="review-section-header">
            <h3>
              <i className="fa fa-sticky-note"></i> Order Notes (Optional)
            </h3>
          </div>
          <div className="review-notes">
            <textarea
              className="review-notes-input"
              placeholder="Add any special instructions for your order..."
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              maxLength={500}
              rows={4}
            />
            <span className="review-notes-counter">
              {orderNotes.length}/500 characters
            </span>
          </div>
        </div>

        {/* Terms and Marketing */}
        <div className="review-section review-agreements">
          <div className="review-agreement-item required">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <span>
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="agreement-link"
                >
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="agreement-link"
                >
                  Privacy Policy
                </a>
                <span className="required-indicator">*</span>
              </span>
            </label>
          </div>

          <div className="review-agreement-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => setNewsletterOptIn(e.target.checked)}
              />
              <span>
                Send me exclusive offers, personalized recommendations, and
                order updates via email
              </span>
            </label>
          </div>
        </div>

        {/* Security Notice */}
        <div className="review-security-notice">
          <div className="security-icon">
            <i className="fa fa-shield-alt"></i>
          </div>
          <div className="security-content">
            <h4>Your Payment is Secure</h4>
            <p>
              Your payment information is encrypted and processed securely. We
              never store your full credit card details.
            </p>
            <div className="security-badges">
              <span className="security-badge">
                <i className="fa fa-lock"></i> 256-bit SSL
              </span>
              <span className="security-badge">
                <i className="fa fa-check-circle"></i> PCI Compliant
              </span>
              <span className="security-badge">
                <i className="fa fa-shield-alt"></i> Fraud Protected
              </span>
            </div>
          </div>
        </div>

        {/* Order Confirmation Notice */}
        <div className="review-confirmation-notice">
          <i className="fa fa-envelope"></i>
          <p>
            You'll receive an order confirmation email at{" "}
            <strong>{selectedAddress?.email || "your email"}</strong> after
            placing your order.
          </p>
        </div>
      </div>

      {/* Validation Message */}
      {!termsAccepted && (
        <div className="review-validation-message">
          <i className="fa fa-exclamation-circle"></i>
          <span>Please accept the Terms and Conditions to continue</span>
        </div>
      )}
    </div>
  );
}

import React from "react";

export default function OrderSummary({
  orderPreview,
  loading,
  couponCode,
  appliedCoupon,
  couponError,
  couponLoading,
  onCouponChange,
  onApplyCoupon,
  onRemoveCoupon,
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: orderPreview?.currency || "USD",
    }).format(amount || 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onApplyCoupon();
    }
  };

  return (
    <div className="order-summary">
      <h2 className="order-summary-title">Order Summary</h2>

      {loading ? (
        <div className="summary-loading">
          <div className="spinner-small"></div>
          <p>Calculating totals...</p>
        </div>
      ) : (
        <>
          <div className="order-summary-section">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(orderPreview?.subtotal)}</span>
            </div>

            {orderPreview?.discount > 0 && (
              <div className="summary-row discount">
                <span>
                  <i className="fa fa-tag"></i> Discount
                </span>
                <span>-{formatCurrency(orderPreview.discount)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {orderPreview?.shippingFee === 0
                  ? "FREE"
                  : formatCurrency(orderPreview?.shippingFee)}
              </span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>{formatCurrency(orderPreview?.tax)}</span>
            </div>
          </div>

          <div className="order-summary-section">
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(orderPreview?.total)}</span>
            </div>
          </div>

          <div className="order-summary-section">
            <h3 className="coupon-title">Have a coupon?</h3>

            {appliedCoupon ? (
              <div className="applied-coupon">
                <span className="applied-coupon-code">
                  <i className="fa fa-check-circle"></i>
                  {appliedCoupon.code}
                </span>
                <button
                  className="remove-coupon-btn"
                  onClick={onRemoveCoupon}
                  aria-label="Remove coupon"
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>
            ) : (
              <>
                <div className="coupon-form">
                  <input
                    type="text"
                    className={`coupon-input ${couponError ? "error" : ""}`}
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) =>
                      onCouponChange(e.target.value.toUpperCase())
                    }
                    onKeyPress={handleKeyPress}
                    disabled={couponLoading}
                  />
                  <button
                    className="btn btn-outline"
                    onClick={onApplyCoupon}
                    disabled={!couponCode.trim() || couponLoading}
                  >
                    {couponLoading ? (
                      <i className="fa fa-spinner fa-spin"></i>
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>

                {couponError && (
                  <p className="coupon-error">
                    <i className="fa fa-exclamation-circle"></i> {couponError}
                  </p>
                )}
              </>
            )}
          </div>

          {orderPreview?.taxBreakdown &&
            orderPreview.taxBreakdown.length > 0 && (
              <div className="tax-breakdown">
                <details>
                  <summary className="tax-breakdown-toggle">
                    <i className="fa fa-info-circle"></i> Tax Breakdown
                  </summary>
                  <div className="tax-breakdown-content">
                    {orderPreview.taxBreakdown.map((item, idx) => (
                      <div key={idx} className="tax-item">
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
              </div>
            )}
        </>
      )}
    </div>
  );
}

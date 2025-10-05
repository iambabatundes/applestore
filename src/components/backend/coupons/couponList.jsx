import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./styles/couponList.css";

export default function CouponList({
  coupons,
  error,
  onEdit,
  loading,
  onDelete,
}) {
  if (loading) {
    return (
      <span className="shippingRate__loading">Loading coupon list...</span>
    );
  }

  if (error) {
    return <span className="shipping__error">Error loading coupon list</span>;
  }

  if (!coupons || coupons.length === 0) {
    return <p className="couponList__available">No coupon list available</p>;
  }

  return (
    <section className="couponList__container">
      {coupons.length > 0 ? (
        <div className="couponList__cards">
          {coupons.map((coupon) => (
            <div className="couponList__card" key={coupon._id}>
              <div className="couponList__details">
                <span className="couponList__label">Coupon Code:</span>
                {"  "}
                <span className="couponList__value">{coupon.code}</span>
              </div>
              <div className="couponList__details">
                <span className="couponList__label">Type:</span>
                {"  "}
                <span className="couponList__value">{coupon.discountType}</span>
              </div>

              <div>
                {coupon.discountType === "Percentage" && (
                  <div className="couponList__details">
                    <span className="couponList__label">
                      Discount Percentage:
                    </span>
                    {"  "}
                    <span className="couponList__value">
                      {coupon.discountPercentage}%
                    </span>
                  </div>
                )}
                {coupon.discountType === "Fixed" && (
                  <div className="couponList__details">
                    <span className="couponList__label">Discount Value:</span>
                    {"  "}
                    <span className="couponList__value">
                      {coupon.discountValue}
                    </span>
                  </div>
                )}
              </div>

              <div className="couponList__details">
                <span className="couponList__label">Expiration Date:</span>
                {"  "}
                <span className="couponList__value">
                  {new Date(coupon.expirationDate).toLocaleDateString()}
                </span>
              </div>

              <div className="couponList__details">
                <span className="couponList__label">Minimum Order Amount:</span>
                {"  "}
                <span className="couponList__value">
                  {coupon.minimumOrderAmount}
                </span>
              </div>

              <div className="couponList__details">
                <span className="couponList__label">Usage Limit:</span>
                {"  "}
                <span className="couponList__value">{coupon.usageLimit}</span>
              </div>

              <div className="couponList__details">
                <span className="couponList__label">Is Active:</span> {"  "}
                <span className="couponList__isActive_value">
                  {coupon.isActive ? "Yes" : "No"}
                </span>
              </div>

              <div className="shippingRate__actions">
                <button
                  className="shippingRate__edit-btn"
                  onClick={() => onEdit(coupon)} // Pass rate data to the form
                >
                  <FaEdit /> Edit
                </button>

                <button
                  className="shippingRate__delete-btn"
                  onClick={() => onDelete(coupon._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="couponList__available">No coupon list available</p>
      )}
    </section>
  );
}

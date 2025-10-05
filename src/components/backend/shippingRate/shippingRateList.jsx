import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./styles/shippingRate.css";

export default function ShippingRateList({
  onEdit,
  onDelete,
  loading,
  shippingRates,
  error,
}) {
  if (loading) {
    return (
      <span className="shippingRate__loading">Loading shipping rates...</span>
    );
  }

  if (error) {
    return (
      <div className="shipping__error-container">
        <span className="shipping__error">
          Unable to load shipping rates. Please try again later.
        </span>
      </div>
    );
  }

  return (
    <section className="shipping-rate-list">
      {shippingRates.length > 0 ? (
        <div className="shipping-rate__cards">
          {shippingRates.map((rate) => (
            <div className="shipping-rate__card" key={rate._id}>
              <div className="shipping-rate__details">
                <span className="shipping-rate__label">Rate Per Mile:</span>
                {"  "}
                <span className="shipping-rate__value">{rate.ratePerMile}</span>
              </div>
              <div className="shipping-rate__details">
                <span className="shipping-rate__label">Base Rate:</span>
                {"  "}
                <span className="shipping-rate__value">{rate.baseRate}</span>
              </div>
              <div className="shipping-rate__details">
                <span className="shipping-rate__label">Location:</span> {"  "}
                <span className="shipping-rate__value">
                  {rate.address || "Fetching address..."}
                </span>
              </div>
              <div className="shipping-rate__details">
                <span className="shipping-rate__label">Is Global:</span> {"  "}
                <span className="shipping-rate__value">
                  {rate.isGlobal ? "Yes" : "No"}
                </span>
              </div>

              <div className="shippingRate__actions">
                <button
                  className="shippingRate__edit-btn"
                  onClick={() => onEdit(rate)}
                >
                  <FaEdit /> Edit
                </button>

                <button
                  className="shippingRate__delete-btn"
                  onClick={() => onDelete(rate._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="shippingRate__empty-state">
          <p className="shippingRate__no-rates">
            No shipping rates available yet
          </p>
          <p className="shippingRate__subtitle">
            Create your first shipping rate using the form above.
          </p>
        </div>
      )}
    </section>
  );
}

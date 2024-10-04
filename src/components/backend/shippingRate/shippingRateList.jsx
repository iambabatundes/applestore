import React from "react";
import "./styles/shippingRate.css";

export default function ShippingRateList({
  onEdit,
  onDelete,
  loading,
  shippingRates,
  error,
}) {
  if (loading) {
    return <div className="loading">Loading shipping rates...</div>;
  }

  if (error) {
    return <div className="error">Error loading shipping rates</div>;
  }

  return (
    <section className="shipping-rate-list">
      {shippingRates.length > 0 ? (
        <div className="shipping-rate__cards">
          {shippingRates.map((rate) => (
            <div className="shipping-rate__card" key={rate._id}>
              <div className="shipping-rate__details">
                <p className="shipping-rate__label">Rate Per Mile:</p>
                <p className="shipping-rate__value">{rate.ratePerMile}</p>
              </div>
              <div className="shipping-rate__details">
                <p className="shipping-rate__label">Base Rate:</p>
                <p className="shipping-rate__value">{rate.baseRate}</p>
              </div>
              <div className="shipping-rate__details">
                <p className="shipping-rate__label">Location:</p>
                <p className="shipping-rate__value">
                  {rate.address || "Fetching address..."}
                </p>
              </div>
              <div className="shipping-rate__details">
                <p className="shipping-rate__label">Is Global:</p>
                <p className="shipping-rate__value">
                  {rate.isGlobal ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <button
                  className="edit-btn"
                  onClick={() => onEdit(rate)} // Pass rate data to the form
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => onDelete(rate._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No shipping rates available</p>
      )}
    </section>
  );
}

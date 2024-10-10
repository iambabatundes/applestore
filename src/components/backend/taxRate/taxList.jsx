import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./styles/taxList.css";

export default function TaxList({
  loading,
  error,
  taxRates,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return <span className="taxRate__loading">Loading tax rates...</span>;
  }

  if (error) {
    return <span className="tax__error">Error loading tax rates</span>;
  }
  return (
    <section className="taxRate__list">
      {taxRates.length > 0 ? (
        <div className="taxRate__cards">
          {taxRates.map((rate) => (
            <div className="taxRate__card" key={rate._id}>
              <div className="taxRate__details">
                <span className="taxRate__label">country:</span>
                {"  "}
                <span className="taxRate__value">{rate.country}</span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">region:</span>
                {"  "}
                <span className="taxRate__value">{rate.region}</span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">taxCode:</span> {"  "}
                <span className="taxRate__value">{rate.taxCode}</span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">taxRate:</span> {"  "}
                <span className="taxRate__value">{rate.taxRate}</span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">Is Global:</span> {"  "}
                <span className="taxRate__value">
                  {rate.isGlobal ? "Yes" : "No"}
                </span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">Is Active:</span> {"  "}
                <span className="taxRate__value">
                  {rate.isActive ? "Yes" : "No"}
                </span>
              </div>

              {/* Display Tiered Rates */}
              {rate.tieredRates && rate.tieredRates.length > 0 && (
                <div className="taxRate__tieredRates">
                  <h4>Tiered Rates:</h4>
                  <ul>
                    {rate.tieredRates.map((tier, index) => (
                      <li key={index}>
                        Min: {tier.minAmount}, Max: {tier.maxAmount}, Rate:{" "}
                        {tier.rate}%
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="taxRate__actions">
                <button
                  className="taxRate__edit-btn"
                  onClick={() => onEdit(rate)} // Pass rate data to the form
                >
                  <FaEdit /> Edit
                </button>

                <button
                  className="taxRate__delete-btn"
                  onClick={() => onDelete(rate._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="taxRate__vat-no">No VAT rates available</p>
      )}
    </section>
  );
}

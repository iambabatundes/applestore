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
                <span className="taxRate__label">Country:</span>
                {"  "}
                <span className="taxRate__value">{rate.country}</span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">Region:</span>
                {"  "}
                <span className="taxRate__value">{rate.region}</span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">City:</span>
                {"  "}
                <span className="taxRate__value">{rate.city}</span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">TaxCode:</span> {"  "}
                <span className="taxRate__value">{rate.taxCode}</span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">TaxRate:</span> {"  "}
                <span className="taxRate__value">{rate.taxRate}</span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">Effective Date:</span> {"  "}
                <span className="taxRate__value">
                  {new Date(rate.effectiveDate).toLocaleDateString()}
                </span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">Expiration Date:</span> {"  "}
                <span className="taxRate__value">
                  {new Date(rate.expirationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">IsGlobal:</span> {"  "}
                <span className="taxRate__value">
                  {rate.isGlobal ? "Yes" : "No"}
                </span>
              </div>
              <div className="taxRate__details">
                <span className="taxRate__label">IsActive:</span> {"  "}
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
        <div className="taxRate__empty-state">
          <p className="taxRate__vat-no">📋 No VAT rates available yet</p>
          <p className="taxRate__vat-subtitle">
            Get started by creating your first tax rate using the form above.
          </p>
        </div>
      )}
    </section>
  );
}

import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaDownload,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import { exportTaxRates } from "../../../services/taxRateService";
import { toast } from "react-toastify";
import "./styles/taxList.css";

export default function TaxList({
  loading,
  error,
  taxRates,
  pagination,
  onEdit,
  onDelete,
  onFilterChange,
  onPageChange,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    region: "",
    taxType: "",
    isActive: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      country: "",
      region: "",
      taxType: "",
      isActive: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const handleExport = (format) => {
    try {
      exportTaxRates(taxRates, format);
      toast.success(`Tax rates exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export tax rates");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="taxRate__loading-container">
        <span className="taxRate__loading">Loading tax rates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="taxRate__error-container">
        <span className="tax__error">Error loading tax rates</span>
      </div>
    );
  }

  return (
    <section className="taxRate__list">
      {/* Header with Actions */}
      <div className="taxRate__list-header">
        <h3 className="taxRate__list-title">Tax Rates List</h3>
        <div className="taxRate__list-actions">
          <button
            className="taxRate__action-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> {showFilters ? "Hide" : "Show"} Filters
          </button>
          <button
            className="taxRate__action-btn"
            onClick={() => handleExport("csv")}
          >
            <FaDownload /> Export CSV
          </button>
          <button
            className="taxRate__action-btn"
            onClick={() => handleExport("json")}
          >
            <FaDownload /> Export JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="taxRate__filters">
          <div className="taxRate__filter-group">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search tax code, name..."
              className="taxRate__filter-input"
            />
            <FaSearch className="taxRate__filter-icon" />
          </div>

          <input
            type="text"
            name="country"
            value={filters.country}
            onChange={handleFilterChange}
            placeholder="Country code (e.g., US)"
            className="taxRate__filter-input"
          />

          <input
            type="text"
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            placeholder="Region"
            className="taxRate__filter-input"
          />

          <select
            name="taxType"
            value={filters.taxType}
            onChange={handleFilterChange}
            className="taxRate__filter-select"
          >
            <option value="">All Types</option>
            <option value="VAT">VAT</option>
            <option value="GST">GST</option>
            <option value="SALES">Sales Tax</option>
            <option value="EXCISE">Excise Tax</option>
            <option value="IMPORT">Import Tax</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            name="isActive"
            value={filters.isActive}
            onChange={handleFilterChange}
            className="taxRate__filter-select"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <div className="taxRate__filter-buttons">
            <button onClick={applyFilters} className="taxRate__filter-apply">
              Apply Filters
            </button>
            <button onClick={clearFilters} className="taxRate__filter-clear">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Tax Rates Cards */}
      {taxRates.length > 0 ? (
        <>
          <div className="taxRate__cards">
            {taxRates.map((rate) => (
              <div className="taxRate__card" key={rate._id}>
                <div className="taxRate__card-header">
                  <h4 className="taxRate__card-title">{rate.taxName}</h4>
                  <div className="taxRate__card-badges">
                    <span
                      className={`taxRate__badge ${
                        rate.isActive
                          ? "taxRate__badge--active"
                          : "taxRate__badge--inactive"
                      }`}
                    >
                      {rate.isActive ? "Active" : "Inactive"}
                    </span>
                    <span className="taxRate__badge taxRate__badge--type">
                      {rate.taxType}
                    </span>
                  </div>
                </div>

                <div className="taxRate__card-body">
                  <div className="taxRate__details">
                    <span className="taxRate__label">Tax Code:</span>
                    <span className="taxRate__value">{rate.taxCode}</span>
                  </div>

                  <div className="taxRate__details">
                    <span className="taxRate__label">Tax Rate:</span>
                    <span className="taxRate__value taxRate__value--rate">
                      {rate.taxRate}%
                    </span>
                  </div>

                  <div className="taxRate__details">
                    <span className="taxRate__label">Location:</span>
                    <span className="taxRate__value">
                      {[rate.country, rate.region, rate.city]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </span>
                  </div>

                  <div className="taxRate__details">
                    <span className="taxRate__label">Jurisdiction:</span>
                    <span className="taxRate__value">
                      {rate.jurisdictionLevel}
                    </span>
                  </div>

                  <div className="taxRate__details">
                    <span className="taxRate__label">Effective Date:</span>
                    <span className="taxRate__value">
                      {formatDate(rate.effectiveDate)}
                    </span>
                  </div>

                  <div className="taxRate__details">
                    <span className="taxRate__label">Expiration Date:</span>
                    <span className="taxRate__value">
                      {formatDate(rate.expirationDate)}
                    </span>
                  </div>

                  {rate.isGlobal && (
                    <div className="taxRate__details">
                      <span className="taxRate__badge taxRate__badge--global">
                        Global
                      </span>
                    </div>
                  )}

                  {rate.applyToShipping && (
                    <div className="taxRate__details">
                      <span className="taxRate__label">Shipping:</span>
                      <span className="taxRate__value">Taxable</span>
                    </div>
                  )}

                  {rate.priority > 0 && (
                    <div className="taxRate__details">
                      <span className="taxRate__label">Priority:</span>
                      <span className="taxRate__value">{rate.priority}</span>
                    </div>
                  )}

                  {rate.description && (
                    <div className="taxRate__details taxRate__details--full">
                      <span className="taxRate__label">Description:</span>
                      <p className="taxRate__description">{rate.description}</p>
                    </div>
                  )}

                  {/* Tiered Rates */}
                  {rate.tieredRates && rate.tieredRates.length > 0 && (
                    <div className="taxRate__tieredRates">
                      <h4>Tiered Rates:</h4>
                      <ul>
                        {rate.tieredRates.map((tier, index) => (
                          <li key={index}>
                            {tier.minAmount} - {tier.maxAmount}: {tier.rate}%
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Product Categories */}
                  {rate.productCategories &&
                    rate.productCategories.length > 0 && (
                      <div className="taxRate__categories">
                        <span className="taxRate__label">Applies to:</span>
                        <div className="taxRate__category-tags">
                          {rate.productCategories.map((cat, idx) => (
                            <span key={idx} className="taxRate__category-tag">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Excluded Categories */}
                  {rate.excludedCategories &&
                    rate.excludedCategories.length > 0 && (
                      <div className="taxRate__categories">
                        <span className="taxRate__label">Excludes:</span>
                        <div className="taxRate__category-tags">
                          {rate.excludedCategories.map((cat, idx) => (
                            <span
                              key={idx}
                              className="taxRate__category-tag taxRate__category-tag--excluded"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {rate.isCompound && (
                    <div className="taxRate__details">
                      <span className="taxRate__badge taxRate__badge--compound">
                        Compound Tax (Order: {rate.compoundOrder})
                      </span>
                    </div>
                  )}
                </div>

                <div className="taxRate__actions">
                  <button
                    className="taxRate__edit-btn"
                    onClick={() => onEdit(rate)}
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

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="taxRate__pagination">
              <button
                className="taxRate__pagination-btn"
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>

              <div className="taxRate__pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
                <span className="taxRate__pagination-total">
                  ({pagination.totalItems} total)
                </span>
              </div>

              <button
                className="taxRate__pagination-btn"
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="taxRate__empty-state">
          <p className="taxRate__vat-no">📋 No tax rates available</p>
          <p className="taxRate__vat-subtitle">
            Get started by creating your first tax rate using the form above.
          </p>
        </div>
      )}
    </section>
  );
}

// components/admin/payments/common/PaymentFilters.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getAvailableProviders } from "../../../../services/paymentService";
import "../styles/paymentFilters.css";

const STATUSES = [
  { value: "", label: "All Statuses" },
  { value: "succeeded", label: "Succeeded" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "failed", label: "Failed" },
  { value: "canceled", label: "Canceled" },
  { value: "refunded", label: "Refunded" },
];

const CURRENCIES = [
  { value: "", label: "All Currencies" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "NGN", label: "NGN (₦)" },
];

const PaymentFilters = ({ filters, onChange, onApply, onClear }) => {
  const [providers, setProviders] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(true);

  // Load providers
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await getAvailableProviders();
        setProviders(data || []);
      } catch (err) {
        console.error("Failed to load providers:", err);
      } finally {
        setLoadingProviders(false);
      }
    };
    loadProviders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      onApply();
    }
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== ""
  ).length;

  return (
    <div className="payment-filters">
      {/* Primary Filters Row */}
      <div className="payment-filters__primary">
        <div className="filter-group filter-group--search">
          <label htmlFor="search" className="visually-hidden">
            Search
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search by email, ID, or reference..."
            className="filter-input filter-input--search"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-group">
          <label htmlFor="status" className="visually-hidden">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="filter-select"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="provider" className="visually-hidden">
            Provider
          </label>
          <select
            id="provider"
            name="provider"
            value={filters.provider}
            onChange={handleChange}
            className="filter-select"
            disabled={loadingProviders}
          >
            <option value="">All Providers</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="filter-toggle"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "Less Filters" : "More Filters"}
          {activeFilterCount > 2 && (
            <span className="filter-badge">{activeFilterCount - 2}</span>
          )}
          <span className="toggle-icon">{expanded ? "▲" : "▼"}</span>
        </button>

        <button type="button" className="filter-apply-btn" onClick={onApply}>
          Apply
        </button>
      </div>

      {/* Advanced Filters */}
      {expanded && (
        <div className="payment-filters__advanced">
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="dateFrom" className="filter-label">
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="dateTo" className="filter-label">
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="currency" className="filter-label">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={filters.currency}
                onChange={handleChange}
                className="filter-select"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="minAmount" className="filter-label">
                Min Amount
              </label>
              <input
                type="number"
                id="minAmount"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="maxAmount" className="filter-label">
                Max Amount
              </label>
              <input
                type="number"
                id="maxAmount"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleChange}
                placeholder="No limit"
                min="0"
                step="0.01"
                className="filter-input"
              />
            </div>

            <div className="filter-group filter-group--actions">
              <button
                type="button"
                className="filter-clear-btn"
                onClick={onClear}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentFilters;

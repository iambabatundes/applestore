import React from "react";
import "./styles/shippingRate.css";

export default function ShippingRateFilters({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  return (
    <div className="shipping-rate__filters">
      <h3 className="shipping-rate__filters-title">Filter Rates</h3>

      <div className="shipping-rate__filters-grid">
        <div className="filter-group">
          <label htmlFor="search-filter">Search</label>
          <input
            id="search-filter"
            type="text"
            placeholder="Search by name or code..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={
              filters.isActive === undefined
                ? "all"
                : filters.isActive.toString()
            }
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange(
                "isActive",
                value === "all" ? undefined : value === "true"
              );
            }}
            className="filter-select"
          >
            <option value="all">All Rates</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="carrier-filter">Carrier</label>
          <select
            id="carrier-filter"
            value={filters.carrier || ""}
            onChange={(e) => onFilterChange("carrier", e.target.value)}
            className="filter-select"
          >
            <option value="">All Carriers</option>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="overnight">Overnight</option>
            <option value="ups">UPS</option>
            <option value="fedex">FedEx</option>
            <option value="dhl">DHL</option>
            <option value="usps">USPS</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-filter">Sort By</label>
          <select
            id="sort-filter"
            value={filters.sortBy || "createdAt"}
            onChange={(e) => onFilterChange("sortBy", e.target.value)}
            className="filter-select"
          >
            <option value="createdAt">Date Created</option>
            <option value="name">Name</option>
            <option value="ratePerMile">Rate Per Mile</option>
            <option value="baseRate">Base Rate</option>
            <option value="carrier">Carrier</option>
          </select>
        </div>
      </div>

      <div className="shipping-rate__filters-actions">
        <button
          className="shipping-rate__btn shipping-rate__btn--secondary"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}

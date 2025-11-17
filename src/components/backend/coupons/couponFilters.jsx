import React, { useState } from "react";
import "./styles/couponFilters.css";

export default function CouponFilters({ filters, onFilterChange, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      isActive: undefined,
      discountType: "",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  return (
    <div className="coupon-filters">
      <h3 className="coupon-filters__title">Filter Coupons</h3>

      <div className="coupon-filters__container">
        {/* Search */}
        <div className="coupon-filters__field">
          <label className="coupon-filters__label">Search</label>
          <input
            type="text"
            name="search"
            value={localFilters.search}
            onChange={handleInputChange}
            placeholder="Search by code or description..."
            className="coupon-filters__input"
          />
        </div>

        {/* Status Filter */}
        <div className="coupon-filters__field">
          <label className="coupon-filters__label">Status</label>
          <select
            name="isActive"
            value={
              localFilters.isActive === undefined ? "" : localFilters.isActive
            }
            onChange={(e) => {
              const value =
                e.target.value === "" ? undefined : e.target.value === "true";
              setLocalFilters((prev) => ({
                ...prev,
                isActive: value,
              }));
            }}
            className="coupon-filters__select"
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Discount Type Filter */}
        <div className="coupon-filters__field">
          <label className="coupon-filters__label">Discount Type</label>
          <select
            name="discountType"
            value={localFilters.discountType}
            onChange={handleInputChange}
            className="coupon-filters__select"
          >
            <option value="">All</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        {/* Date Range Filters */}
        <div className="coupon-filters__field">
          <label className="coupon-filters__label">Expiration From</label>
          <input
            type="date"
            name="startDate"
            value={localFilters.startDate}
            onChange={handleInputChange}
            className="coupon-filters__input"
          />
        </div>

        <div className="coupon-filters__field">
          <label className="coupon-filters__label">Expiration To</label>
          <input
            type="date"
            name="endDate"
            value={localFilters.endDate}
            onChange={handleInputChange}
            className="coupon-filters__input"
          />
        </div>

        {/* Action Buttons */}
        <div className="coupon-filters__actions">
          <button
            onClick={handleApplyFilters}
            className="coupon-filters__btn coupon-filters__btn--apply"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="coupon-filters__btn coupon-filters__btn--reset"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

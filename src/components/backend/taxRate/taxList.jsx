import React, { useState, useMemo } from "react";
import {
  FaEdit,
  FaTrash,
  FaDownload,
  FaSearch,
  FaFilter,
  FaChartLine,
  FaEye,
  FaSync,
} from "react-icons/fa";
import { exportTaxRates } from "../../../services/taxRateService";
import { toast } from "react-toastify";
import { BulkOperations } from "./common/bulkOperations";
import "./styles/taxList.css";

export default function TaxList({
  loading,
  error,
  taxRates = [], // Default to empty array
  pagination,
  onEdit,
  onDelete,
  onDeactivate,
  onFilterChange,
  onPageChange,
  onRefresh,
  statistics,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [selectedRates, setSelectedRates] = useState(new Set());
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    region: "",
    taxType: "",
    isActive: "",
    jurisdictionLevel: "",
  });

  // Safe tax rates array
  const safeTaxRates = taxRates || [];

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
      jurisdictionLevel: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const handleExport = (format) => {
    try {
      const ratesToExport =
        selectedRates.size > 0
          ? safeTaxRates.filter((rate) => selectedRates.has(rate._id))
          : safeTaxRates;

      exportTaxRates(ratesToExport, format);
      toast.success(`Tax rates exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export tax rates");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRates(new Set(safeTaxRates.map((rate) => rate._id)));
    } else {
      setSelectedRates(new Set());
    }
  };

  const handleSelectRate = (rateId, checked) => {
    const newSelected = new Set(selectedRates);
    if (checked) {
      newSelected.add(rateId);
    } else {
      newSelected.delete(rateId);
    }
    setSelectedRates(newSelected);
  };

  const handleBulkDeactivate = async (reason) => {
    if (selectedRates.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${selectedRates.size} tax rate(s)?`
    );

    if (!confirmed) return;

    try {
      for (const rateId of selectedRates) {
        await onDeactivate(rateId, reason);
      }
      setSelectedRates(new Set());
      toast.success(`${selectedRates.size} tax rate(s) deactivated`);
    } catch (error) {
      toast.error("Failed to deactivate tax rates");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(expirationDate) <= thirtyDaysFromNow;
  };

  // Safe function to get tax type class
  const getTaxTypeClass = (taxType) => {
    if (!taxType) return "taxRate__type--other";
    return `taxRate__type--${taxType.toLowerCase()}`;
  };

  // Safe function to get tax type display value
  const getTaxTypeDisplay = (taxType) => {
    return taxType || "OTHER";
  };

  if (loading) {
    return (
      <div className="taxRate__loading-container">
        <div className="taxRate__loading-spinner"></div>
        <span className="taxRate__loading">Loading tax rates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="taxRate__error-container">
        <span className="taxRate__error">
          Error loading tax rates: {error.message}
        </span>
        <button onClick={onRefresh} className="taxRate__retry-btn">
          <FaSync /> Retry
        </button>
      </div>
    );
  }

  return (
    <section className="taxRate__list">
      {/* Header with Actions */}
      <div className="taxRate__list-header">
        <div className="taxRate__list-title-section">
          <h3 className="taxRate__list-title">Tax Rates</h3>
          {pagination && (
            <span className="taxRate__list-count">
              {pagination.totalItems} total
            </span>
          )}
        </div>

        <div className="taxRate__list-actions">
          <button
            className="taxRate__action-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> {showFilters ? "Hide" : "Show"} Filters
          </button>

          <button
            className="taxRate__action-btn"
            onClick={() => setShowStatistics(!showStatistics)}
          >
            <FaChartLine /> Statistics
          </button>

          <button
            className="taxRate__action-btn"
            onClick={() => handleExport("csv")}
            disabled={safeTaxRates.length === 0}
          >
            <FaDownload /> Export CSV
          </button>

          <button className="taxRate__action-btn" onClick={onRefresh}>
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      {/* Bulk Operations */}
      {selectedRates.size > 0 && (
        <BulkOperations
          selectedCount={selectedRates.size}
          onDeactivate={handleBulkDeactivate}
          onClearSelection={() => setSelectedRates(new Set())}
        />
      )}

      {/* Enhanced Filters */}
      {showFilters && (
        <div className="taxRate__filters">
          <div className="taxRate__filter-group">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search tax code, name, description..."
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
            placeholder="Region/State"
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
            name="jurisdictionLevel"
            value={filters.jurisdictionLevel}
            onChange={handleFilterChange}
            className="taxRate__filter-select"
          >
            <option value="">All Jurisdictions</option>
            <option value="FEDERAL">Federal</option>
            <option value="STATE">State</option>
            <option value="COUNTY">County</option>
            <option value="CITY">City</option>
            <option value="MUNICIPAL">Municipal</option>
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

      {/* Tax Rates Table */}
      {safeTaxRates.length > 0 ? (
        <>
          <div className="taxRate__table-container">
            <table className="taxRate__table">
              <thead>
                <tr>
                  <th className="taxRate__table-checkbox">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedRates.size === safeTaxRates.length &&
                        safeTaxRates.length > 0
                      }
                    />
                  </th>
                  <th>Tax Code</th>
                  <th>Tax Name</th>
                  <th>Type</th>
                  <th>Rate</th>
                  <th>Location</th>
                  <th>Jurisdiction</th>
                  <th>Status</th>
                  <th>Effective Date</th>
                  <th>Expiration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeTaxRates.map((rate) => (
                  <tr
                    key={rate._id}
                    className={`
                      taxRate__table-row
                      ${!rate.isActive ? "taxRate__table-row--inactive" : ""}
                      ${
                        isExpiringSoon(rate.expirationDate)
                          ? "taxRate__table-row--expiring"
                          : ""
                      }
                    `}
                  >
                    <td className="taxRate__table-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedRates.has(rate._id)}
                        onChange={(e) =>
                          handleSelectRate(rate._id, e.target.checked)
                        }
                      />
                    </td>
                    <td>
                      <div className="taxRate__code">
                        {rate.taxCode || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="taxRate__name">
                        {rate.taxName || "Unnamed Tax"}
                      </div>
                      {rate.description && (
                        <div className="taxRate__description">
                          {rate.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`taxRate__type ${getTaxTypeClass(
                          rate.taxType
                        )}`}
                      >
                        {getTaxTypeDisplay(rate.taxType)}
                      </span>
                    </td>
                    <td>
                      <span className="taxRate__rate-value">
                        {rate.taxRate || 0}%
                      </span>
                      {rate.tieredRates && rate.tieredRates.length > 0 && (
                        <div className="taxRate__tiered-indicator">Tiered</div>
                      )}
                    </td>
                    <td>
                      <div className="taxRate__location">
                        {[rate.country, rate.region, rate.city]
                          .filter(Boolean)
                          .join(", ") || "Global"}
                        {rate.isGlobal && (
                          <span className="taxRate__global-indicator">
                            Global
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="taxRate__jurisdiction">
                        {rate.jurisdictionLevel || "STATE"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`taxRate__status ${
                          rate.isActive
                            ? "taxRate__status--active"
                            : "taxRate__status--inactive"
                        }`}
                      >
                        {rate.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="taxRate__date">
                        {formatDate(rate.effectiveDate)}
                      </div>
                    </td>
                    <td>
                      <div className="taxRate__date">
                        {rate.expirationDate ? (
                          <span
                            className={
                              isExpiringSoon(rate.expirationDate)
                                ? "taxRate__date--expiring"
                                : ""
                            }
                          >
                            {formatDate(rate.expirationDate)}
                          </span>
                        ) : (
                          "No expiration"
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="taxRate__action-buttons">
                        <button
                          className="taxRate__action-btn taxRate__action-btn--view"
                          onClick={() => onEdit(rate)}
                          title="Edit tax rate"
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="taxRate__action-btn taxRate__action-btn--deactivate"
                          onClick={() =>
                            onDeactivate(
                              rate._id,
                              "Deactivated via admin panel"
                            )
                          }
                          title="Deactivate tax rate"
                          disabled={!rate.isActive}
                        >
                          <FaEye />
                        </button>

                        <button
                          className="taxRate__action-btn taxRate__action-btn--delete"
                          onClick={() => onDelete(rate._id)}
                          title="Delete tax rate"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="taxRate__pagination">
              <div className="taxRate__pagination-info">
                Showing{" "}
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems}
              </div>

              <div className="taxRate__pagination-controls">
                <button
                  className="taxRate__pagination-btn"
                  onClick={() => onPageChange(1)}
                  disabled={!pagination.hasPrevPage}
                >
                  First
                </button>

                <button
                  className="taxRate__pagination-btn"
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </button>

                <div className="taxRate__pagination-pages">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          className={`taxRate__pagination-btn ${
                            pageNum === pagination.currentPage
                              ? "taxRate__pagination-btn--active"
                              : ""
                          }`}
                          onClick={() => onPageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  className="taxRate__pagination-btn"
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </button>

                <button
                  className="taxRate__pagination-btn"
                  onClick={() => onPageChange(pagination.totalPages)}
                  disabled={!pagination.hasNextPage}
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="taxRate__empty-state">
          <p className="taxRate__empty-icon">📋</p>
          <p className="taxRate__empty-title">No tax rates found</p>
          <p className="taxRate__empty-subtitle">
            {Object.values(filters).some((f) => f)
              ? "Try adjusting your filters to see more results"
              : "Get started by creating your first tax rate"}
          </p>
          {Object.values(filters).some((f) => f) && (
            <button onClick={clearFilters} className="taxRate__empty-action">
              Clear all filters
            </button>
          )}
        </div>
      )}
    </section>
  );
}

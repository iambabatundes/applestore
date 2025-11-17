// couponList.jsx
import React from "react";
import { FaEdit, FaTrash, FaPowerOff } from "react-icons/fa";
import "./styles/couponList.css";

export default function CouponList({
  coupons,
  error,
  loading,
  onEdit,
  onDelete,
  onActivate,
  pagination,
  onPageChange,
  onLimitChange,
}) {
  if (loading) {
    return (
      <div className="couponList__loading-container">
        <span className="couponList__loading">Loading coupons...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="couponList__error-container">
        <span className="couponList__error">
          Error loading coupons: {error}
        </span>
      </div>
    );
  }

  if (!coupons || coupons.length === 0) {
    return (
      <div className="couponList__empty-container">
        <p className="couponList__empty">No coupons available</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (expirationDate) => {
    return new Date(expirationDate) < new Date();
  };

  const hasStarted = (startDate) => {
    return new Date(startDate) <= new Date();
  };

  const getStatusBadge = (coupon) => {
    if (!coupon.isActive) {
      return <span className="status-badge status-inactive">Inactive</span>;
    }
    if (isExpired(coupon.expirationDate)) {
      return <span className="status-badge status-expired">Expired</span>;
    }
    if (!hasStarted(coupon.startDate)) {
      return <span className="status-badge status-scheduled">Scheduled</span>;
    }
    return <span className="status-badge status-active">Active</span>;
  };

  const renderPagination = () => {
    if (!pagination || pagination.pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.page - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(pagination.pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === pagination.page ? "active" : ""}`}
          onClick={() => onPageChange(i)}
          disabled={i === pagination.page}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="couponList__pagination">
        <div className="pagination-info">
          Showing{" "}
          {Math.min(
            (pagination.page - 1) * pagination.limit + 1,
            pagination.total
          )}{" "}
          to {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
          {pagination.total} coupons
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                className="pagination-btn"
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="pagination-ellipsis">...</span>
              )}
            </>
          )}

          {pages}

          {endPage < pagination.pages && (
            <>
              {endPage < pagination.pages - 1 && (
                <span className="pagination-ellipsis">...</span>
              )}
              <button
                className="pagination-btn"
                onClick={() => onPageChange(pagination.pages)}
              >
                {pagination.pages}
              </button>
            </>
          )}

          <button
            className="pagination-btn"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>

        <div className="pagination-limit">
          <label htmlFor="limit">Per page:</label>
          <select
            id="limit"
            value={pagination.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="limit-select"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <section className="couponList__container">
      <div className="couponList__header">
        <h2 className="couponList__title">Coupon Management</h2>
      </div>

      <div className="couponList__cards">
        {coupons.map((coupon) => {
          const expired = isExpired(coupon.expirationDate);
          const started = hasStarted(coupon.startDate);

          return (
            <div
              className={`couponList__card ${
                !coupon.isActive
                  ? "card-inactive"
                  : expired
                  ? "card-expired"
                  : ""
              }`}
              key={coupon._id}
            >
              <div className="couponList__card-header">
                <div className="coupon-code-section">
                  <span className="coupon-code">{coupon.code}</span>
                  {getStatusBadge(coupon)}
                </div>
              </div>

              <div className="couponList__section">
                <div className="couponList__details">
                  <span className="couponList__label">Discount Type:</span>
                  <span className="couponList__value discount-type">
                    {coupon.discountType === "percentage"
                      ? "Percentage"
                      : "Fixed Amount"}
                  </span>
                </div>

                {coupon.discountType === "percentage" && (
                  <>
                    <div className="couponList__details">
                      <span className="couponList__label">Percentage:</span>
                      <span className="couponList__value coupon-highlight">
                        {coupon.discountPercentage}%
                      </span>
                    </div>
                    {coupon.maximumDiscountAmount && (
                      <div className="couponList__details">
                        <span className="couponList__label">Max Discount:</span>
                        <span className="couponList__value">
                          ${coupon.maximumDiscountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {coupon.discountType === "fixed" && (
                  <div className="couponList__details">
                    <span className="couponList__label">Discount Amount:</span>
                    <span className="couponList__value coupon-highlight">
                      ${coupon.discountValue?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                )}
              </div>

              <div className="couponList__section">
                {coupon.startDate && (
                  <div className="couponList__details">
                    <span className="couponList__label">Start Date:</span>
                    <span className="couponList__value">
                      {formatDate(coupon.startDate)}
                    </span>
                  </div>
                )}
                <div className="couponList__details">
                  <span className="couponList__label">Expiration Date:</span>
                  <span
                    className={`couponList__value ${
                      expired ? "text-expired" : ""
                    }`}
                  >
                    {formatDate(coupon.expirationDate)}
                  </span>
                </div>
              </div>

              <div className="couponList__section">
                {coupon.minimumOrderAmount > 0 && (
                  <div className="couponList__details">
                    <span className="couponList__label">Min. Order:</span>
                    <span className="couponList__value">
                      ${coupon.minimumOrderAmount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="couponList__details">
                  <span className="couponList__label">Usage Limit:</span>
                  <span className="couponList__value">
                    {coupon.usageLimit || "Unlimited"}
                  </span>
                </div>

                {coupon.usedCount !== undefined && (
                  <div className="couponList__details">
                    <span className="couponList__label">Times Used:</span>
                    <span className="couponList__value">
                      {coupon.usedCount}
                    </span>
                  </div>
                )}

                {coupon.usagePerUser && (
                  <div className="couponList__details">
                    <span className="couponList__label">Per User:</span>
                    <span className="couponList__value">
                      {coupon.usagePerUser}
                    </span>
                  </div>
                )}
              </div>

              {(coupon.firstTimeUserOnly || coupon.description) && (
                <div className="couponList__section">
                  {coupon.firstTimeUserOnly && (
                    <div className="couponList__badge">
                      First-Time Users Only
                    </div>
                  )}
                  {coupon.description && (
                    <div className="couponList__description">
                      <span className="couponList__label">Description:</span>
                      <p>{coupon.description}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="couponList__actions">
                <button
                  className="couponList__btn couponList__edit-btn"
                  onClick={() => onEdit(coupon)}
                  title="Edit coupon"
                >
                  <FaEdit /> Edit
                </button>

                {!coupon.isActive && onActivate && (
                  <button
                    className="couponList__btn couponList__activate-btn"
                    onClick={() => onActivate(coupon._id)}
                    title="Activate coupon"
                  >
                    <FaPowerOff /> Activate
                  </button>
                )}

                {coupon.isActive && (
                  <button
                    className="couponList__btn couponList__delete-btn"
                    onClick={() => onDelete(coupon._id)}
                    title="Deactivate coupon"
                  >
                    <FaTrash /> Deactivate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {renderPagination()}
    </section>
  );
}

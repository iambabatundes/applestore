// components/admin/payments/DisputeManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getDisputes,
  respondToDispute,
  adminGetTransaction,
  formatCurrency,
} from "../../../services/paymentService";
import LoadingSpinner from "./common/loadingSpinner";
import ErrorBanner from "./common/errorBanner";
import Pagination from "./common/pagination";
import ConfirmationModal from "./common/confirmationModal";
import "./styles/disputeManagement.css";

const DISPUTE_STATUS = {
  needs_response: {
    label: "Needs Response",
    className: "warning",
    icon: "⚠️",
    priority: "high",
  },
  under_review: {
    label: "Under Review",
    className: "info",
    icon: "🔍",
    priority: "medium",
  },
  won: { label: "Won", className: "success", icon: "✓", priority: "low" },
  lost: { label: "Lost", className: "danger", icon: "✕", priority: "low" },
  warning_needs_response: {
    label: "Warning - Respond Now",
    className: "danger",
    icon: "🚨",
    priority: "critical",
  },
  warning_under_review: {
    label: "Warning - Under Review",
    className: "warning",
    icon: "⚡",
    priority: "high",
  },
  warning_closed: {
    label: "Warning Closed",
    className: "muted",
    icon: "📋",
    priority: "low",
  },
};

const DISPUTE_REASONS = {
  fraudulent: { label: "Fraudulent", icon: "🔒" },
  unrecognized: { label: "Unrecognized", icon: "❓" },
  duplicate: { label: "Duplicate", icon: "📋" },
  product_not_received: { label: "Product Not Received", icon: "📦" },
  product_unacceptable: { label: "Product Unacceptable", icon: "👎" },
  subscription_canceled: { label: "Subscription Canceled", icon: "🔄" },
  credit_not_processed: { label: "Credit Not Processed", icon: "💳" },
  general: { label: "General", icon: "📝" },
};

// Dispute Card Component
const DisputeCard = ({ dispute, onRespond, onViewDetails }) => {
  const status = DISPUTE_STATUS[dispute.status] || {
    label: dispute.status,
    className: "default",
    icon: "?",
  };
  const reason = DISPUTE_REASONS[dispute.reason] || {
    label: dispute.reason,
    icon: "?",
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilDeadline = () => {
    if (!dispute.dueBy) return null;
    const now = new Date();
    const deadline = new Date(dispute.dueBy);
    const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysLeft = getDaysUntilDeadline();
  const isUrgent = daysLeft !== null && daysLeft <= 3;

  return (
    <div className={`dispute-card ${isUrgent ? "dispute-card--urgent" : ""}`}>
      {isUrgent && <div className="dispute-card__urgent-flag">⚠️ Urgent</div>}

      <div className="dispute-card__header">
        <div className="dispute-card__info">
          <span className="dispute-card__icon">{reason.icon}</span>
          <div className="dispute-card__details">
            <h3 className="dispute-card__id">
              {dispute.disputeId || dispute._id?.slice(-12)}
            </h3>
            <span className="dispute-card__reason">{reason.label}</span>
          </div>
        </div>
        <span className={`status-badge status-badge--${status.className}`}>
          {status.icon} {status.label}
        </span>
      </div>

      <div className="dispute-card__body">
        <div className="dispute-info-grid">
          <div className="dispute-info-item">
            <span className="dispute-info-label">Amount</span>
            <span className="dispute-info-value">
              {formatCurrency(dispute.amount, dispute.currency)}
            </span>
          </div>
          <div className="dispute-info-item">
            <span className="dispute-info-label">Created</span>
            <span className="dispute-info-value">
              {formatDate(dispute.createdAt)}
            </span>
          </div>
          {dispute.dueBy && (
            <div className="dispute-info-item">
              <span className="dispute-info-label">Deadline</span>
              <span
                className={`dispute-info-value ${
                  isUrgent ? "text-danger" : ""
                }`}
              >
                {formatDate(dispute.dueBy)}
                {daysLeft !== null && (
                  <span className="days-left"> ({daysLeft}d left)</span>
                )}
              </span>
            </div>
          )}
          <div className="dispute-info-item">
            <span className="dispute-info-label">Transaction</span>
            <span className="dispute-info-value mono">
              {dispute.transactionId?.slice(-12) || "N/A"}
            </span>
          </div>
        </div>

        {dispute.customerEmail && (
          <div className="dispute-customer">
            <span className="dispute-customer__label">Customer:</span>
            <span className="dispute-customer__value">
              {dispute.customerEmail}
            </span>
          </div>
        )}

        {dispute.evidence && dispute.evidence.customerMessage && (
          <div className="dispute-message">
            <span className="dispute-message__label">Customer Message:</span>
            <p className="dispute-message__text">
              {dispute.evidence.customerMessage}
            </p>
          </div>
        )}
      </div>

      <div className="dispute-card__actions">
        {dispute.status === "needs_response" && (
          <button
            className="btn btn--primary btn--sm"
            onClick={() => onRespond(dispute)}
          >
            📝 Respond to Dispute
          </button>
        )}
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => onViewDetails(dispute)}
        >
          👁 View Details
        </button>
      </div>
    </div>
  );
};

// Respond to Dispute Modal
const RespondDisputeModal = ({ dispute, onSubmit, onClose, loading }) => {
  const [evidence, setEvidence] = useState({
    customerName: "",
    productDescription: "",
    shippingDate: "",
    shippingTrackingNumber: "",
    customerCommunication: "",
    refundPolicy: "",
    cancellationPolicy: "",
    additionalDocumentation: "",
  });

  const handleChange = (field, value) => {
    setEvidence((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(evidence);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal dispute-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2 className="modal__title">Respond to Dispute</h2>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal__content">
          <div className="dispute-summary">
            <h3>Dispute Information</h3>
            <div className="dispute-summary__grid">
              <div className="summary-item">
                <span className="summary-label">Amount</span>
                <span className="summary-value">
                  {formatCurrency(dispute.amount, dispute.currency)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Reason</span>
                <span className="summary-value">
                  {DISPUTE_REASONS[dispute.reason]?.label || dispute.reason}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Customer</span>
                <span className="summary-value">{dispute.customerEmail}</span>
              </div>
            </div>
          </div>

          <div className="evidence-form">
            <h3>Submit Evidence</h3>
            <p className="evidence-form__hint">
              Provide as much detail as possible to support your case
            </p>

            <div className="form-grid">
              <div className="form-group form-group--full">
                <label>Customer Name</label>
                <input
                  type="text"
                  value={evidence.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                  placeholder="Full name of the customer"
                  className="form-input"
                />
              </div>

              <div className="form-group form-group--full">
                <label>Product/Service Description</label>
                <textarea
                  value={evidence.productDescription}
                  onChange={(e) =>
                    handleChange("productDescription", e.target.value)
                  }
                  placeholder="Detailed description of what was provided..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Shipping Date (if applicable)</label>
                <input
                  type="date"
                  value={evidence.shippingDate}
                  onChange={(e) => handleChange("shippingDate", e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Tracking Number</label>
                <input
                  type="text"
                  value={evidence.shippingTrackingNumber}
                  onChange={(e) =>
                    handleChange("shippingTrackingNumber", e.target.value)
                  }
                  placeholder="Tracking number"
                  className="form-input"
                />
              </div>

              <div className="form-group form-group--full">
                <label>Customer Communication</label>
                <textarea
                  value={evidence.customerCommunication}
                  onChange={(e) =>
                    handleChange("customerCommunication", e.target.value)
                  }
                  placeholder="Summary of communications with customer..."
                  rows={4}
                  className="form-textarea"
                />
              </div>

              <div className="form-group form-group--full">
                <label>Refund Policy</label>
                <textarea
                  value={evidence.refundPolicy}
                  onChange={(e) => handleChange("refundPolicy", e.target.value)}
                  placeholder="Your refund policy as shown to customers..."
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-group form-group--full">
                <label>Additional Documentation</label>
                <textarea
                  value={evidence.additionalDocumentation}
                  onChange={(e) =>
                    handleChange("additionalDocumentation", e.target.value)
                  }
                  placeholder="Any additional information or documentation..."
                  rows={3}
                  className="form-textarea"
                />
              </div>
            </div>
          </div>
        </form>

        <footer className="modal__footer">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Evidence"}
          </button>
        </footer>
      </div>
    </div>
  );
};

// Main Component
const DisputeManagement = () => {
  const [disputes, setDisputes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({ status: "", reason: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load disputes
  const loadDisputes = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getDisputes({
          ...filters,
          page,
          limit: pagination.limit,
        });

        const data = response.data || response;
        setDisputes(data.disputes || data || []);
        setPagination((prev) => ({
          ...prev,
          page,
          total: data.pagination?.total || data.total || 0,
          pages:
            data.pagination?.pages || Math.ceil((data.total || 0) / prev.limit),
        }));
      } catch (err) {
        setError(err.message || "Failed to load disputes");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  useEffect(() => {
    loadDisputes(1);
  }, []);

  // Handle respond
  const handleRespond = (dispute) => {
    setSelectedDispute(dispute);
    setShowRespondModal(true);
  };

  // Submit evidence
  const handleSubmitEvidence = async (evidence) => {
    try {
      setActionLoading(true);
      await respondToDispute(
        selectedDispute.disputeId || selectedDispute._id,
        evidence
      );
      setSuccess("Evidence submitted successfully");
      setShowRespondModal(false);
      setSelectedDispute(null);
      loadDisputes(pagination.page);
    } catch (err) {
      setError(`Failed to submit evidence: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // View details
  const handleViewDetails = (dispute) => {
    setSelectedDispute(dispute);
    // Could open a details modal
    console.log("View dispute details:", dispute);
  };

  // Calculate stats
  const stats = {
    total: pagination.total,
    needsResponse: disputes.filter((d) => d.status === "needs_response").length,
    underReview: disputes.filter((d) => d.status === "under_review").length,
    won: disputes.filter((d) => d.status === "won").length,
    lost: disputes.filter((d) => d.status === "lost").length,
  };

  if (loading && !disputes.length) {
    return (
      <div className="dispute-mgmt dispute-mgmt--loading">
        <LoadingSpinner size="large" message="Loading disputes..." />
      </div>
    );
  }

  return (
    <div className="dispute-mgmt">
      {/* Header */}
      <header className="dispute-mgmt__header">
        <div className="dispute-mgmt__title-section">
          <h1 className="dispute-mgmt__title">⚖️ Dispute Management</h1>
          <p className="dispute-mgmt__subtitle">
            Handle chargebacks and customer disputes
          </p>
        </div>
        <button className="btn btn--secondary" onClick={() => loadDisputes(1)}>
          ↻ Refresh
        </button>
      </header>

      {/* Notifications */}
      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}
      {success && (
        <div className="success-banner">
          ✓ {success}
          <button onClick={() => setSuccess(null)} className="banner__close">
            ×
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="dispute-stats">
        <div className="dispute-stat">
          <span className="dispute-stat__value">{stats.total}</span>
          <span className="dispute-stat__label">Total Disputes</span>
        </div>
        <div className="dispute-stat dispute-stat--warning">
          <span className="dispute-stat__value">{stats.needsResponse}</span>
          <span className="dispute-stat__label">Needs Response</span>
        </div>
        <div className="dispute-stat dispute-stat--info">
          <span className="dispute-stat__value">{stats.underReview}</span>
          <span className="dispute-stat__label">Under Review</span>
        </div>
        <div className="dispute-stat dispute-stat--success">
          <span className="dispute-stat__value">{stats.won}</span>
          <span className="dispute-stat__label">Won</span>
        </div>
        <div className="dispute-stat dispute-stat--danger">
          <span className="dispute-stat__value">{stats.lost}</span>
          <span className="dispute-stat__label">Lost</span>
        </div>
      </div>

      {/* Filters */}
      <div className="dispute-filters">
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="filter-select"
        >
          <option value="">All Statuses</option>
          {Object.entries(DISPUTE_STATUS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filters.reason}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, reason: e.target.value }))
          }
          className="filter-select"
        >
          <option value="">All Reasons</option>
          {Object.entries(DISPUTE_REASONS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <button className="btn btn--primary" onClick={() => loadDisputes(1)}>
          Apply Filters
        </button>
      </div>

      {/* Disputes Grid */}
      <div className="dispute-mgmt__content">
        {disputes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">✅</span>
            <h3>No disputes found</h3>
            <p>All clear! No active disputes or chargebacks</p>
          </div>
        ) : (
          <>
            <div className="disputes-grid">
              {disputes.map((dispute) => (
                <DisputeCard
                  key={dispute.disputeId || dispute._id}
                  dispute={dispute}
                  onRespond={handleRespond}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={(page) => loadDisputes(page)}
            />
          </>
        )}
      </div>

      {/* Respond Modal */}
      {showRespondModal && selectedDispute && (
        <RespondDisputeModal
          dispute={selectedDispute}
          onSubmit={handleSubmitEvidence}
          onClose={() => {
            setShowRespondModal(false);
            setSelectedDispute(null);
          }}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default DisputeManagement;

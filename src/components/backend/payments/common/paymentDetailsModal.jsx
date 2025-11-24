// PaymentDetailsModal.jsx
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../../services/paymentService";
import "../styles/paymentDetailsModal.css";

const STATUS_CONFIG = {
  succeeded: { label: "Succeeded", className: "success" },
  pending: { label: "Pending", className: "warning" },
  processing: { label: "Processing", className: "info" },
  failed: { label: "Failed", className: "danger" },
  canceled: { label: "Canceled", className: "muted" },
  refunded: { label: "Refunded", className: "refund" },
  requires_action: { label: "Action Required", className: "warning" },
  requires_capture: { label: "Needs Capture", className: "info" },
};

const PaymentDetailsModal = ({
  payment,
  onClose,
  onAction,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [refundAmount, setRefundAmount] = useState(payment.amount || 0);
  const [refundReason, setRefundReason] = useState("");
  const [showRefundForm, setShowRefundForm] = useState(false);
  const modalRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Focus trap
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };

  // Get status config
  const statusConfig = STATUS_CONFIG[payment.status] || {
    label: payment.status,
    className: "default",
  };

  // Determine available actions
  const canRefund = payment.status === "succeeded";
  const canCapture = payment.status === "requires_capture";
  const canCancel = ["pending", "processing"].includes(payment.status);

  // Handle refund submit
  const handleRefundSubmit = () => {
    onAction("refund", payment.transactionId, {
      amount: parseFloat(refundAmount),
      reason: refundReason,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal payment-details-modal"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <header className="modal__header">
          <div className="modal__title-section">
            <h2 id="modal-title" className="modal__title">
              Payment Details
            </h2>
            <span
              className={`status-badge status-badge--${statusConfig.className}`}
            >
              {statusConfig.label}
            </span>
          </div>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>

        {/* Tabs */}
        <div className="modal__tabs" role="tablist">
          <button
            role="tab"
            className={`modal__tab ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
            aria-selected={activeTab === "details"}
          >
            Details
          </button>
          <button
            role="tab"
            className={`modal__tab ${activeTab === "metadata" ? "active" : ""}`}
            onClick={() => setActiveTab("metadata")}
            aria-selected={activeTab === "metadata"}
          >
            Metadata
          </button>
          <button
            role="tab"
            className={`modal__tab ${activeTab === "timeline" ? "active" : ""}`}
            onClick={() => setActiveTab("timeline")}
            aria-selected={activeTab === "timeline"}
          >
            Timeline
          </button>
        </div>

        {/* Content */}
        <div className="modal__content">
          {activeTab === "details" && (
            <div className="details-tab">
              {/* Amount Highlight */}
              <div className="amount-highlight">
                <span className="amount-highlight__value">
                  {formatCurrency(payment.amount, payment.currency)}
                </span>
                <span className="amount-highlight__currency">
                  {payment.currency}
                </span>
              </div>

              {/* Details Grid */}
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Transaction ID</span>
                  <span className="detail-value detail-value--mono">
                    {payment.transactionId || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment ID</span>
                  <span className="detail-value detail-value--mono">
                    {payment.paymentId || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Customer Email</span>
                  <span className="detail-value">{payment.email || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Provider</span>
                  <span className="detail-value capitalize">
                    {payment.provider || "N/A"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created</span>
                  <span className="detail-value">
                    {formatDate(payment.createdAt)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Last Updated</span>
                  <span className="detail-value">
                    {formatDate(payment.updatedAt)}
                  </span>
                </div>
                {payment.description && (
                  <div className="detail-item detail-item--full">
                    <span className="detail-label">Description</span>
                    <span className="detail-value">{payment.description}</span>
                  </div>
                )}
              </div>

              {/* Fraud Info */}
              {payment.metadata?.fraudScore !== undefined && (
                <div className="fraud-section">
                  <h4 className="section-title">Fraud Analysis</h4>
                  <div className="fraud-grid">
                    <div className="fraud-item">
                      <span className="fraud-label">Fraud Score</span>
                      <span
                        className={`fraud-value ${
                          payment.metadata.fraudScore > 0.7
                            ? "fraud-value--danger"
                            : payment.metadata.fraudScore > 0.4
                            ? "fraud-value--warning"
                            : "fraud-value--safe"
                        }`}
                      >
                        {(payment.metadata.fraudScore * 100).toFixed(1)}%
                      </span>
                    </div>
                    {payment.metadata.riskLevel && (
                      <div className="fraud-item">
                        <span className="fraud-label">Risk Level</span>
                        <span className="fraud-value capitalize">
                          {payment.metadata.riskLevel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Refund Form */}
              {showRefundForm && canRefund && (
                <div className="refund-form">
                  <h4 className="section-title">Process Refund</h4>
                  <div className="refund-form__fields">
                    <div className="form-group">
                      <label htmlFor="refundAmount">Amount</label>
                      <input
                        type="number"
                        id="refundAmount"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        max={payment.amount}
                        min="0"
                        step="0.01"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="refundReason">Reason</label>
                      <textarea
                        id="refundReason"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        placeholder="Enter refund reason..."
                        className="form-textarea"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="refund-form__actions">
                    <button
                      className="btn btn--secondary"
                      onClick={() => setShowRefundForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn--danger"
                      onClick={handleRefundSubmit}
                      disabled={loading || refundAmount <= 0}
                    >
                      {loading ? "Processing..." : "Confirm Refund"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="metadata-tab">
              <pre className="metadata-json">
                {JSON.stringify(payment.metadata || {}, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="timeline-tab">
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot timeline-dot--success" />
                  <div className="timeline-content">
                    <span className="timeline-label">Payment Created</span>
                    <span className="timeline-date">
                      {formatDate(payment.createdAt)}
                    </span>
                  </div>
                </div>
                {payment.status === "succeeded" && (
                  <div className="timeline-item">
                    <div className="timeline-dot timeline-dot--success" />
                    <div className="timeline-content">
                      <span className="timeline-label">Payment Succeeded</span>
                      <span className="timeline-date">
                        {formatDate(payment.updatedAt)}
                      </span>
                    </div>
                  </div>
                )}
                {payment.status === "failed" && (
                  <div className="timeline-item">
                    <div className="timeline-dot timeline-dot--danger" />
                    <div className="timeline-content">
                      <span className="timeline-label">Payment Failed</span>
                      <span className="timeline-date">
                        {formatDate(payment.updatedAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <footer className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>
            Close
          </button>

          {canCapture && (
            <button
              className="btn btn--success"
              onClick={() =>
                onAction("capture", payment.transactionId, {
                  amount: payment.amount,
                })
              }
              disabled={loading}
            >
              {loading ? "Processing..." : "Capture Payment"}
            </button>
          )}

          {canCancel && (
            <button
              className="btn btn--danger"
              onClick={() => onAction("cancel", payment.transactionId)}
              disabled={loading}
            >
              Cancel Payment
            </button>
          )}

          {canRefund && !showRefundForm && (
            <button
              className="btn btn--warning"
              onClick={() => setShowRefundForm(true)}
            >
              Refund Payment
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;

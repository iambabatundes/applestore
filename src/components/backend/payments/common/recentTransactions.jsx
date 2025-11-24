// components/admin/payments/common/RecentTransactions.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../../services/paymentService";
import "../styles/recentTransactions.css";

const STATUS_CONFIG = {
  succeeded: { label: "Succeeded", className: "success", icon: "✓" },
  pending: { label: "Pending", className: "warning", icon: "⏳" },
  processing: { label: "Processing", className: "info", icon: "⟳" },
  failed: { label: "Failed", className: "danger", icon: "✕" },
  canceled: { label: "Canceled", className: "muted", icon: "⊘" },
  refunded: { label: "Refunded", className: "refund", icon: "↩" },
  requires_action: {
    label: "Action Required",
    className: "warning",
    icon: "⚠",
  },
};

const PROVIDER_ICONS = {
  stripe: "💳",
  paypal: "🅿️",
  paystack: "💰",
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: "default",
    icon: "?",
  };

  return (
    <span className={`status-badge status-badge--${config.className}`}>
      <span className="status-badge__icon">{config.icon}</span>
      <span className="status-badge__label">{config.label}</span>
    </span>
  );
};

const TransactionRow = ({ transaction, onAction, expanded, onToggle }) => {
  const {
    transactionId,
    paymentId,
    email,
    amount,
    currency,
    status,
    provider,
    createdAt,
    metadata = {},
  } = transaction;

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const canRefund = status === "succeeded";
  const canCapture = status === "requires_capture";
  const canRetry = status === "failed";

  return (
    <>
      <tr
        className={`transaction-row ${
          expanded ? "transaction-row--expanded" : ""
        }`}
        onClick={onToggle}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}
        role="button"
        aria-expanded={expanded}
      >
        <td className="transaction-row__id">
          <div className="transaction-id">
            <span className="transaction-id__value">
              {paymentId?.slice(-8) || transactionId?.slice(-8) || "N/A"}
            </span>
            <span className="transaction-id__email">{email}</span>
          </div>
        </td>
        <td className="transaction-row__amount">
          <span className="amount-value">
            {formatCurrency(amount, currency)}
          </span>
          <span className="amount-currency">{currency}</span>
        </td>
        <td className="transaction-row__provider">
          <span className="provider-badge">
            <span className="provider-badge__icon">
              {PROVIDER_ICONS[provider] || "💳"}
            </span>
            <span className="provider-badge__name">{provider}</span>
          </span>
        </td>
        <td className="transaction-row__status">
          <StatusBadge status={status} />
        </td>
        <td className="transaction-row__date">{formattedDate}</td>
        <td className="transaction-row__actions">
          <button
            className="action-btn action-btn--icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "▲" : "▼"}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr className="transaction-details">
          <td colSpan="6">
            <div className="transaction-details__content">
              <div className="transaction-details__grid">
                <div className="detail-item">
                  <span className="detail-label">Transaction ID</span>
                  <span className="detail-value">{transactionId || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment ID</span>
                  <span className="detail-value">{paymentId || "N/A"}</span>
                </div>
                {metadata.fraudScore !== undefined && (
                  <div className="detail-item">
                    <span className="detail-label">Fraud Score</span>
                    <span
                      className={`detail-value ${
                        metadata.fraudScore > 0.7 ? "text-danger" : ""
                      }`}
                    >
                      {(metadata.fraudScore * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
                {metadata.riskLevel && (
                  <div className="detail-item">
                    <span className="detail-label">Risk Level</span>
                    <span className="detail-value">{metadata.riskLevel}</span>
                  </div>
                )}
              </div>

              <div className="transaction-details__actions">
                {canRefund && (
                  <button
                    className="action-btn action-btn--refund"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction("refund", transactionId, { amount });
                    }}
                  >
                    ↩ Refund
                  </button>
                )}
                {canCapture && (
                  <button
                    className="action-btn action-btn--capture"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction("capture", transactionId, { amount });
                    }}
                  >
                    ✓ Capture
                  </button>
                )}
                {canRetry && (
                  <button
                    className="action-btn action-btn--retry"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction("retry", transactionId);
                    }}
                  >
                    ↻ Retry
                  </button>
                )}
                <a
                  href={`/admin/payments/${transactionId}`}
                  className="action-btn action-btn--view"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details →
                </a>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const RecentTransactions = ({
  transactions = [],
  onAction,
  loading = false,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="recent-transactions recent-transactions--loading">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-row">
            <div className="skeleton skeleton--cell" />
            <div className="skeleton skeleton--cell" />
            <div className="skeleton skeleton--cell" />
          </div>
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="recent-transactions recent-transactions--empty">
        <div className="empty-state">
          <span className="empty-state__icon">📭</span>
          <p className="empty-state__text">No transactions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-transactions">
      <div className="recent-transactions__table-wrapper">
        <table className="recent-transactions__table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Amount</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Date</th>
              <th aria-label="Actions"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.transactionId || transaction._id}
                transaction={transaction}
                onAction={onAction}
                expanded={
                  expandedId === (transaction.transactionId || transaction._id)
                }
                onToggle={() =>
                  handleToggle(transaction.transactionId || transaction._id)
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

RecentTransactions.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      transactionId: PropTypes.string,
      paymentId: PropTypes.string,
      email: PropTypes.string,
      amount: PropTypes.number,
      currency: PropTypes.string,
      status: PropTypes.string,
      provider: PropTypes.string,
      createdAt: PropTypes.string,
      metadata: PropTypes.object,
    })
  ),
  onAction: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default RecentTransactions;

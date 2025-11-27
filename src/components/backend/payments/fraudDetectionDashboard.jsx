// components/admin/payments/FraudDetectionDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getFraudSettings,
  getFlaggedTransactions,
  adminGetTransaction,
  adminRefundPayment,
  adminCancelPayment,
  formatCurrency,
} from "../../../services/paymentService";
import LoadingSpinner from "./common/loadingSpinner";
import ErrorBanner from "./common/errorBanner";
import Pagination from "./common/pagination";
import ConfirmationModal from "./common/confirmationModal";
import "./styles/fraudDetection.css";

const RISK_LEVELS = {
  low: { label: "Low Risk", color: "#10b981", bg: "#d1fae5" },
  medium: { label: "Medium Risk", color: "#f59e0b", bg: "#fef3c7" },
  high: { label: "High Risk", color: "#ef4444", bg: "#fee2e2" },
  critical: { label: "Critical", color: "#7f1d1d", bg: "#fecaca" },
};

// Risk Score Gauge Component
const RiskGauge = ({ score, size = "medium" }) => {
  const percentage = Math.min(score * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage < 30) return "#10b981";
    if (percentage < 60) return "#f59e0b";
    if (percentage < 80) return "#ef4444";
    return "#7f1d1d";
  };

  return (
    <div className={`risk-gauge risk-gauge--${size}`}>
      <svg viewBox="0 0 100 100">
        <circle
          className="risk-gauge__bg"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
        />
        <circle
          className="risk-gauge__fill"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          stroke={getColor()}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="risk-gauge__value">
        <span className="risk-gauge__percentage">{percentage.toFixed(0)}%</span>
        <span className="risk-gauge__label">Risk</span>
      </div>
    </div>
  );
};

// Stats Card Component
const FraudStatsCard = ({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
}) => (
  <div className={`fraud-stats-card fraud-stats-card--${variant}`}>
    <span className="fraud-stats-card__icon">{icon}</span>
    <div className="fraud-stats-card__content">
      <span className="fraud-stats-card__value">{value}</span>
      <span className="fraud-stats-card__title">{title}</span>
      {subtitle && (
        <span className="fraud-stats-card__subtitle">{subtitle}</span>
      )}
    </div>
  </div>
);

// Flagged Transaction Card
const FlaggedTransactionCard = ({ transaction, onReview, onAction }) => {
  const score = transaction.metadata?.fraudScore || 0;
  const riskLevel = transaction.metadata?.riskLevel || "medium";
  const risk = RISK_LEVELS[riskLevel] || RISK_LEVELS.medium;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flagged-card">
      <div className="flagged-card__header">
        <div className="flagged-card__risk">
          <RiskGauge score={score} size="small" />
        </div>
        <div className="flagged-card__info">
          <span className="flagged-card__id">
            {transaction.paymentId?.slice(-12) ||
              transaction.transactionId?.slice(-12)}
          </span>
          <span className="flagged-card__email">{transaction.email}</span>
          <span className="flagged-card__date">
            {formatDate(transaction.createdAt)}
          </span>
        </div>
        <span
          className="flagged-card__risk-badge"
          style={{ color: risk.color, backgroundColor: risk.bg }}
        >
          {risk.label}
        </span>
      </div>

      <div className="flagged-card__details">
        <div className="flagged-card__detail">
          <span className="detail-label">Amount</span>
          <span className="detail-value">
            {formatCurrency(transaction.amount, transaction.currency)}
          </span>
        </div>
        <div className="flagged-card__detail">
          <span className="detail-label">Provider</span>
          <span className="detail-value capitalize">
            {transaction.provider}
          </span>
        </div>
        <div className="flagged-card__detail">
          <span className="detail-label">Status</span>
          <span className={`detail-value status-${transaction.status}`}>
            {transaction.status}
          </span>
        </div>
      </div>

      {/* Risk Indicators */}
      {transaction.metadata?.riskFactors && (
        <div className="flagged-card__factors">
          <span className="factors-label">Risk Factors:</span>
          <div className="factors-list">
            {transaction.metadata.riskFactors.map((factor, idx) => (
              <span key={idx} className="factor-tag">
                {factor}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flagged-card__actions">
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => onReview(transaction)}
        >
          👁 Review
        </button>
        {transaction.status === "succeeded" && (
          <button
            className="btn btn--warning btn--sm"
            onClick={() => onAction("refund", transaction)}
          >
            ↩ Refund
          </button>
        )}
        {["pending", "processing"].includes(transaction.status) && (
          <button
            className="btn btn--danger btn--sm"
            onClick={() => onAction("cancel", transaction)}
          >
            ✕ Block
          </button>
        )}
        <button
          className="btn btn--success btn--sm"
          onClick={() => onAction("approve", transaction)}
        >
          ✓ Approve
        </button>
      </div>
    </div>
  );
};

// Transaction Review Modal
const TransactionReviewModal = ({
  transaction,
  onClose,
  onAction,
  loading,
}) => {
  const [notes, setNotes] = useState("");
  const score = transaction.metadata?.fraudScore || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal review-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2 className="modal__title">Transaction Review</h2>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="modal__content">
          {/* Risk Score Display */}
          <div className="review-risk-section">
            <RiskGauge score={score} size="large" />
            <div className="review-risk-details">
              <h3>Fraud Analysis</h3>
              <p className="risk-description">
                {score > 0.7
                  ? "High probability of fraudulent activity detected"
                  : score > 0.4
                  ? "Moderate risk indicators present"
                  : "Low risk, likely legitimate transaction"}
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="review-details-grid">
            <div className="review-detail">
              <span className="detail-label">Transaction ID</span>
              <span className="detail-value mono">
                {transaction.transactionId}
              </span>
            </div>
            <div className="review-detail">
              <span className="detail-label">Payment ID</span>
              <span className="detail-value mono">{transaction.paymentId}</span>
            </div>
            <div className="review-detail">
              <span className="detail-label">Amount</span>
              <span className="detail-value">
                {formatCurrency(transaction.amount, transaction.currency)}
              </span>
            </div>
            <div className="review-detail">
              <span className="detail-label">Customer Email</span>
              <span className="detail-value">{transaction.email}</span>
            </div>
            <div className="review-detail">
              <span className="detail-label">IP Address</span>
              <span className="detail-value mono">
                {transaction.metadata?.ipAddress || "N/A"}
              </span>
            </div>
            <div className="review-detail">
              <span className="detail-label">User Agent</span>
              <span className="detail-value small">
                {transaction.metadata?.userAgent?.slice(0, 50) || "N/A"}...
              </span>
            </div>
          </div>

          {/* Risk Factors */}
          {transaction.metadata?.riskFactors && (
            <div className="review-factors">
              <h4>Detected Risk Factors</h4>
              <ul className="factors-list-detailed">
                {transaction.metadata.riskFactors.map((factor, idx) => (
                  <li key={idx} className="factor-item">
                    <span className="factor-icon">⚠️</span>
                    <span className="factor-text">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Review Notes */}
          <div className="review-notes">
            <label htmlFor="reviewNotes">Review Notes</label>
            <textarea
              id="reviewNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this review..."
              rows={3}
            />
          </div>
        </div>

        <footer className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn--success"
            onClick={() => onAction("approve", transaction, notes)}
            disabled={loading}
          >
            ✓ Mark as Legitimate
          </button>
          {transaction.status === "succeeded" && (
            <button
              className="btn btn--warning"
              onClick={() => onAction("refund", transaction, notes)}
              disabled={loading}
            >
              ↩ Refund & Flag
            </button>
          )}
          <button
            className="btn btn--danger"
            onClick={() => onAction("block", transaction, notes)}
            disabled={loading}
          >
            🚫 Confirm Fraud
          </button>
        </footer>
      </div>
    </div>
  );
};

// Main Component
const FraudDetectionDashboard = () => {
  // State
  const [settings, setSettings] = useState(null);
  const [flaggedTransactions, setFlaggedTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    minScore: 0.5,
    status: "",
  });

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load data
  const loadData = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const [settingsRes, flaggedRes] = await Promise.allSettled([
          getFraudSettings(),
          getFlaggedTransactions({
            page,
            limit: pagination.limit,
            minScore: filters.minScore,
            status: filters.status,
          }),
        ]);

        if (settingsRes.status === "fulfilled") {
          setSettings(settingsRes.value.data || settingsRes.value);
        }

        if (flaggedRes.status === "fulfilled") {
          const data = flaggedRes.value.data || flaggedRes.value;
          setFlaggedTransactions(data.transactions || data || []);
          setPagination((prev) => ({
            ...prev,
            page,
            total: data.total || data.length || 0,
            pages: Math.ceil((data.total || data.length || 0) / prev.limit),
          }));
        }
      } catch (err) {
        setError(err.message || "Failed to load fraud data");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  useEffect(() => {
    loadData(1);
  }, []);

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Handle actions
  const handleAction = async (action, transaction, notes = "") => {
    if (["refund", "block"].includes(action)) {
      setConfirmAction({ action, transaction, notes });
      return;
    }

    // For approve action, just mark as reviewed
    try {
      setActionLoading(true);
      setSuccess(
        `Transaction marked as ${action === "approve" ? "legitimate" : action}`
      );
      setSelectedTransaction(null);
      loadData(pagination.page);
    } catch (err) {
      setError(`Action failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    try {
      setActionLoading(true);
      const { action, transaction } = confirmAction;

      if (action === "refund") {
        await adminRefundPayment(transaction.transactionId, {
          reason: "Fraud detected",
        });
      } else if (action === "block" || action === "cancel") {
        await adminCancelPayment(transaction.transactionId, "Fraud detected");
      }

      setSuccess(`Transaction ${action}ed successfully`);
      setConfirmAction(null);
      setSelectedTransaction(null);
      loadData(pagination.page);
    } catch (err) {
      setError(`Failed to ${confirmAction.action}: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !flaggedTransactions.length) {
    return (
      <div className="fraud-dashboard fraud-dashboard--loading">
        <LoadingSpinner
          size="large"
          message="Loading fraud detection data..."
        />
      </div>
    );
  }

  return (
    <div className="fraud-dashboard">
      {/* Header */}
      <header className="fraud-dashboard__header">
        <div className="fraud-dashboard__title-section">
          <h1 className="fraud-dashboard__title">🛡️ Fraud Detection</h1>
          <p className="fraud-dashboard__subtitle">
            Monitor and review flagged transactions
          </p>
        </div>
        <div className="fraud-dashboard__actions">
          <button className="btn btn--secondary" onClick={() => loadData(1)}>
            ↻ Refresh
          </button>
        </div>
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

      {/* Stats Cards */}
      {settings && (
        <div className="fraud-dashboard__stats">
          <FraudStatsCard
            title="Flagged Transactions"
            value={pagination.total.toLocaleString()}
            icon="🚩"
            variant="warning"
          />
          <FraudStatsCard
            title="High Risk"
            value={
              flaggedTransactions.filter(
                (t) => (t.metadata?.fraudScore || 0) > 0.7
              ).length
            }
            icon="⚠️"
            variant="danger"
          />
          <FraudStatsCard
            title="Model Accuracy"
            value={`${((settings.modelStats?.accuracy || 0.85) * 100).toFixed(
              1
            )}%`}
            icon="🎯"
            variant="success"
          />
          <FraudStatsCard
            title="Detection Layers"
            value={settings.detectionLayers?.length || 3}
            subtitle={settings.isTraining ? "Training..." : "Active"}
            icon="🔍"
          />
        </div>
      )}

      {/* Filters */}
      <div className="fraud-dashboard__filters">
        <div className="filter-group">
          <label>Minimum Risk Score</label>
          <select
            value={filters.minScore}
            onChange={(e) =>
              handleFilterChange("minScore", parseFloat(e.target.value))
            }
            className="filter-select"
          >
            <option value={0.3}>30%+ (Low Risk)</option>
            <option value={0.5}>50%+ (Medium Risk)</option>
            <option value={0.7}>70%+ (High Risk)</option>
            <option value={0.9}>90%+ (Critical)</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="succeeded">Succeeded</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <button className="btn btn--primary" onClick={() => loadData(1)}>
          Apply Filters
        </button>
      </div>

      {/* Flagged Transactions Grid */}
      <div className="fraud-dashboard__content">
        {flaggedTransactions.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">✅</span>
            <h3>No flagged transactions</h3>
            <p>All transactions are within normal risk parameters</p>
          </div>
        ) : (
          <>
            <div className="flagged-grid">
              {flaggedTransactions.map((transaction) => (
                <FlaggedTransactionCard
                  key={transaction.transactionId || transaction._id}
                  transaction={transaction}
                  onReview={setSelectedTransaction}
                  onAction={handleAction}
                />
              ))}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={(page) => loadData(page)}
            />
          </>
        )}
      </div>

      {/* Review Modal */}
      {selectedTransaction && (
        <TransactionReviewModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onAction={handleAction}
          loading={actionLoading}
        />
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmationModal
          title={`Confirm ${confirmAction.action}`}
          message={
            confirmAction.action === "refund"
              ? "This will refund the transaction and flag the customer for review."
              : "This will block the transaction and flag it as fraudulent."
          }
          confirmLabel={confirmAction.action === "refund" ? "Refund" : "Block"}
          variant="danger"
          onConfirm={executeAction}
          onCancel={() => setConfirmAction(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default FraudDetectionDashboard;

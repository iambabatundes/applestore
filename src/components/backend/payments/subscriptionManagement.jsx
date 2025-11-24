// components/admin/payments/SubscriptionManagement.jsx
import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  adminGetSubscriptions,
  adminGetSubscription,
  adminForceCancelSubscription,
  getSubscriptionAnalytics,
  getChurnRate,
  getMRRAnalytics,
  exportSubscriptionsCSV,
  downloadFile,
} from "../../../services/paymentService";
import LoadingSpinner from "./common/loadingSpinner";
import ErrorBanner from "./common/errorBanner";
import Pagination from "./common/pagination";
import ConfirmationModal from "./common/confirmationModal";
import "./styles/subscriptionManagement.css";

const STATUS_CONFIG = {
  active: { label: "Active", className: "success", icon: "✓" },
  trialing: { label: "Trial", className: "info", icon: "⏳" },
  past_due: { label: "Past Due", className: "warning", icon: "⚠" },
  paused: { label: "Paused", className: "muted", icon: "⏸" },
  canceled: { label: "Canceled", className: "danger", icon: "✕" },
  unpaid: { label: "Unpaid", className: "danger", icon: "!" },
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.field]: action.value };
    case "CLEAR":
      return { status: "", planId: "", search: "", dateFrom: "", dateTo: "" };
    default:
      return state;
  }
};

// Stats Card Component
const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
}) => (
  <div className={`stats-card stats-card--${variant}`}>
    <div className="stats-card__icon">{icon}</div>
    <div className="stats-card__content">
      <span className="stats-card__value">{value}</span>
      <span className="stats-card__title">{title}</span>
      {subtitle && <span className="stats-card__subtitle">{subtitle}</span>}
    </div>
    {trend && (
      <span
        className={`stats-card__trend stats-card__trend--${trend.direction}`}
      >
        {trend.direction === "up" ? "↑" : "↓"} {trend.value}
      </span>
    )}
  </div>
);

// Subscription Row Component
const SubscriptionRow = ({ subscription, onSelect, onAction }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const status = STATUS_CONFIG[subscription.status] || {
    label: subscription.status,
    className: "default",
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount || 0);
  };

  return (
    <tr className="subscription-row" onClick={() => onSelect(subscription)}>
      <td className="subscription-row__customer">
        <div className="customer-info">
          <span className="customer-email">
            {subscription.email || subscription.userId}
          </span>
          <span className="customer-id">
            {subscription.subscriptionId?.slice(-8)}
          </span>
        </div>
      </td>
      <td className="subscription-row__plan">
        <span className="plan-name">
          {subscription.planName || subscription.planId}
        </span>
      </td>
      <td className="subscription-row__amount">
        <span className="amount">
          {formatCurrency(subscription.amount, subscription.currency)}
        </span>
        <span className="interval">/{subscription.interval || "month"}</span>
      </td>
      <td className="subscription-row__status">
        <span className={`status-badge status-badge--${status.className}`}>
          {status.icon} {status.label}
        </span>
      </td>
      <td className="subscription-row__dates">
        <div className="date-info">
          <span className="date-label">Started</span>
          <span className="date-value">
            {formatDate(subscription.startDate || subscription.createdAt)}
          </span>
        </div>
      </td>
      <td className="subscription-row__renewal">
        <div className="date-info">
          <span className="date-label">Next Billing</span>
          <span className="date-value">
            {subscription.status === "active"
              ? formatDate(
                  subscription.currentPeriodEnd || subscription.nextBillingDate
                )
              : "—"}
          </span>
        </div>
      </td>
      <td className="subscription-row__actions">
        <div className="action-menu">
          <button
            className="action-menu__trigger"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            ⋮
          </button>
          {menuOpen && (
            <>
              <div
                className="action-menu__backdrop"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                }}
              />
              <div className="action-menu__dropdown">
                <button
                  className="action-menu__item"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(subscription);
                    setMenuOpen(false);
                  }}
                >
                  👁 View Details
                </button>
                {subscription.status === "active" && (
                  <button
                    className="action-menu__item action-menu__item--danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction("cancel", subscription);
                      setMenuOpen(false);
                    }}
                  >
                    ✕ Force Cancel
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// Subscription Details Modal
const SubscriptionDetailsModal = ({
  subscription,
  onClose,
  onAction,
  loading,
}) => {
  const status = STATUS_CONFIG[subscription.status] || {
    label: subscription.status,
    className: "default",
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount || 0);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal subscription-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__header">
          <div className="modal__title-section">
            <h2 className="modal__title">Subscription Details</h2>
            <span className={`status-badge status-badge--${status.className}`}>
              {status.label}
            </span>
          </div>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="modal__content">
          {/* Plan Info */}
          <div className="subscription-plan-highlight">
            <span className="plan-name">
              {subscription.planName || subscription.planId}
            </span>
            <span className="plan-price">
              {formatCurrency(subscription.amount, subscription.currency)}
              <span className="plan-interval">
                /{subscription.interval || "month"}
              </span>
            </span>
          </div>

          {/* Details Grid */}
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Subscription ID</span>
              <span className="detail-value detail-value--mono">
                {subscription.subscriptionId}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Customer</span>
              <span className="detail-value">
                {subscription.email || subscription.userId}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Provider</span>
              <span className="detail-value capitalize">
                {subscription.provider}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created</span>
              <span className="detail-value">
                {formatDate(subscription.createdAt)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current Period Start</span>
              <span className="detail-value">
                {formatDate(subscription.currentPeriodStart)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current Period End</span>
              <span className="detail-value">
                {formatDate(subscription.currentPeriodEnd)}
              </span>
            </div>
            {subscription.canceledAt && (
              <div className="detail-item">
                <span className="detail-label">Canceled At</span>
                <span className="detail-value">
                  {formatDate(subscription.canceledAt)}
                </span>
              </div>
            )}
            {subscription.trialEnd && (
              <div className="detail-item">
                <span className="detail-label">Trial Ends</span>
                <span className="detail-value">
                  {formatDate(subscription.trialEnd)}
                </span>
              </div>
            )}
          </div>

          {/* Usage Stats */}
          {subscription.usage && (
            <div className="usage-section">
              <h4 className="section-title">Usage</h4>
              <div className="usage-grid">
                {Object.entries(subscription.usage).map(([key, value]) => (
                  <div key={key} className="usage-item">
                    <span className="usage-label">{key}</span>
                    <span className="usage-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {subscription.metadata &&
            Object.keys(subscription.metadata).length > 0 && (
              <div className="metadata-section">
                <h4 className="section-title">Metadata</h4>
                <pre className="metadata-json">
                  {JSON.stringify(subscription.metadata, null, 2)}
                </pre>
              </div>
            )}
        </div>

        <footer className="modal__footer">
          <button className="btn btn--secondary" onClick={onClose}>
            Close
          </button>
          {subscription.status === "active" && (
            <button
              className="btn btn--danger"
              onClick={() => onAction("cancel", subscription)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Force Cancel"}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

// Main Component
const SubscriptionManagement = () => {
  // Data state
  const [subscriptions, setSubscriptions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });

  // Filter state
  const [filters, dispatchFilters] = useReducer(filterReducer, {
    status: "",
    planId: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load subscriptions
  const loadSubscriptions = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        );

        const [subsRes, analyticsRes] = await Promise.allSettled([
          adminGetSubscriptions({
            ...cleanFilters,
            page,
            limit: pagination.limit,
          }),
          getSubscriptionAnalytics(),
        ]);

        if (subsRes.status === "fulfilled") {
          const data = subsRes.value.data || subsRes.value;
          setSubscriptions(data.subscriptions || data || []);
          setPagination((prev) => ({
            ...prev,
            page,
            total: data.pagination?.total || 0,
            pages: data.pagination?.pages || 0,
          }));
        }

        if (analyticsRes.status === "fulfilled") {
          setAnalytics(analyticsRes.value.data || analyticsRes.value);
        }
      } catch (err) {
        setError(err.message || "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  useEffect(() => {
    loadSubscriptions(1);
  }, []);

  // Handle actions
  const handleAction = async (action, subscription) => {
    if (action === "cancel") {
      setConfirmAction({ action, subscription });
    }
  };

  const executeAction = async () => {
    if (!confirmAction) return;

    try {
      setActionLoading(true);
      await adminForceCancelSubscription(
        confirmAction.subscription.subscriptionId
      );
      setSuccess("Subscription canceled successfully");
      setConfirmAction(null);
      setSelectedSubscription(null);
      loadSubscriptions(pagination.page);
    } catch (err) {
      setError(`Failed to cancel subscription: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportSubscriptionsCSV(filters);
      downloadFile(blob, `subscriptions_${Date.now()}.csv`);
      setSuccess("Export downloaded successfully");
    } catch (err) {
      setError(`Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  if (loading && !subscriptions.length) {
    return (
      <div className="subscription-mgmt subscription-mgmt--loading">
        <LoadingSpinner size="large" message="Loading subscriptions..." />
      </div>
    );
  }

  return (
    <div className="subscription-mgmt">
      {/* Header */}
      <header className="subscription-mgmt__header">
        <div className="subscription-mgmt__title-section">
          <h1 className="subscription-mgmt__title">Subscription Management</h1>
          <p className="subscription-mgmt__subtitle">
            {pagination.total.toLocaleString()} total subscriptions
          </p>
        </div>
        <div className="subscription-mgmt__actions">
          <button
            className="btn btn--secondary"
            onClick={() => loadSubscriptions(1)}
          >
            ↻ Refresh
          </button>
          <button
            className="btn btn--primary"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? "Exporting..." : "📥 Export CSV"}
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

      {/* Analytics Cards */}
      {analytics && (
        <div className="subscription-mgmt__stats">
          <StatsCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(
              analytics.mrr || analytics.monthlyRevenue || 0
            )}
            icon="💰"
            variant="primary"
            trend={{ direction: "up", value: "12%" }}
          />
          <StatsCard
            title="Active Subscriptions"
            value={analytics.activeCount?.toLocaleString() || "0"}
            icon="✓"
            variant="success"
          />
          <StatsCard
            title="Churn Rate"
            value={`${(analytics.churnRate || 0).toFixed(1)}%`}
            icon="📉"
            variant={analytics.churnRate > 5 ? "danger" : "default"}
          />
          <StatsCard
            title="Avg. Revenue per User"
            value={formatCurrency(analytics.arpu || 0)}
            icon="👤"
          />
        </div>
      )}

      {/* Filters */}
      <div className="subscription-mgmt__filters">
        <div className="filter-group filter-group--search">
          <input
            type="text"
            placeholder="Search by email or ID..."
            value={filters.search}
            onChange={(e) =>
              dispatchFilters({
                type: "SET_FILTER",
                field: "search",
                value: e.target.value,
              })
            }
            className="filter-input"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) =>
            dispatchFilters({
              type: "SET_FILTER",
              field: "status",
              value: e.target.value,
            })
          }
          className="filter-select"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <button
          className="btn btn--secondary"
          onClick={() => loadSubscriptions(1)}
        >
          Apply
        </button>
        <button
          className="btn btn--secondary"
          onClick={() => {
            dispatchFilters({ type: "CLEAR" });
            setTimeout(() => loadSubscriptions(1), 0);
          }}
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="subscription-mgmt__content">
        {subscriptions.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">📭</span>
            <h3>No subscriptions found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="subscription-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Started</th>
                    <th>Next Billing</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <SubscriptionRow
                      key={sub.subscriptionId || sub._id}
                      subscription={sub}
                      onSelect={setSelectedSubscription}
                      onAction={handleAction}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={(page) => loadSubscriptions(page)}
            />
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedSubscription && (
        <SubscriptionDetailsModal
          subscription={selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
          onAction={handleAction}
          loading={actionLoading}
        />
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmationModal
          title="Cancel Subscription"
          message={`Are you sure you want to force cancel this subscription? This action cannot be undone.`}
          confirmLabel="Force Cancel"
          variant="danger"
          onConfirm={executeAction}
          onCancel={() => setConfirmAction(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default SubscriptionManagement;

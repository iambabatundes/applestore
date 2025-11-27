// WebhookLogsViewer.jsx
import React, { useState, useEffect, useCallback, useReducer } from "react";
import { getWebhookLogs, retryWebhook } from "../../../services/paymentService";
import LoadingSpinner from "./common/loadingSpinner";
import ErrorBanner from "./common/errorBanner";
import Pagination from "./common/pagination";
import ConfirmationModal from "./common/confirmationModal";
import "./styles/webhookLogs.css";

const STATUS_CONFIG = {
  success: { label: "Success", className: "success", icon: "✓" },
  failed: { label: "Failed", className: "danger", icon: "✕" },
  pending: { label: "Pending", className: "warning", icon: "⏳" },
  processing: { label: "Processing", className: "info", icon: "⟳" },
  retrying: { label: "Retrying", className: "warning", icon: "↻" },
};

const EVENT_TYPES = {
  "payment_intent.succeeded": { label: "Payment Succeeded", icon: "💰" },
  "payment_intent.failed": { label: "Payment Failed", icon: "❌" },
  "charge.refunded": { label: "Charge Refunded", icon: "↩️" },
  "customer.subscription.created": {
    label: "Subscription Created",
    icon: "📦",
  },
  "customer.subscription.updated": {
    label: "Subscription Updated",
    icon: "🔄",
  },
  "customer.subscription.deleted": {
    label: "Subscription Deleted",
    icon: "🗑️",
  },
  "invoice.paid": { label: "Invoice Paid", icon: "📄" },
  "invoice.payment_failed": { label: "Invoice Failed", icon: "⚠️" },
};

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.field]: action.value };
    case "CLEAR":
      return {
        status: "",
        provider: "",
        eventType: "",
        dateFrom: "",
        dateTo: "",
      };
    default:
      return state;
  }
};

// Webhook Log Row Component
const WebhookLogRow = ({ log, onSelect, onRetry, expanded, onToggle }) => {
  const status = STATUS_CONFIG[log.status] || {
    label: log.status,
    className: "default",
    icon: "?",
  };
  const eventConfig = EVENT_TYPES[log.eventType] || {
    label: log.eventType,
    icon: "📨",
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const canRetry = log.status === "failed";

  return (
    <>
      <tr
        className={`webhook-row ${expanded ? "webhook-row--expanded" : ""} ${
          log.status === "failed" ? "webhook-row--failed" : ""
        }`}
        onClick={onToggle}
      >
        <td className="webhook-row__status">
          <span
            className={`status-indicator status-indicator--${status.className}`}
          >
            {status.icon}
          </span>
        </td>
        <td className="webhook-row__event">
          <div className="event-info">
            <span className="event-icon">{eventConfig.icon}</span>
            <div className="event-details">
              <span className="event-type">{eventConfig.label}</span>
              <span className="event-id">
                {log.webhookId?.slice(-12) || log._id?.slice(-12)}
              </span>
            </div>
          </div>
        </td>
        <td className="webhook-row__provider">
          <span className="provider-badge">{log.provider}</span>
        </td>
        <td className="webhook-row__timestamp">
          <span className="timestamp">
            {formatDate(log.receivedAt || log.createdAt)}
          </span>
        </td>
        <td className="webhook-row__duration">
          <span className="duration">
            {log.processingTime ? `${log.processingTime}ms` : "—"}
          </span>
        </td>
        <td className="webhook-row__attempts">
          <span
            className={`attempts ${
              log.attempts > 1 ? "attempts--multiple" : ""
            }`}
          >
            {log.attempts || 1}
          </span>
        </td>
        <td className="webhook-row__actions">
          <button
            className="action-btn"
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
        <tr className="webhook-details-row">
          <td colSpan="7">
            <div className="webhook-details">
              <div className="webhook-details__grid">
                <div className="detail-section">
                  <h4>Webhook Information</h4>
                  <div className="detail-item">
                    <span className="detail-label">Webhook ID</span>
                    <span className="detail-value mono">
                      {log.webhookId || log._id}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Event Type</span>
                    <span className="detail-value">{log.eventType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Provider</span>
                    <span className="detail-value capitalize">
                      {log.provider}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Received At</span>
                    <span className="detail-value">
                      {formatDate(log.receivedAt || log.createdAt)}
                    </span>
                  </div>
                  {log.processedAt && (
                    <div className="detail-item">
                      <span className="detail-label">Processed At</span>
                      <span className="detail-value">
                        {formatDate(log.processedAt)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h4>Processing Details</h4>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className={`detail-value status-${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Attempts</span>
                    <span className="detail-value">{log.attempts || 1}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Processing Time</span>
                    <span className="detail-value">
                      {log.processingTime ? `${log.processingTime}ms` : "N/A"}
                    </span>
                  </div>
                  {log.nextRetryAt && (
                    <div className="detail-item">
                      <span className="detail-label">Next Retry</span>
                      <span className="detail-value">
                        {formatDate(log.nextRetryAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {log.error && (
                <div className="error-section">
                  <h4>Error Details</h4>
                  <div className="error-message">
                    <code>{log.error.message || log.error}</code>
                  </div>
                  {log.error.stack && (
                    <details className="error-stack">
                      <summary>Stack Trace</summary>
                      <pre>{log.error.stack}</pre>
                    </details>
                  )}
                </div>
              )}

              {/* Request/Response Payload */}
              <div className="payload-section">
                <div className="payload-tabs">
                  <details className="payload-details">
                    <summary>Request Payload</summary>
                    <pre className="payload-json">
                      {JSON.stringify(
                        log.payload || log.requestBody || {},
                        null,
                        2
                      )}
                    </pre>
                  </details>
                  {log.response && (
                    <details className="payload-details">
                      <summary>Response</summary>
                      <pre className="payload-json">
                        {JSON.stringify(log.response, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="webhook-details__actions">
                <button
                  className="btn btn--secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
                  }}
                >
                  📋 Copy Log
                </button>
                {canRetry && (
                  <button
                    className="btn btn--primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRetry(log);
                    }}
                  >
                    ↻ Retry Webhook
                  </button>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// Stats Summary Component
const WebhookStats = ({ logs }) => {
  const stats = {
    total: logs.length,
    success: logs.filter((l) => l.status === "success").length,
    failed: logs.filter((l) => l.status === "failed").length,
    avgTime:
      logs.reduce((sum, l) => sum + (l.processingTime || 0), 0) /
      (logs.length || 1),
  };

  const successRate = stats.total > 0 ? (stats.success / stats.total) * 100 : 0;

  return (
    <div className="webhook-stats">
      <div className="webhook-stat">
        <span className="webhook-stat__value">{stats.total}</span>
        <span className="webhook-stat__label">Total Webhooks</span>
      </div>
      <div className="webhook-stat webhook-stat--success">
        <span className="webhook-stat__value">{stats.success}</span>
        <span className="webhook-stat__label">Successful</span>
      </div>
      <div className="webhook-stat webhook-stat--danger">
        <span className="webhook-stat__value">{stats.failed}</span>
        <span className="webhook-stat__label">Failed</span>
      </div>
      <div className="webhook-stat">
        <span className="webhook-stat__value">{successRate.toFixed(1)}%</span>
        <span className="webhook-stat__label">Success Rate</span>
      </div>
      <div className="webhook-stat">
        <span className="webhook-stat__value">
          {stats.avgTime.toFixed(0)}ms
        </span>
        <span className="webhook-stat__label">Avg. Processing</span>
      </div>
    </div>
  );
};

// Main Component
const WebhookLogsViewer = () => {
  // State
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });
  const [filters, dispatchFilters] = useReducer(filterReducer, {
    status: "",
    provider: "",
    eventType: "",
    dateFrom: "",
    dateTo: "",
  });

  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmRetry, setConfirmRetry] = useState(null);
  const [retryLoading, setRetryLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Load logs
  const loadLogs = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        );

        const response = await getWebhookLogs({
          ...cleanFilters,
          page,
          limit: pagination.limit,
        });

        const data = response.data || response;
        setLogs(data.logs || data || []);
        setPagination((prev) => ({
          ...prev,
          page,
          total: data.pagination?.total || data.total || 0,
          pages:
            data.pagination?.pages || Math.ceil((data.total || 0) / prev.limit),
        }));
      } catch (err) {
        setError(err.message || "Failed to load webhook logs");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  useEffect(() => {
    loadLogs(1);
  }, []);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => loadLogs(pagination.page), 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, pagination.page, loadLogs]);

  // Handle retry
  const handleRetry = async () => {
    if (!confirmRetry) return;

    try {
      setRetryLoading(true);
      await retryWebhook(confirmRetry.webhookId || confirmRetry._id);
      setSuccess("Webhook retry initiated successfully");
      setConfirmRetry(null);
      loadLogs(pagination.page);
    } catch (err) {
      setError(`Retry failed: ${err.message}`);
    } finally {
      setRetryLoading(false);
    }
  };

  // Get unique providers and event types from logs
  const providers = [...new Set(logs.map((l) => l.provider).filter(Boolean))];
  const eventTypes = [...new Set(logs.map((l) => l.eventType).filter(Boolean))];

  return (
    <div className="webhook-logs">
      {/* Header */}
      <header className="webhook-logs__header">
        <div className="webhook-logs__title-section">
          <h1 className="webhook-logs__title">🔗 Webhook Logs</h1>
          <p className="webhook-logs__subtitle">
            Monitor incoming webhook events from payment providers
          </p>
        </div>
        <div className="webhook-logs__actions">
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto-refresh</span>
          </label>
          <button className="btn btn--secondary" onClick={() => loadLogs(1)}>
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

      {/* Stats */}
      {logs.length > 0 && <WebhookStats logs={logs} />}

      {/* Filters */}
      <div className="webhook-logs__filters">
        <div className="filter-group">
          <label>Status</label>
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
        </div>
        <div className="filter-group">
          <label>Provider</label>
          <select
            value={filters.provider}
            onChange={(e) =>
              dispatchFilters({
                type: "SET_FILTER",
                field: "provider",
                value: e.target.value,
              })
            }
            className="filter-select"
          >
            <option value="">All Providers</option>
            {providers.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Event Type</label>
          <select
            value={filters.eventType}
            onChange={(e) =>
              dispatchFilters({
                type: "SET_FILTER",
                field: "eventType",
                value: e.target.value,
              })
            }
            className="filter-select"
          >
            <option value="">All Events</option>
            {eventTypes.map((e) => (
              <option key={e} value={e}>
                {EVENT_TYPES[e]?.label || e}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn--primary" onClick={() => loadLogs(1)}>
          Apply
        </button>
        <button
          className="btn btn--secondary"
          onClick={() => {
            dispatchFilters({ type: "CLEAR" });
            setTimeout(() => loadLogs(1), 0);
          }}
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="webhook-logs__content">
        {loading && !logs.length ? (
          <div className="webhook-logs__loading">
            <LoadingSpinner message="Loading webhook logs..." />
          </div>
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">📭</span>
            <h3>No webhook logs found</h3>
            <p>Webhook events will appear here when received</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="webhook-table">
                <thead>
                  <tr>
                    <th className="th-status">Status</th>
                    <th>Event</th>
                    <th>Provider</th>
                    <th>Received</th>
                    <th>Duration</th>
                    <th>Attempts</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <WebhookLogRow
                      key={log.webhookId || log._id}
                      log={log}
                      expanded={expandedId === (log.webhookId || log._id)}
                      onToggle={() =>
                        setExpandedId(
                          expandedId === (log.webhookId || log._id)
                            ? null
                            : log.webhookId || log._id
                        )
                      }
                      onRetry={setConfirmRetry}
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
              onPageChange={(page) => loadLogs(page)}
            />
          </>
        )}
      </div>

      {/* Retry Confirmation */}
      {confirmRetry && (
        <ConfirmationModal
          title="Retry Webhook"
          message="This will re-process the webhook event. Are you sure?"
          confirmLabel="Retry"
          variant="warning"
          onConfirm={handleRetry}
          onCancel={() => setConfirmRetry(null)}
          loading={retryLoading}
        />
      )}
    </div>
  );
};

export default WebhookLogsViewer;

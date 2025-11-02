import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  Settings,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  X,
  Save,
  Key,
  Shield,
  AlertTriangle,
  RotateCw,
} from "lucide-react";
import "../backend/styles/payments.css";

const paymentService = {
  getTransactions: async (filters) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      data: {
        transactions: [
          {
            id: "1",
            userId: "user123",
            email: "john@example.com",
            provider: "stripe",
            amount: 150.0,
            currency: "USD",
            status: "succeeded",
            createdAt: "2025-10-20T10:30:00Z",
            paymentId: "pi_1234567890",
          },
          {
            id: "2",
            userId: "user456",
            email: "jane@example.com",
            provider: "paystack",
            amount: 50000,
            currency: "NGN",
            status: "pending",
            createdAt: "2025-10-20T09:15:00Z",
            paymentId: "ref_9876543210",
          },
        ],
        pagination: {
          total: 127,
          page: 1,
          pages: 13,
          limit: 10,
        },
      },
    };
  },
  getPaymentStats: async (params) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      data: {
        totalRevenue: 45678.9,
        totalTransactions: 127,
        successRate: 94.5,
        activeUsers: 89,
      },
    };
  },
  getPaymentConfig: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      data: {
        stripe: {
          enabled: true,
          secretKey: "sk_test_***",
          publicKey: "pk_test_***",
          webhookSecret: "whsec_***",
        },
        paystack: {
          enabled: true,
          secretKey: "sk_test_***",
          publicKey: "pk_test_***",
        },
        paypal: {
          enabled: true,
          clientId: "AYSq3***",
          clientSecret: "EIztnW***",
          mode: "sandbox",
        },
        payoneer: {
          enabled: false,
          apiUsername: "",
          apiPassword: "",
          partnerId: "",
        },
      },
    };
  },
  updatePaymentConfig: async (provider, config) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { data: { success: true } };
  },
  exportTransactionsCSV: async (filters) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return new Blob(["CSV data"], { type: "text/csv" });
  },
  downloadFile: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
  formatCurrency: (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  },
};

// Notification Hook
const useNotification = () => {
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  const showNotification = useCallback((type, message, duration = 3000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotification({ type, message });

    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, duration);
  }, []);

  const hideNotification = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setNotification(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { notification, showNotification, hideNotification };
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <AlertTriangle size={48} color="#ef4444" />
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Retry Logic Utility
const withRetry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export default function PaymentAdminDashboard() {
  // State Management
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerConfigs, setProviderConfigs] = useState({});
  const [configLoading, setConfigLoading] = useState({});
  const [retryCount, setRetryCount] = useState(0);

  const { notification, showNotification, hideNotification } =
    useNotification();

  // Filters with debouncing
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    provider: "all",
    dateFrom: "",
    dateTo: "",
    page: 1,
    limit: 10,
  });

  // Cache for reducing API calls
  const cacheRef = useRef({
    stats: null,
    statsTimestamp: null,
    config: null,
    configTimestamp: null,
  });

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Debounced search
  const searchTimeoutRef = useRef(null);
  const handleSearchChange = useCallback((value) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    }, 500);
  }, []);

  // Load Dashboard Data with Error Handling and Caching
  const loadDashboardData = useCallback(
    async (forceRefresh = false) => {
      setLoading(true);
      setError(null);

      try {
        const now = Date.now();
        const promises = [];

        // Load transactions
        promises.push(
          withRetry(() => paymentService.getTransactions(filters)).then(
            (response) => response.data
          )
        );

        // Load stats with cache
        if (
          forceRefresh ||
          !cacheRef.current.stats ||
          now - cacheRef.current.statsTimestamp > CACHE_DURATION
        ) {
          promises.push(
            withRetry(() =>
              paymentService.getPaymentStats({
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo,
              })
            ).then((response) => {
              cacheRef.current.stats = response.data;
              cacheRef.current.statsTimestamp = now;
              return response.data;
            })
          );
        } else {
          promises.push(Promise.resolve(cacheRef.current.stats));
        }

        // Load config with cache
        if (
          forceRefresh ||
          !cacheRef.current.config ||
          now - cacheRef.current.configTimestamp > CACHE_DURATION
        ) {
          promises.push(
            withRetry(() => paymentService.getPaymentConfig()).then(
              (response) => {
                cacheRef.current.config = response.data;
                cacheRef.current.configTimestamp = now;
                return response.data;
              }
            )
          );
        } else {
          promises.push(Promise.resolve(cacheRef.current.config));
        }

        const [transactionsData, statsData, configData] = await Promise.all(
          promises
        );

        setTransactions(transactionsData.transactions || []);
        setPagination(
          transactionsData.pagination || {
            total: 0,
            page: 1,
            pages: 1,
            limit: 10,
          }
        );
        setStats(statsData);
        setProviderConfigs(configData);
        setRetryCount(0);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError(err.message || "Failed to load dashboard data");
        showNotification(
          "error",
          "Failed to load dashboard data. Click refresh to try again."
        );

        // Retry logic
        if (retryCount < 2) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            loadDashboardData(forceRefresh);
          }, 2000 * (retryCount + 1));
        }
      } finally {
        setLoading(false);
      }
    },
    [filters, retryCount, showNotification]
  );

  // Load data on mount and filter change
  useEffect(() => {
    loadDashboardData();
  }, [
    filters.page,
    filters.status,
    filters.provider,
    filters.dateFrom,
    filters.dateTo,
  ]);

  // Debounced search effect
  useEffect(() => {
    if (filters.search) {
      loadDashboardData();
    }
  }, [filters.search]);

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  // Export functionality with error handling
  const handleExport = async () => {
    try {
      showNotification("info", "Preparing export...");

      const blob = await withRetry(() =>
        paymentService.exportTransactionsCSV(filters)
      );

      const filename = `transactions_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      paymentService.downloadFile(blob, filename);

      showNotification("success", "Export completed successfully!");
    } catch (err) {
      console.error("Export error:", err);
      showNotification("error", "Export failed. Please try again.");
    }
  };

  // Save provider configuration
  const handleSaveProviderConfig = async () => {
    if (!selectedProvider) return;

    setConfigLoading((prev) => ({ ...prev, [selectedProvider]: true }));

    try {
      await withRetry(() =>
        paymentService.updatePaymentConfig(
          selectedProvider,
          providerConfigs[selectedProvider]
        )
      );

      // Invalidate cache
      cacheRef.current.config = null;
      cacheRef.current.configTimestamp = null;

      showNotification(
        "success",
        `${
          selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)
        } configuration updated successfully!`
      );

      setShowConfigModal(false);
      setSelectedProvider(null);

      // Reload config
      loadDashboardData(true);
    } catch (err) {
      console.error("Config update error:", err);
      showNotification(
        "error",
        err.message || "Failed to update configuration. Please try again."
      );
    } finally {
      setConfigLoading((prev) => ({ ...prev, [selectedProvider]: false }));
    }
  };

  // Handle provider config change
  const handleProviderConfigChange = useCallback((provider, field, value) => {
    setProviderConfigs((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value,
      },
    }));
  }, []);

  // Utility functions
  const getStatusIcon = (status) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="status-icon success" />;
      case "failed":
        return <XCircle className="status-icon error" />;
      case "pending":
        return <Clock className="status-icon warning" />;
      case "refunded":
        return <ArrowDownRight className="status-icon info" />;
      default:
        return <AlertCircle className="status-icon" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ErrorBoundary>
      <div className="payment-dashboard">
        {/* Notification Toast */}
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.type === "success" && <CheckCircle size={20} />}
            {notification.type === "error" && <XCircle size={20} />}
            {notification.type === "info" && <AlertCircle size={20} />}
            <span>{notification.message}</span>
            <button
              onClick={hideNotification}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div>
              <h1>Payment Management</h1>
              <p>Manage all payment transactions and gateway configurations</p>
            </div>
            <button
              className="btn-primary"
              onClick={() => {
                setSelectedProvider(Object.keys(providerConfigs)[0]);
                setShowConfigModal(true);
              }}
            >
              <Settings size={20} />
              Configure Gateways
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>
          <button
            className={activeTab === "analytics" ? "active" : ""}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>

        {/* Error Display */}
        {error && !loading && (
          <div
            style={{
              padding: "20px",
              margin: "20px 40px",
              background: "#fef2f2",
              border: "2px solid #ef4444",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <AlertTriangle color="#ef4444" />
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={() => loadDashboardData(true)}
              style={{
                padding: "8px 16px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RotateCw size={16} />
              Retry
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="dashboard-main">
          {activeTab === "overview" && (
            <div className="overview-section">
              {loading && !stats ? (
                <div className="loading-state">
                  <RefreshCw className="spinner" size={40} />
                  <p>Loading overview...</p>
                </div>
              ) : stats ? (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon revenue">
                        <DollarSign size={24} />
                      </div>
                      <div className="stat-content">
                        <p className="stat-label">Total Revenue</p>
                        <h2 className="stat-value">
                          ${stats.totalRevenue.toLocaleString()}
                        </h2>
                        <span className="stat-change positive">
                          <ArrowUpRight size={16} /> 12.5% from last month
                        </span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon transactions">
                        <CreditCard size={24} />
                      </div>
                      <div className="stat-content">
                        <p className="stat-label">Total Transactions</p>
                        <h2 className="stat-value">
                          {stats.totalTransactions}
                        </h2>
                        <span className="stat-change positive">
                          <ArrowUpRight size={16} /> 8.3% from last month
                        </span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon success-rate">
                        <TrendingUp size={24} />
                      </div>
                      <div className="stat-content">
                        <p className="stat-label">Success Rate</p>
                        <h2 className="stat-value">{stats.successRate}%</h2>
                        <span className="stat-change positive">
                          <ArrowUpRight size={16} /> 2.1% from last month
                        </span>
                      </div>
                    </div>

                    <div className="stat-card">
                      <div className="stat-icon users">
                        <Users size={24} />
                      </div>
                      <div className="stat-content">
                        <p className="stat-label">Active Users</p>
                        <h2 className="stat-value">{stats.activeUsers}</h2>
                        <span className="stat-change negative">
                          <ArrowDownRight size={16} /> 3.2% from last month
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="provider-status">
                    <h3>Payment Gateway Status</h3>
                    <div className="provider-cards">
                      {Object.entries(providerConfigs).map(
                        ([provider, config]) => (
                          <div key={provider} className="provider-card">
                            <div className="provider-header">
                              <h4>
                                {provider.charAt(0).toUpperCase() +
                                  provider.slice(1)}
                              </h4>
                              <span
                                className={`status-badge ${
                                  config.enabled ? "active" : "inactive"
                                }`}
                              >
                                {config.enabled ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <button
                              className="btn-secondary-small"
                              onClick={() => {
                                setSelectedProvider(provider);
                                setShowConfigModal(true);
                              }}
                            >
                              Configure
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="transactions-section">
              {/* Filters */}
              <div className="filters-bar">
                <div className="search-box">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search by email, payment ID..."
                    defaultValue={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="succeeded">Succeeded</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>

                <select
                  value={filters.provider}
                  onChange={(e) =>
                    handleFilterChange("provider", e.target.value)
                  }
                  className="filter-select"
                >
                  <option value="all">All Providers</option>
                  {Object.keys(providerConfigs).map((provider) => (
                    <option key={provider} value={provider}>
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </option>
                  ))}
                </select>

                <div className="date-filters">
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    className="date-input"
                  />
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    className="date-input"
                  />
                </div>

                <button
                  className="btn-icon"
                  onClick={() => loadDashboardData(true)}
                  title="Refresh"
                  disabled={loading}
                >
                  <RefreshCw size={20} className={loading ? "spinner" : ""} />
                </button>

                <button
                  className="btn-icon"
                  onClick={handleExport}
                  title="Export"
                  disabled={loading || transactions.length === 0}
                >
                  <Download size={20} />
                </button>
              </div>

              {/* Transactions Table */}
              <div className="table-container">
                {loading ? (
                  <div className="loading-state">
                    <RefreshCw className="spinner" size={40} />
                    <p>Loading transactions...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="loading-state">
                    <AlertCircle size={40} color="#9ca3af" />
                    <p>No transactions found</p>
                  </div>
                ) : (
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Payment ID</th>
                        <th>User Email</th>
                        <th>Amount</th>
                        <th>Provider</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="payment-id">
                            {transaction.paymentId}
                          </td>
                          <td>{transaction.email}</td>
                          <td className="amount">
                            {paymentService.formatCurrency(
                              transaction.amount,
                              transaction.currency
                            )}
                          </td>
                          <td>
                            <span
                              className={`provider-badge ${transaction.provider}`}
                            >
                              {transaction.provider}
                            </span>
                          </td>
                          <td>
                            <div className="status-cell">
                              {getStatusIcon(transaction.status)}
                              <span
                                className={`status-text ${transaction.status}`}
                              >
                                {transaction.status}
                              </span>
                            </div>
                          </td>
                          <td className="date-cell">
                            {formatDate(transaction.createdAt)}
                          </td>
                          <td>
                            <button
                              className="btn-view"
                              onClick={() =>
                                setSelectedTransaction(transaction)
                              }
                            >
                              <Eye size={16} /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    disabled={pagination.page === 1 || loading}
                    onClick={() =>
                      handleFilterChange("page", pagination.page - 1)
                    }
                  >
                    Previous
                  </button>
                  <span>
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    disabled={pagination.page === pagination.pages || loading}
                    onClick={() =>
                      handleFilterChange("page", pagination.page + 1)
                    }
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="analytics-section">
              <h2>Analytics Dashboard</h2>
              <p className="coming-soon">
                Advanced analytics and charts coming soon...
              </p>
            </div>
          )}
        </main>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedTransaction(null)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Transaction Details</h3>
                <button
                  className="btn-close"
                  onClick={() => setSelectedTransaction(null)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-row">
                  <span className="detail-label">Payment ID:</span>
                  <span className="detail-value">
                    {selectedTransaction.paymentId}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">User Email:</span>
                  <span className="detail-value">
                    {selectedTransaction.email}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value amount-large">
                    {paymentService.formatCurrency(
                      selectedTransaction.amount,
                      selectedTransaction.currency
                    )}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Provider:</span>
                  <span
                    className={`provider-badge ${selectedTransaction.provider}`}
                  >
                    {selectedTransaction.provider}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <div className="status-cell">
                    {getStatusIcon(selectedTransaction.status)}
                    <span
                      className={`status-text ${selectedTransaction.status}`}
                    >
                      {selectedTransaction.status}
                    </span>
                  </div>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Created:</span>
                  <span className="detail-value">
                    {formatDate(selectedTransaction.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Provider Config Modal */}
        {showConfigModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowConfigModal(false)}
          >
            <div
              className="modal-content config-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>
                  <Shield size={24} />
                  Payment Gateway Configuration
                </h3>
                <button
                  className="btn-close"
                  onClick={() => setShowConfigModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="provider-tabs">
                  {Object.keys(providerConfigs).map((provider) => (
                    <button
                      key={provider}
                      className={selectedProvider === provider ? "active" : ""}
                      onClick={() => setSelectedProvider(provider)}
                    >
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </button>
                  ))}
                </div>

                {selectedProvider && providerConfigs[selectedProvider] && (
                  <div className="config-form">
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={providerConfigs[selectedProvider].enabled}
                          onChange={(e) =>
                            handleProviderConfigChange(
                              selectedProvider,
                              "enabled",
                              e.target.checked
                            )
                          }
                        />
                        Enable{" "}
                        {selectedProvider.charAt(0).toUpperCase() +
                          selectedProvider.slice(1)}
                      </label>
                    </div>

                    {Object.entries(providerConfigs[selectedProvider])
                      .filter(([key]) => key !== "enabled")
                      .map(([key, value]) => (
                        <div key={key} className="form-group">
                          <label>
                            <Key size={16} />
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </label>
                          <input
                            type={
                              key.toLowerCase().includes("secret") ||
                              key.toLowerCase().includes("password")
                                ? "password"
                                : "text"
                            }
                            value={value}
                            onChange={(e) =>
                              handleProviderConfigChange(
                                selectedProvider,
                                key,
                                e.target.value
                              )
                            }
                            placeholder={`Enter ${key}`}
                          />
                        </div>
                      ))}

                    <div className="form-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => setShowConfigModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-primary"
                        onClick={handleSaveProviderConfig}
                        disabled={configLoading[selectedProvider]}
                      >
                        {configLoading[selectedProvider] ? (
                          <>
                            <RefreshCw size={20} className="spinner" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={20} />
                            Save Configuration
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

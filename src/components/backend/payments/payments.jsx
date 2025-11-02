import React, { useState, useEffect } from "react";
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
} from "lucide-react";

// Mock API calls - Replace with actual API endpoints
const mockAPI = {
  fetchTransactions: async (filters) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const transactions = [
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
      {
        id: "3",
        userId: "user789",
        email: "bob@example.com",
        provider: "paypal",
        amount: 250.0,
        currency: "USD",
        status: "succeeded",
        createdAt: "2025-10-19T14:20:00Z",
        paymentId: "PAYPAL_12345",
      },
      {
        id: "4",
        userId: "user321",
        email: "alice@example.com",
        provider: "stripe",
        amount: 99.99,
        currency: "EUR",
        status: "failed",
        createdAt: "2025-10-19T11:45:00Z",
        paymentId: "pi_9999999999",
      },
      {
        id: "5",
        userId: "user654",
        email: "charlie@example.com",
        provider: "paystack",
        amount: 75000,
        currency: "NGN",
        status: "refunded",
        createdAt: "2025-10-18T16:00:00Z",
        paymentId: "ref_1111111111",
      },
    ];

    return { transactions, total: 127 };
  },

  fetchStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      totalRevenue: 45678.9,
      totalTransactions: 127,
      successRate: 94.5,
      activeUsers: 89,
    };
  },

  fetchProviderConfig: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
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
        webhookSecret: "whsec_***",
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
    };
  },

  updateProviderConfig: async (provider, config) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },

  exportTransactions: async (filters) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, url: "/downloads/transactions.csv" };
  },
};

export default function PaymentAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerConfigs, setProviderConfigs] = useState({});
  const [notification, setNotification] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    provider: "all",
    dateFrom: "",
    dateTo: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [transactionsData, statsData, configData] = await Promise.all([
        mockAPI.fetchTransactions(filters),
        mockAPI.fetchStats(),
        mockAPI.fetchProviderConfig(),
      ]);

      setTransactions(transactionsData.transactions);
      setStats(statsData);
      setProviderConfigs(configData);
    } catch (error) {
      showNotification("error", "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleExport = async () => {
    try {
      showNotification("info", "Exporting transactions...");
      const result = await mockAPI.exportTransactions(filters);
      if (result.success) {
        showNotification("success", "Export completed successfully!");
      }
    } catch (error) {
      showNotification("error", "Export failed");
    }
  };

  const handleSaveProviderConfig = async () => {
    try {
      await mockAPI.updateProviderConfig(
        selectedProvider,
        providerConfigs[selectedProvider]
      );
      showNotification(
        "success",
        `${selectedProvider} configuration updated successfully!`
      );
      setShowConfigModal(false);
    } catch (error) {
      showNotification("error", "Failed to update configuration");
    }
  };

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

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
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
    <div className="payment-dashboard">
      {/* Notification Toast */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === "success" && <CheckCircle size={20} />}
          {notification.type === "error" && <XCircle size={20} />}
          {notification.type === "info" && <AlertCircle size={20} />}
          <span>{notification.message}</span>
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
            onClick={() => setShowConfigModal(true)}
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

      {/* Main Content */}
      <main className="dashboard-main">
        {activeTab === "overview" && stats && (
          <div className="overview-section">
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
                  <h2 className="stat-value">{stats.totalTransactions}</h2>
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
                {Object.entries(providerConfigs).map(([provider, config]) => (
                  <div key={provider} className="provider-card">
                    <div className="provider-header">
                      <h4>
                        {provider.charAt(0).toUpperCase() + provider.slice(1)}
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
                ))}
              </div>
            </div>
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
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
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
                onChange={(e) => handleFilterChange("provider", e.target.value)}
                className="filter-select"
              >
                <option value="all">All Providers</option>
                <option value="stripe">Stripe</option>
                <option value="paystack">Paystack</option>
                <option value="paypal">PayPal</option>
                <option value="payoneer">Payoneer</option>
              </select>

              <div className="date-filters">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                  className="date-input"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="date-input"
                  placeholder="To"
                />
              </div>

              <button
                className="btn-icon"
                onClick={loadDashboardData}
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>

              <button
                className="btn-icon"
                onClick={handleExport}
                title="Export"
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
                        <td className="payment-id">{transaction.paymentId}</td>
                        <td>{transaction.email}</td>
                        <td className="amount">
                          {formatCurrency(
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
                            onClick={() => setSelectedTransaction(transaction)}
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
            <div className="pagination">
              <button
                disabled={filters.page === 1}
                onClick={() => handleFilterChange("page", filters.page - 1)}
              >
                Previous
              </button>
              <span>Page {filters.page} of 13</span>
              <button
                onClick={() => handleFilterChange("page", filters.page + 1)}
              >
                Next
              </button>
            </div>
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
                  {formatCurrency(
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
                  <span className={`status-text ${selectedTransaction.status}`}>
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
                          setProviderConfigs((prev) => ({
                            ...prev,
                            [selectedProvider]: {
                              ...prev[selectedProvider],
                              enabled: e.target.checked,
                            },
                          }))
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
                            setProviderConfigs((prev) => ({
                              ...prev,
                              [selectedProvider]: {
                                ...prev[selectedProvider],
                                [key]: e.target.value,
                              },
                            }))
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
                    >
                      <Save size={20} />
                      Save Configuration
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

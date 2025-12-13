import React, { useState, useEffect } from "react";
import {
  getUserTransactions,
  getUserPaymentStats,
  retryPayment,
  cancelPayment,
  getPaymentStatus,
  formatCurrency,
} from "../../../services/paymentService";
import PaymentSettings from "./paymentSettings";
import "./styles/myPayment.css";

export default function MyPayment({ user }) {
  const [activeTab, setActiveTab] = useState("transactions");
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
    provider: "",
    search: "",
  });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [transactionsData, statsData] = await Promise.all([
        getUserTransactions(filters),
        getUserPaymentStats(),
      ]);

      setTransactions(
        transactionsData?.data?.transactions ||
          transactionsData?.transactions ||
          []
      );
      setStats(statsData?.data || statsData);
    } catch (err) {
      setError(err.message || "Failed to load payment data");
      console.error("Payment fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (transaction) => {
    try {
      const details = await getPaymentStatus(transaction._id || transaction.id);
      setSelectedTransaction(details?.data || details);
      setShowModal(true);
    } catch (err) {
      alert("Failed to load transaction details");
    }
  };

  const handleRetryPayment = async (transactionId) => {
    if (!confirm("Are you sure you want to retry this payment?")) return;

    try {
      setActionLoading(transactionId);
      await retryPayment(transactionId);
      alert("Payment retry initiated successfully");
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to retry payment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelPayment = async (transactionId) => {
    const reason = prompt("Please provide a reason for cancellation:");
    if (!reason) return;

    try {
      setActionLoading(transactionId);
      await cancelPayment(transactionId, reason);
      alert("Payment cancelled successfully");
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to cancel payment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      dateFrom: "",
      dateTo: "",
      provider: "",
      search: "",
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      completed: "status-completed",
      success: "status-completed",
      pending: "status-pending",
      processing: "status-pending",
      failed: "status-failed",
      cancelled: "status-cancelled",
      refunded: "status-refunded",
    };
    return statusMap[status?.toLowerCase()] || "status-default";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (activeTab === "settings") {
    return (
      <PaymentSettings
        user={user}
        onBack={() => setActiveTab("transactions")}
      />
    );
  }

  return (
    <section className="my-payment">
      <div className="payment-header">
        <div className="header-content">
          <h1>My Payments</h1>
          <p>Manage your transactions and payment methods</p>
        </div>
        <button
          className="btn-settings"
          onClick={() => setActiveTab("settings")}
        >
          <span className="icon">⚙️</span>
          Payment Settings
        </button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="payment-stats">
          <div className="stat-card">
            <div className="stat-icon total">💳</div>
            <div className="stat-info">
              <span className="stat-label">Total Transactions</span>
              <span className="stat-value">{stats.totalTransactions || 0}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon success">✓</div>
            <div className="stat-info">
              <span className="stat-label">Successful</span>
              <span className="stat-value">
                {stats.successfulTransactions || 0}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon amount">💰</div>
            <div className="stat-info">
              <span className="stat-label">Total Amount</span>
              <span className="stat-value">
                {formatCurrency(
                  stats.totalAmount || 0,
                  stats.currency || "USD"
                )}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rate">📊</div>
            <div className="stat-info">
              <span className="stat-label">Success Rate</span>
              <span className="stat-value">{stats.successRate || 0}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="payment-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="filter-input search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div className="filter-group">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            className="filter-input"
            placeholder="From Date"
          />
        </div>
        <div className="filter-group">
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            className="filter-input"
            placeholder="To Date"
          />
        </div>
        {(filters.status ||
          filters.dateFrom ||
          filters.dateTo ||
          filters.search) && (
          <button onClick={clearFilters} className="btn-clear-filters">
            Clear Filters
          </button>
        )}
      </div>

      {/* Transactions List */}
      <div className="transactions-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your transactions...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={fetchData} className="btn-retry">
              Try Again
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h3>No Transactions Yet</h3>
            <p>
              You haven't made any transactions yet. Start shopping to see your
              payment history here!
            </p>
            <button
              className="btn-primary"
              onClick={() => (window.location.href = "/shop")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Provider</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id || transaction.id}>
                    <td>
                      <span className="transaction-id">
                        {transaction.transactionId ||
                          transaction._id?.slice(-8) ||
                          "N/A"}
                      </span>
                    </td>
                    <td>{formatDate(transaction.createdAt)}</td>
                    <td className="amount-cell">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td>
                      <span className="provider-badge">
                        {transaction.provider || "N/A"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action btn-view"
                          onClick={() => handleViewDetails(transaction)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        {transaction.status?.toLowerCase() === "failed" && (
                          <button
                            className="btn-action btn-retry-small"
                            onClick={() =>
                              handleRetryPayment(
                                transaction._id || transaction.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              (transaction._id || transaction.id)
                            }
                            title="Retry Payment"
                          >
                            {actionLoading ===
                            (transaction._id || transaction.id)
                              ? "..."
                              : "🔄"}
                          </button>
                        )}
                        {["pending", "processing"].includes(
                          transaction.status?.toLowerCase()
                        ) && (
                          <button
                            className="btn-action btn-cancel-small"
                            onClick={() =>
                              handleCancelPayment(
                                transaction._id || transaction.id
                              )
                            }
                            disabled={
                              actionLoading ===
                              (transaction._id || transaction.id)
                            }
                            title="Cancel Payment"
                          >
                            {actionLoading ===
                            (transaction._id || transaction.id)
                              ? "..."
                              : "✕"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showModal && selectedTransaction && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Transaction ID:</label>
                <span>
                  {selectedTransaction.transactionId || selectedTransaction._id}
                </span>
              </div>
              <div className="detail-group">
                <label>Amount:</label>
                <span className="detail-amount">
                  {formatCurrency(
                    selectedTransaction.amount,
                    selectedTransaction.currency
                  )}
                </span>
              </div>
              <div className="detail-group">
                <label>Status:</label>
                <span
                  className={`status-badge ${getStatusClass(
                    selectedTransaction.status
                  )}`}
                >
                  {selectedTransaction.status}
                </span>
              </div>
              <div className="detail-group">
                <label>Provider:</label>
                <span>{selectedTransaction.provider || "N/A"}</span>
              </div>
              <div className="detail-group">
                <label>Payment Method:</label>
                <span>{selectedTransaction.paymentMethod || "N/A"}</span>
              </div>
              <div className="detail-group">
                <label>Date:</label>
                <span>{formatDate(selectedTransaction.createdAt)}</span>
              </div>
              {selectedTransaction.description && (
                <div className="detail-group">
                  <label>Description:</label>
                  <span>{selectedTransaction.description}</span>
                </div>
              )}
              {selectedTransaction.failureReason && (
                <div className="detail-group">
                  <label>Failure Reason:</label>
                  <span className="failure-reason">
                    {selectedTransaction.failureReason}
                  </span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// components/admin/payments/PaymentAdminDashboard.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  getPaymentStats,
  adminGetTransactions,
  getAvailableProviders,
  getRevenueAnalytics,
  getSuccessRateAnalytics,
  getProviderTrends,
  adminRefundPayment,
  adminCapturePayment,
  formatCurrency,
} from "../../../services/paymentService";
import PaymentStats from "./common/paymentStats";
import RecentTransactions from "./common/recentTransactions";
import ProviderStatus from "./common/providerStatus";
import QuickActions from "./common/quickActions";
import RevenueChart from "./common/revenueChart";
import LoadingSpinner from "./common/loadingSpinner";
import ErrorBanner from "./common/errorBanner";
import "./styles/paymentAdminDashboard.css";
import { Link } from "react-router-dom";

const TIME_RANGES = [
  { value: "24h", label: "Last 24 Hours", days: 1 },
  { value: "7d", label: "Last 7 Days", days: 7 },
  { value: "30d", label: "Last 30 Days", days: 30 },
  { value: "90d", label: "Last 90 Days", days: 90 },
  { value: "1y", label: "Last Year", days: 365 },
];

const PaymentAdminDashboard = () => {
  // State management
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [providerData, setProviderData] = useState([]);
  const [successRates, setSuccessRates] = useState(null);

  // UI State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Calculate date range
  const dateRange = useMemo(() => {
    const range = TIME_RANGES.find((r) => r.value === timeRange);
    const now = new Date();
    const from = new Date(now.setDate(now.getDate() - (range?.days || 7)));
    return {
      dateFrom: from.toISOString(),
      dateTo: new Date().toISOString(),
    };
  }, [timeRange]);

  // Load all dashboard data
  const loadDashboardData = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        // Parallel API calls for performance
        const [
          statsRes,
          transactionsRes,
          revenueRes,
          providersRes,
          successRes,
        ] = await Promise.allSettled([
          getPaymentStats(dateRange),
          adminGetTransactions({ limit: 10, ...dateRange }),
          getRevenueAnalytics(timeRange === "24h" ? "hourly" : "daily"),
          getProviderTrends(),
          getSuccessRateAnalytics(dateRange),
        ]);

        // Process results with error handling for each
        if (statsRes.status === "fulfilled") {
          setStats(statsRes.value.data);
        }

        if (transactionsRes.status === "fulfilled") {
          setRecentTransactions(
            transactionsRes.value.data?.transactions ||
              transactionsRes.value.data ||
              []
          );
        }

        if (revenueRes.status === "fulfilled") {
          setRevenueData(revenueRes.value.data);
        }

        if (providersRes.status === "fulfilled") {
          setProviderData(providersRes.value.data || []);
        }

        if (successRes.status === "fulfilled") {
          setSuccessRates(successRes.value.data);
        }

        // Check if any critical calls failed
        const failures = [statsRes, transactionsRes].filter(
          (r) => r.status === "rejected"
        );
        if (failures.length > 0) {
          console.error("Some API calls failed:", failures);
          setError("Some dashboard data failed to load. Showing partial data.");
        }

        setLastUpdated(new Date());
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [dateRange, timeRange]
  );

  // Initial load and time range changes
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData(true);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Payment actions
  const handlePaymentAction = async (action, transactionId, data = {}) => {
    try {
      switch (action) {
        case "refund":
          await adminRefundPayment(transactionId, data);
          break;
        case "capture":
          await adminCapturePayment(transactionId, data.amount);
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      loadDashboardData(true);
    } catch (err) {
      setError(`Failed to ${action} payment: ${err.message}`);
    }
  };

  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return "";
    return lastUpdated.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="pad-dashboard pad-dashboard--loading">
        <LoadingSpinner size="large" message="Loading payment dashboard..." />
      </div>
    );
  }

  return (
    <div className="pad-dashboard">
      {/* Header */}
      <header className="pad-dashboard__header">
        <div className="pad-dashboard__title-section">
          <h1 className="pad-dashboard__title">Payment Dashboard</h1>
          {lastUpdated && (
            <span className="pad-dashboard__updated">
              Last updated: {formatLastUpdated()}
            </span>
          )}
        </div>

        <div className="pad-dashboard__controls">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="pad-dashboard__select"
            aria-label="Select time range"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => loadDashboardData(true)}
            className="pad-dashboard__refresh-btn"
            disabled={refreshing}
            aria-label="Refresh dashboard"
          >
            <span className={`refresh-icon ${refreshing ? "spinning" : ""}`}>
              ↻
            </span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <ErrorBanner
          message={error}
          onDismiss={() => setError(null)}
          type="warning"
        />
      )}

      {/* Main Dashboard Grid */}
      <div className="pad-dashboard__grid">
        {/* Stats Cards */}
        <section className="pad-dashboard__section pad-dashboard__section--stats">
          <PaymentStats stats={stats} loading={refreshing} currency="USD" />
        </section>

        {/* Revenue Chart */}
        <section className="pad-dashboard__section pad-dashboard__section--chart">
          <div className="pad-section-header">
            <h2 className="pad-section-title">Revenue Overview</h2>
          </div>
          <RevenueChart
            data={revenueData}
            timeRange={timeRange}
            loading={refreshing}
          />
        </section>

        {/* Provider Status */}
        <section className="pad-dashboard__section pad-dashboard__section--providers">
          <div className="pad-section-header">
            <h2 className="pad-section-title">Payment Providers</h2>
          </div>
          <ProviderStatus
            providers={providerData}
            successRates={successRates}
            loading={refreshing}
          />
        </section>

        {/* Recent Transactions */}
        <section className="pad-dashboard__section pad-dashboard__section--transactions">
          <div className="pad-section-header">
            <h2 className="pad-section-title">Recent Transactions</h2>

            <Link to="/admin/all-payments" className="pad-section-link">
              View All →
            </Link>
          </div>
          <RecentTransactions
            transactions={recentTransactions}
            onAction={handlePaymentAction}
            loading={refreshing}
          />
        </section>

        {/* Quick Actions */}
        <section className="pad-dashboard__section pad-dashboard__section--actions">
          <div className="pad-section-header">
            <h2 className="pad-section-title">Quick Actions</h2>
          </div>
          <QuickActions />
        </section>
      </div>
    </div>
  );
};

export default PaymentAdminDashboard;

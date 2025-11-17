import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaPercentage,
  FaSync,
  FaDownload,
  FaCalendarAlt,
} from "react-icons/fa";
import { getCouponStats } from "../../../services/couponService";
import "./styles/couponStatsPage.css";

export default function CouponStatsPage({ darkMode }) {
  // State management
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const statsData = await getCouponStats();
      setStats(statsData);
      setLastUpdated(new Date());

      if (isRefresh) {
        toast.success("Statistics refreshed successfully!");
      }
    } catch (err) {
      console.error("Error fetching coupon statistics:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to load statistics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleRefresh = () => {
    fetchStats(true);
  };

  const handleExportData = () => {
    try {
      const exportData = {
        stats,
        exportedAt: new Date().toISOString(),
        metadata: {
          version: "1.0",
          type: "coupon-statistics",
        },
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `coupon-stats-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Statistics exported successfully!");
    } catch (err) {
      console.error("Error exporting data:", err);
      toast.error("Failed to export statistics");
    }
  };

  const calculateMetrics = useCallback(() => {
    if (!stats) return null;

    const activePercentage =
      stats.totalCoupons > 0
        ? ((stats.activeCoupons / stats.totalCoupons) * 100).toFixed(1)
        : 0;

    const expiredPercentage =
      stats.totalCoupons > 0
        ? ((stats.expiredCoupons / stats.totalCoupons) * 100).toFixed(1)
        : 0;

    const inactivePercentage =
      stats.totalCoupons > 0
        ? ((stats.inactiveCoupons / stats.totalCoupons) * 100).toFixed(1)
        : 0;

    const usageRate =
      stats.totalCoupons > 0
        ? (stats.totalUsage / stats.totalCoupons).toFixed(2)
        : 0;

    const utilizationRate =
      stats.activeCoupons > 0
        ? ((stats.totalUsage / stats.activeCoupons) * 100).toFixed(1)
        : 0;

    const efficiencyScore =
      stats.totalUsage > 0 && stats.totalCoupons > 0
        ? Math.min(
            (stats.totalUsage / (stats.totalCoupons * 10)) * 100,
            100
          ).toFixed(0)
        : 0;

    const unusedCoupons =
      stats.totalCoupons -
      (stats.expiredCoupons +
        (stats.totalUsage > 0
          ? Math.min(stats.activeCoupons, stats.totalUsage)
          : 0));

    const averagePerActive =
      stats.activeCoupons > 0
        ? (stats.totalUsage / stats.activeCoupons).toFixed(2)
        : 0;

    // Determine most common status
    const statusCounts = {
      active: stats.activeCoupons,
      expired: stats.expiredCoupons,
      inactive: stats.inactiveCoupons,
    };
    const mostCommonStatus = Object.keys(statusCounts).reduce((a, b) =>
      statusCounts[a] > statusCounts[b] ? a : b
    );

    return {
      activePercentage: parseFloat(activePercentage),
      expiredPercentage: parseFloat(expiredPercentage),
      inactivePercentage: parseFloat(inactivePercentage),
      usageRate: parseFloat(usageRate),
      utilizationRate: parseFloat(utilizationRate),
      efficiencyScore: parseFloat(efficiencyScore),
      unusedCoupons,
      averagePerActive: parseFloat(averagePerActive),
      mostCommonStatus:
        mostCommonStatus.charAt(0).toUpperCase() + mostCommonStatus.slice(1),
    };
  }, [stats]);

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="coupon-stats-page">
        <div className="coupon-stats-page__loading">
          <div className="coupon-stats-page__loading-spinner"></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="coupon-stats-page">
        <div className="coupon-stats-page__error">
          <FaTimesCircle className="coupon-stats-page__error-icon" />
          <h3>Failed to Load Statistics</h3>
          <p>{error}</p>
          <button
            onClick={() => fetchStats()}
            className="coupon-stats-page__retry-btn"
          >
            <FaSync /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="coupon-stats-page">
        <div className="coupon-stats-page__empty">
          <FaChartLine className="coupon-stats-page__empty-icon" />
          <h3>No Statistics Available</h3>
          <p>Statistics will appear here once coupons are created.</p>
        </div>
      </div>
    );
  }

  // Statistics cards data
  const statsCards = [
    {
      label: "Total Coupons",
      value: stats.totalCoupons || 0,
      icon: <FaChartLine />,
      className: "total",
      description: "All coupons in system",
    },
    {
      label: "Active Coupons",
      value: stats.activeCoupons || 0,
      icon: <FaCheckCircle />,
      className: "active",
      description: `${metrics.activePercentage}% of total`,
      percentage: metrics.activePercentage,
    },
    {
      label: "Expired Coupons",
      value: stats.expiredCoupons || 0,
      icon: <FaClock />,
      className: "expired",
      description: `${metrics.expiredPercentage}% of total`,
      percentage: metrics.expiredPercentage,
    },
    {
      label: "Inactive Coupons",
      value: stats.inactiveCoupons || 0,
      icon: <FaTimesCircle />,
      className: "inactive",
      description: "Manually deactivated",
      percentage: metrics.inactivePercentage,
    },
    {
      label: "Total Usage",
      value: stats.totalUsage || 0,
      icon: <FaUsers />,
      className: "usage",
      description: "Times coupons were used",
    },
    {
      label: "Average Usage",
      value: stats.averageUsage?.toFixed(2) || "0.00",
      icon: <FaPercentage />,
      className: "average",
      description: `${metrics.usageRate} uses per coupon`,
    },
  ];

  return (
    <div className={`coupon-stats-page ${darkMode ? "dark-mode" : ""}`}>
      {/* Header */}
      <div className="coupon-stats-page__header">
        <div className="coupon-stats-page__header-content">
          <h2 className="coupon-stats-page__title">
            <FaChartLine className="coupon-stats-page__title-icon" />
            Coupon Statistics Dashboard
          </h2>
          {lastUpdated && (
            <div className="coupon-stats-page__last-updated">
              <FaCalendarAlt />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
        <div className="coupon-stats-page__header-actions">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="coupon-stats-page__action-btn coupon-stats-page__action-btn--refresh"
            title="Refresh statistics"
          >
            <FaSync className={refreshing ? "spinning" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={handleExportData}
            className="coupon-stats-page__action-btn coupon-stats-page__action-btn--export"
            title="Export statistics"
          >
            <FaDownload />
            Export
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="coupon-stats-page__summary">
        <div className="coupon-stats-page__summary-item">
          <span className="coupon-stats-page__summary-label">
            Utilization Rate:
          </span>
          <span className="coupon-stats-page__summary-value">
            {metrics.activePercentage}%
          </span>
        </div>
        <div className="coupon-stats-page__summary-item">
          <span className="coupon-stats-page__summary-label">
            Total Redemptions:
          </span>
          <span className="coupon-stats-page__summary-value">
            {stats.totalUsage || 0}
          </span>
        </div>
        <div className="coupon-stats-page__summary-item">
          <span className="coupon-stats-page__summary-label">
            Efficiency Score:
          </span>
          <span className="coupon-stats-page__summary-value">
            {metrics.efficiencyScore}%
          </span>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="coupon-stats-page__grid">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`coupon-stats-page__card coupon-stats-page__card--${stat.className}`}
          >
            <div className="coupon-stats-page__card-icon">{stat.icon}</div>
            <div className="coupon-stats-page__card-content">
              <div className="coupon-stats-page__card-label">{stat.label}</div>
              <div className="coupon-stats-page__card-value">{stat.value}</div>
              <div className="coupon-stats-page__card-description">
                {stat.description}
              </div>
              {stat.percentage !== undefined && (
                <div className="coupon-stats-page__card-progress">
                  <div
                    className="coupon-stats-page__card-progress-bar"
                    style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights */}
      <div className="coupon-stats-page__section">
        <h3 className="coupon-stats-page__section-title">Quick Insights</h3>
        <div className="coupon-stats-page__insights-grid">
          <div className="coupon-stats-page__insight">
            <span className="coupon-stats-page__insight-label">
              Most Common Status:
            </span>
            <span className="coupon-stats-page__insight-value">
              {metrics.mostCommonStatus}
            </span>
          </div>
          <div className="coupon-stats-page__insight">
            <span className="coupon-stats-page__insight-label">
              Efficiency Score:
            </span>
            <span className="coupon-stats-page__insight-value">
              {metrics.efficiencyScore}%
            </span>
          </div>
          <div className="coupon-stats-page__insight">
            <span className="coupon-stats-page__insight-label">
              Unused Coupons:
            </span>
            <span className="coupon-stats-page__insight-value">
              {metrics.unusedCoupons}
            </span>
          </div>
          <div className="coupon-stats-page__insight">
            <span className="coupon-stats-page__insight-label">
              Average Per Active:
            </span>
            <span className="coupon-stats-page__insight-value">
              {metrics.averagePerActive}
            </span>
          </div>
        </div>
      </div>

      {/* Health Indicators */}
      <div className="coupon-stats-page__section">
        <h3 className="coupon-stats-page__section-title">System Health</h3>
        <div className="coupon-stats-page__health-grid">
          <div
            className={`coupon-stats-page__health-card ${
              metrics.activePercentage >= 50
                ? "coupon-stats-page__health-card--good"
                : metrics.activePercentage >= 25
                ? "coupon-stats-page__health-card--warning"
                : "coupon-stats-page__health-card--poor"
            }`}
          >
            <div className="coupon-stats-page__health-label">Active Rate</div>
            <div className="coupon-stats-page__health-value">
              {metrics.activePercentage}%
            </div>
            <div className="coupon-stats-page__health-status">
              {metrics.activePercentage >= 50
                ? "Healthy"
                : metrics.activePercentage >= 25
                ? "Fair"
                : "Needs Attention"}
            </div>
            <div className="coupon-stats-page__health-bar">
              <div
                className="coupon-stats-page__health-bar-fill"
                style={{ width: `${metrics.activePercentage}%` }}
              />
            </div>
          </div>

          <div
            className={`coupon-stats-page__health-card ${
              stats.averageUsage >= 5
                ? "coupon-stats-page__health-card--good"
                : stats.averageUsage >= 2
                ? "coupon-stats-page__health-card--warning"
                : "coupon-stats-page__health-card--poor"
            }`}
          >
            <div className="coupon-stats-page__health-label">Usage Rate</div>
            <div className="coupon-stats-page__health-value">
              {stats.averageUsage?.toFixed(1) || "0.0"}
            </div>
            <div className="coupon-stats-page__health-status">
              {stats.averageUsage >= 5
                ? "Excellent"
                : stats.averageUsage >= 2
                ? "Good"
                : "Low"}
            </div>
            <div className="coupon-stats-page__health-bar">
              <div
                className="coupon-stats-page__health-bar-fill"
                style={{
                  width: `${Math.min((stats.averageUsage / 10) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div
            className={`coupon-stats-page__health-card ${
              metrics.expiredPercentage <= 20
                ? "coupon-stats-page__health-card--good"
                : metrics.expiredPercentage <= 40
                ? "coupon-stats-page__health-card--warning"
                : "coupon-stats-page__health-card--poor"
            }`}
          >
            <div className="coupon-stats-page__health-label">
              Expiration Rate
            </div>
            <div className="coupon-stats-page__health-value">
              {metrics.expiredPercentage}%
            </div>
            <div className="coupon-stats-page__health-status">
              {metrics.expiredPercentage <= 20
                ? "Optimal"
                : metrics.expiredPercentage <= 40
                ? "Moderate"
                : "High"}
            </div>
            <div className="coupon-stats-page__health-bar">
              <div
                className="coupon-stats-page__health-bar-fill"
                style={{ width: `${metrics.expiredPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Overview */}
      <div className="coupon-stats-page__section">
        <h3 className="coupon-stats-page__section-title">
          Status Distribution
        </h3>
        <div className="coupon-stats-page__distribution">
          <div className="coupon-stats-page__distribution-chart">
            <div
              className="coupon-stats-page__distribution-segment coupon-stats-page__distribution-segment--active"
              style={{ width: `${metrics.activePercentage}%` }}
              title={`Active: ${metrics.activePercentage}%`}
            />
            <div
              className="coupon-stats-page__distribution-segment coupon-stats-page__distribution-segment--expired"
              style={{ width: `${metrics.expiredPercentage}%` }}
              title={`Expired: ${metrics.expiredPercentage}%`}
            />
            <div
              className="coupon-stats-page__distribution-segment coupon-stats-page__distribution-segment--inactive"
              style={{ width: `${metrics.inactivePercentage}%` }}
              title={`Inactive: ${metrics.inactivePercentage}%`}
            />
          </div>
          <div className="coupon-stats-page__distribution-legend">
            <div className="coupon-stats-page__distribution-legend-item">
              <span className="coupon-stats-page__distribution-legend-color coupon-stats-page__distribution-legend-color--active" />
              <span>Active ({metrics.activePercentage}%)</span>
            </div>
            <div className="coupon-stats-page__distribution-legend-item">
              <span className="coupon-stats-page__distribution-legend-color coupon-stats-page__distribution-legend-color--expired" />
              <span>Expired ({metrics.expiredPercentage}%)</span>
            </div>
            <div className="coupon-stats-page__distribution-legend-item">
              <span className="coupon-stats-page__distribution-legend-color coupon-stats-page__distribution-legend-color--inactive" />
              <span>Inactive ({metrics.inactivePercentage}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

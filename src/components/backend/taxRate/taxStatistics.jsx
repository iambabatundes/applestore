// components/admin/tax/TaxStatistics.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FaArrowLeft,
  FaSync,
  FaDownload,
  FaCalendar,
  FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getTaxStatistics,
  exportTaxRates,
} from "../../../services/taxRateService";
import { TaxStatisticsCard } from "./common/taxStatisticsCard";
import { StatisticsChart } from "./common/statisticsChart";
// import { RecentActivity } from "./common/recentActivity";
import "./styles/taxStatistics.css";

export default function TaxStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("30d"); // 7d, 30d, 90d, 1y

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, chartData, activityData] = await Promise.all([
        getTaxStatistics(),
        getTaxStatistics({ timeRange }),
        getRecentActivity(),
      ]);

      setStatistics(statsData);
      setChartData(chartData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Failed to fetch tax statistics:", error);
      toast.error("Failed to load tax statistics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeRange]);

  const getRecentActivity = async () => {
    // Mock data - replace with actual API call
    return [
      {
        id: 1,
        action: "TAX_RATE_CREATED",
        description: "New VAT rate created for Germany",
        timestamp: new Date().toISOString(),
        user: "admin@example.com",
      },
      {
        id: 2,
        action: "TAX_RATE_UPDATED",
        description: "Sales tax updated for California",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: "admin@example.com",
      },
    ];
  };

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStatistics();
  };

  const handleExport = async (format) => {
    try {
      // Export comprehensive statistics report
      await exportTaxRates([], format); // Pass appropriate data
      toast.success(`Tax statistics exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to export statistics");
    }
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  if (loading && !refreshing) {
    return (
      <div className="taxStats__loading-container">
        <div className="taxStats__loading-spinner"></div>
        <span className="taxStats__loading">Loading tax statistics...</span>
      </div>
    );
  }

  return (
    <div className="taxStats__page">
      {/* Page Header */}
      <header className="taxStats__header">
        <div className="taxStats__header-main">
          <div className="taxStats__title-section">
            <h1 className="taxStats__title">Tax Statistics & Analytics</h1>
            <p className="taxStats__subtitle">
              Comprehensive overview of tax rates, usage, and performance
              metrics
            </p>
          </div>
        </div>

        <div className="taxStats__header-actions">
          <select
            className="taxStats__time-select"
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>

          <button
            className="taxStats__action-btn taxStats__action-btn--secondary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FaSync className={refreshing ? "taxStats__spinning" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            className="taxStats__action-btn taxStats__action-btn--primary"
            onClick={() => handleExport("csv")}
          >
            <FaDownload /> Export Report
          </button>
        </div>
      </header>

      {/* Key Metrics Grid */}
      {statistics && (
        <section className="taxStats__metrics-grid">
          <TaxStatisticsCard
            title="Total Tax Rates"
            value={statistics.totalRates}
            change={statistics.totalRatesChange}
            changeType="positive"
            icon="📊"
            description="All tax rates in system"
          />

          <TaxStatisticsCard
            title="Active Rates"
            value={statistics.activeRates}
            change={statistics.activeRatesChange}
            changeType="positive"
            icon="✅"
            description="Currently active tax rates"
          />

          <TaxStatisticsCard
            title="Expiring Soon"
            value={statistics.expiringSoon}
            change={statistics.expiringSoonChange}
            changeType="negative"
            icon="⚠️"
            description="Rates expiring in next 30 days"
            alert={statistics.expiringSoon > 0}
          />

          <TaxStatisticsCard
            title="Global Coverage"
            value={statistics.countriesCovered}
            change={statistics.countriesChange}
            changeType="positive"
            icon="🌍"
            description="Countries with tax rates"
          />

          <TaxStatisticsCard
            title="Average Tax Rate"
            value={`${statistics.averageRate}%`}
            change={statistics.averageRateChange}
            changeType="neutral"
            icon="📈"
            description="Average across all rates"
          />

          <TaxStatisticsCard
            title="Recent Updates"
            value={statistics.recentUpdates}
            change={statistics.updatesChange}
            changeType="positive"
            icon="🔄"
            description="Changes in selected period"
          />
        </section>
      )}

      {/* Charts and Visualizations */}
      <section className="taxStats__charts-section">
        <div className="taxStats__chart-container">
          <h3 className="taxStats__chart-title">Tax Rate Distribution</h3>
          {chartData ? (
            <StatisticsChart data={chartData.distribution} type="bar" />
          ) : (
            <div className="taxStats__chart-placeholder">
              Chart data not available
            </div>
          )}
        </div>

        <div className="taxStats__chart-container">
          <h3 className="taxStats__chart-title">Tax Type Breakdown</h3>
          {chartData ? (
            <StatisticsChart data={chartData.breakdown} type="pie" />
          ) : (
            <div className="taxStats__chart-placeholder">
              Chart data not available
            </div>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="taxStats__activity-section">
        <div className="taxStats__activity-header">
          <h3 className="taxStats__activity-title">Recent Activity</h3>
          <span className="taxStats__activity-count">
            {recentActivity.length} activities
          </span>
        </div>
        {/* <RecentActivity activities={recentActivity} /> */}
      </section>

      {/* System Health */}
      <section className="taxStats__health-section">
        <h3 className="taxStats__health-title">System Health</h3>
        <div className="taxStats__health-grid">
          <div className="taxStats__health-item taxStats__health-item--good">
            <div className="taxStats__health-icon">✅</div>
            <div className="taxStats__health-content">
              <div className="taxStats__health-title">API Status</div>
              <div className="taxStats__health-value">Operational</div>
            </div>
          </div>

          <div className="taxStats__health-item taxStats__health-item--warning">
            <div className="taxStats__health-icon">⚠️</div>
            <div className="taxStats__health-content">
              <div className="taxStats__health-title">Data Freshness</div>
              <div className="taxStats__health-value">Updated 2 hours ago</div>
            </div>
          </div>

          <div className="taxStats__health-item taxStats__health-item--good">
            <div className="taxStats__health-icon">📊</div>
            <div className="taxStats__health-content">
              <div className="taxStats__health-title">Cache Status</div>
              <div className="taxStats__health-value">Healthy</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { getOrders } from "../../../services/orderService";
import "./styles/orderStats.css";

export default function OrderStatsDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStats(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch orders for each status
      const statuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

      const promises = statuses.map((status) =>
        getOrders({ status, limit: 1 }).then((res) => ({
          status,
          count: res.pagination?.totalOrders || 0,
        }))
      );

      const results = await Promise.all(promises);

      const newStats = {
        total: 0,
      };

      results.forEach(({ status, count }) => {
        newStats[status] = count;
        newStats.total += count;
      });

      setStats(newStats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function getStatusConfig(status) {
    const configs = {
      pending: {
        icon: "fa fa-clock",
        color: "#ffa500",
        label: "Pending",
        gradient: "linear-gradient(135deg, #ffa500 0%, #ff8c00 100%)",
      },
      confirmed: {
        icon: "fa-check-circle",
        color: "#2196f3",
        label: "Confirmed",
        gradient: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
      },
      processing: {
        icon: "fa-cog",
        color: "#9c27b0",
        label: "Processing",
        gradient: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
      },
      shipped: {
        icon: "fa-truck",
        color: "#00bcd4",
        label: "Shipped",
        gradient: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)",
      },
      delivered: {
        icon: "fa-check-circle",
        color: "#4caf50",
        label: "Delivered",
        gradient: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
      },
      cancelled: {
        icon: "fa-times-circle",
        color: "#f44336",
        label: "Cancelled",
        gradient: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
      },
    };

    return configs[status] || configs.pending;
  }

  function getPercentage(count) {
    if (stats.total === 0) return 0;
    return ((count / stats.total) * 100).toFixed(1);
  }

  if (loading) {
    return (
      <div className="stats-dashboard">
        <div className="stats-loading">
          <div className="spinner-large"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-dashboard">
      <div className="stats-header">
        <h2>Order Statistics</h2>
        <button
          className="btn-refresh-stats"
          onClick={() => fetchStats(true)}
          disabled={refreshing}
        >
          <i className={`fa fa-refresh ${refreshing ? "fa-spin" : ""}`}></i>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="stats-grid">
        {/* Total Orders Card */}
        <div className="stat-card-large total">
          <div className="stat-card-header">
            <i className="fa fa-shopping-cart"></i>
            <span>Total Orders</span>
          </div>
          <div className="stat-card-value">{stats.total}</div>
          <div className="stat-card-footer">
            <span className="stat-label">All Time</span>
          </div>
        </div>

        {/* Status Cards */}
        {Object.keys(stats)
          .filter((key) => key !== "total")
          .map((status) => {
            const config = getStatusConfig(status);
            const count = stats[status];
            const percentage = getPercentage(count);

            return (
              <div
                key={status}
                className="stat-card"
                style={{ borderColor: config.color }}
              >
                <div
                  className="stat-card-icon"
                  style={{ background: config.gradient }}
                >
                  <i className={`fa ${config.icon}`}></i>
                </div>
                <div className="stat-card-content">
                  <div className="stat-card-label">{config.label}</div>
                  <div className="stat-card-number">{count}</div>
                  <div className="stat-card-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${percentage}%`,
                        background: config.gradient,
                      }}
                    ></div>
                  </div>
                  <div className="stat-card-percentage">
                    {percentage}% of total
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

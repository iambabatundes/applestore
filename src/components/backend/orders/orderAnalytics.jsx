import React, { useState, useEffect } from "react";
import {
  getRevenueAnalytics,
  getTopProducts,
} from "../../../services/orderService";
import { toast } from "react-toastify";
import "./styles/orderAnalytics.css";

export default function OrderAnalytics({ darkMode }) {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [revenueStats, setRevenueStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const [revenue, products] = await Promise.all([
        getRevenueAnalytics(dateRange.startDate, dateRange.endDate),
        getTopProducts(dateRange.startDate, dateRange.endDate, 10),
      ]);

      setRevenueStats(revenue);
      setTopProducts(products.topProducts || []);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  }

  function handleDateChange(field, value) {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  }

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading">
          <div className="spinner-large"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>Order Analytics</h1>
          <div className="date-range-selector">
            <div className="date-input-group">
              <label>Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
                max={dateRange.endDate}
              />
            </div>
            <div className="date-input-group">
              <label>End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
                min={dateRange.startDate}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <button onClick={fetchAnalytics} className="btn-refresh">
              <i className="fa fa-refresh"></i>
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {revenueStats?.summary && (
          <div className="analytics-summary">
            <div className="summary-card">
              <div className="card-icon revenue">
                <i className="fa fa-dollar-sign"></i>
              </div>
              <div className="card-content">
                <h3>Total Revenue</h3>
                <p className="value">
                  ${revenueStats.summary.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon orders">
                <i className="fa fa-shopping-cart"></i>
              </div>
              <div className="card-content">
                <h3>Total Orders</h3>
                <p className="value">{revenueStats.summary.totalOrders}</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon average">
                <i className="fa fa-chart-line"></i>
              </div>
              <div className="card-content">
                <h3>Average Order</h3>
                <p className="value">
                  $
                  {(
                    revenueStats.summary.totalRevenue /
                      revenueStats.summary.totalOrders || 0
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon net">
                <i className="fa fa-coins"></i>
              </div>
              <div className="card-content">
                <h3>Net Revenue</h3>
                <p className="value">
                  ${revenueStats.summary.netRevenue.toFixed(2)}
                </p>
                <span className="refunded">
                  -${revenueStats.summary.totalRefunded.toFixed(2)} refunded
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Trend */}
        {revenueStats?.stats && revenueStats.stats.length > 0 && (
          <div className="analytics-section">
            <h2>Revenue Trend</h2>
            <div className="revenue-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                    <th>Refunded</th>
                    <th>Net</th>
                    <th>Avg Order</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueStats.stats.map((stat, index) => (
                    <tr key={index}>
                      <td>{new Date(stat._id).toLocaleDateString()}</td>
                      <td>{stat.totalOrders}</td>
                      <td>${stat.totalRevenue.toFixed(2)}</td>
                      <td className="refunded">
                        ${stat.totalRefunded.toFixed(2)}
                      </td>
                      <td className="net">${stat.netRevenue.toFixed(2)}</td>
                      <td>${stat.averageOrderValue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Products */}
        {topProducts.length > 0 && (
          <div className="analytics-section">
            <h2>Top Products</h2>
            <div className="top-products-grid">
              {topProducts.map((product, index) => (
                <div key={index} className="product-card">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <h4>{product.productName}</h4>
                    <div className="product-stats">
                      <span className="stat">
                        <i className="fa fa-box"></i> {product.totalQuantity}{" "}
                        sold
                      </span>
                      <span className="stat">
                        <i className="fa fa-shopping-bag"></i>{" "}
                        {product.orderCount} orders
                      </span>
                      <span className="stat revenue">
                        <i className="fa fa-dollar-sign"></i> $
                        {product.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

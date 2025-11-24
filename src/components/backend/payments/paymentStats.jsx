// components/admin/payments/PaymentStats.jsx
import React from "react";
import { formatCurrency } from "../../../services/paymentService";

const PaymentStats = ({ stats }) => {
  const { overview, revenue, breakdown } = stats;

  const getTrendIcon = (trend) => {
    if (trend > 0) return "↗️";
    if (trend < 0) return "↘️";
    return "→";
  };

  return (
    <div className="payment-stats">
      <h2>Payment Overview</h2>
      <div className="stats-grid">
        <div className="stat-card total-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">{formatCurrency(revenue.total, "USD")}</p>
            <div className="stat-trend trend-up">
              {getTrendIcon(5.2)} +5.2% from last period
            </div>
          </div>
        </div>

        <div className="stat-card total-transactions">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Transactions</h3>
            <p className="stat-value">{overview.totalTransactions}</p>
            <div className="stat-trend trend-up">
              {getTrendIcon(2.1)} +2.1% from last period
            </div>
          </div>
        </div>

        <div className="stat-card success-rate">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Success Rate</h3>
            <p className="stat-value">{overview.successRate}%</p>
            <div className="stat-trend trend-up">
              {getTrendIcon(1.5)} +1.5% from last period
            </div>
          </div>
        </div>

        <div className="stat-card failed-transactions">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>Failed Transactions</h3>
            <p className="stat-value">{overview.failedTransactions}</p>
            <div className="stat-trend trend-down">
              {getTrendIcon(-0.8)} -0.8% from last period
            </div>
          </div>
        </div>

        <div className="stat-card pending-transactions">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-value">{overview.pendingTransactions}</p>
            <div className="stat-trend trend-up">
              {getTrendIcon(3.2)} +3.2% from last period
            </div>
          </div>
        </div>

        <div className="stat-card avg-transaction">
          <div className="stat-icon">💳</div>
          <div className="stat-content">
            <h3>Average Transaction</h3>
            <p className="stat-value">
              {formatCurrency(
                overview.totalTransactions > 0
                  ? revenue.total / overview.totalTransactions
                  : 0,
                "USD"
              )}
            </p>
            <div className="stat-trend trend-up">
              {getTrendIcon(1.2)} +1.2% from last period
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown by provider */}
      <div className="breakdown-section">
        <h3>Performance by Provider</h3>
        <div className="provider-breakdown">
          {breakdown.byProvider.map((provider) => (
            <div key={provider.provider} className="provider-metric">
              <div className="provider-header">
                <span className="provider-name">{provider.provider}</span>
                <span className="success-rate">
                  {provider.successRate.toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${provider.successRate}%` }}
                ></div>
              </div>
              <div className="provider-stats">
                <span>{provider.successCount} successful</span>
                <span>{provider.count - provider.successCount} failed</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentStats;

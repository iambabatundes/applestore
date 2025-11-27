// paymentStats.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../../services/paymentService";
import "../styles/paymentStats.css";

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = "default",
  loading,
}) => {
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "";
  const trendClass =
    trend === "up" ? "positive" : trend === "down" ? "negative" : "";

  return (
    <div
      className={`stat-card stat-card--${variant} ${
        loading ? "stat-card--loading" : ""
      }`}
    >
      <div className="stat-card__header">
        <span className="stat-card__icon" aria-hidden="true">
          {icon}
        </span>
        <h3 className="stat-card__title">{title}</h3>
      </div>

      <div className="stat-card__body">
        <p className="stat-card__value">
          {loading ? <span className="skeleton skeleton--value" /> : value}
        </p>

        {(subtitle || trendValue) && (
          <div className="stat-card__footer">
            {subtitle && (
              <span className="stat-card__subtitle">{subtitle}</span>
            )}
            {trendValue && (
              <span
                className={`stat-card__trend stat-card__trend--${trendClass}`}
              >
                {trendIcon} {trendValue}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentStats = ({ stats, loading = false, currency = "USD" }) => {
  // Calculate derived stats
  const processedStats = useMemo(() => {
    if (!stats) return null;

    const { overview = {}, revenue = {}, breakdown = {} } = stats;

    const successRate =
      overview.totalTransactions > 0
        ? (
            (overview.successfulTransactions / overview.totalTransactions) *
            100
          ).toFixed(1)
        : 0;

    const avgTransaction =
      overview.successfulTransactions > 0
        ? revenue.total / overview.successfulTransactions
        : 0;

    return {
      totalRevenue: revenue.total || 0,
      totalTransactions: overview.totalTransactions || 0,
      successfulTransactions: overview.successfulTransactions || 0,
      failedTransactions: overview.failedTransactions || 0,
      pendingTransactions: overview.pendingTransactions || 0,
      successRate: parseFloat(successRate),
      avgTransaction,
      refundedAmount: overview.refundedAmount || 0,
    };
  }, [stats]);

  const statCards = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: processedStats
        ? formatCurrency(processedStats.totalRevenue, currency)
        : "-",
      icon: "💰",
      variant: "primary",
      subtitle: `${processedStats?.successfulTransactions || 0} successful`,
      trend: "up",
      trendValue: "+12.5%",
    },
    {
      id: "transactions",
      title: "Total Trans.",
      value: processedStats?.totalTransactions?.toLocaleString() || "0",
      icon: "📊",
      variant: "default",
      subtitle: `${processedStats?.pendingTransactions || 0} pending`,
    },
    {
      id: "success-rate",
      title: "Success Rate",
      value: processedStats ? `${processedStats.successRate}%` : "-",
      icon: "✅",
      variant:
        processedStats?.successRate >= 95
          ? "success"
          : processedStats?.successRate >= 85
          ? "warning"
          : "danger",
      subtitle: `${processedStats?.failedTransactions || 0} failed`,
    },
    {
      id: "avg-transaction",
      title: "Avg. Trans.",
      value: processedStats
        ? formatCurrency(processedStats.avgTransaction, currency)
        : "-",
      icon: "📈",
      variant: "default",
    },
    {
      id: "refunds",
      title: "Refunded",
      value: processedStats
        ? formatCurrency(processedStats.refundedAmount, currency)
        : "-",
      icon: "↩️",
      variant: processedStats?.refundedAmount > 0 ? "warning" : "default",
    },
  ];

  return (
    <div className="payment-stats">
      <div className="payment-stats__grid">
        {statCards.map((card) => (
          <StatCard
            key={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            variant={card.variant}
            subtitle={card.subtitle}
            trend={card.trend}
            trendValue={card.trendValue}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

PaymentStats.propTypes = {
  stats: PropTypes.shape({
    overview: PropTypes.shape({
      totalTransactions: PropTypes.number,
      successfulTransactions: PropTypes.number,
      failedTransactions: PropTypes.number,
      pendingTransactions: PropTypes.number,
      refundedAmount: PropTypes.number,
    }),
    revenue: PropTypes.shape({
      total: PropTypes.number,
      byCurrency: PropTypes.array,
    }),
    breakdown: PropTypes.shape({
      byStatus: PropTypes.array,
      byProvider: PropTypes.array,
    }),
  }),
  loading: PropTypes.bool,
  currency: PropTypes.string,
};

export default PaymentStats;

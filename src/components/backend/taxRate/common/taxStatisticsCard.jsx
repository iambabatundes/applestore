// components/admin/tax/common/TaxStatisticsCard.jsx
import React from "react";
import { FaArrowTrendUp, FaArrowTrendDown, FaMinus } from "react-icons/fa6";

export function TaxStatisticsCard({
  title,
  value,
  change,
  changeType,
  icon,
  description,
  alert = false,
}) {
  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return <FaArrowTrendUp className="taxStatsCard__change--positive" />;
      case "negative":
        return <FaArrowTrendDown className="taxStatsCard__change--negative" />;
      default:
        return <FaMinus className="taxStatsCard__change--neutral" />;
    }
  };

  const getChangeClass = () => {
    switch (changeType) {
      case "positive":
        return "taxStatsCard__change--positive";
      case "negative":
        return "taxStatsCard__change--negative";
      default:
        return "taxStatsCard__change--neutral";
    }
  };

  return (
    <div className={`taxStatsCard ${alert ? "taxStatsCard--alert" : ""}`}>
      <div className="taxStatsCard__header">
        <div className="taxStatsCard__icon">{icon}</div>
        {alert && (
          <div className="taxStatsCard__alert-badge" title="Requires attention">
            ⚠️
          </div>
        )}
      </div>

      <div className="taxStatsCard__content">
        <h4 className="taxStatsCard__title">{title}</h4>
        <div className="taxStatsCard__value">{value}</div>
        <p className="taxStatsCard__description">{description}</p>
      </div>

      {change !== undefined && change !== null && (
        <div className={`taxStatsCard__change ${getChangeClass()}`}>
          {getChangeIcon()}
          <span className="taxStatsCard__change-value">
            {change > 0 ? "+" : ""}
            {change}%
          </span>
          <span className="taxStatsCard__change-label">vs previous period</span>
        </div>
      )}
    </div>
  );
}

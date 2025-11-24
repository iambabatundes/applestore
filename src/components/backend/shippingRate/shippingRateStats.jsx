import React from "react";
import "./styles/shippingRate.css";

export default function ShippingRateStats({ statistics }) {
  if (!statistics) {
    return null;
  }

  const { rates, zones, cache } = statistics;

  return (
    <div className="shipping-rate__stats">
      <h3 className="shipping-rate__stats-title">Shipping Statistics</h3>

      <div className="shipping-rate__stats-grid">
        {/* Rates Overview */}
        <div className="stat-card">
          <h4 className="stat-card__title">Rates Overview</h4>
          <div className="stat-card__content">
            <div className="stat-item">
              <span className="stat-label">Total Rates:</span>
              <span className="stat-value">{rates?.total || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active:</span>
              <span className="stat-value stat-value--success">
                {rates?.active || 0}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Inactive:</span>
              <span className="stat-value stat-value--warning">
                {rates?.inactive || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Carrier Distribution */}
        {rates?.byCarrier && Object.keys(rates.byCarrier).length > 0 && (
          <div className="stat-card">
            <h4 className="stat-card__title">By Carrier</h4>
            <div className="stat-card__content">
              {Object.entries(rates.byCarrier).map(([carrier, count]) => (
                <div key={carrier} className="stat-item">
                  <span className="stat-label">{carrier}:</span>
                  <span className="stat-value">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Type Distribution */}
        {rates?.byPricingType &&
          Object.keys(rates.byPricingType).length > 0 && (
            <div className="stat-card">
              <h4 className="stat-card__title">By Pricing Type</h4>
              <div className="stat-card__content">
                {Object.entries(rates.byPricingType).map(([type, count]) => (
                  <div key={type} className="stat-item">
                    <span className="stat-label">
                      {type.replace(/_/g, " ")}:
                    </span>
                    <span className="stat-value">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Zones Overview */}
        {zones && (
          <div className="stat-card">
            <h4 className="stat-card__title">Shipping Zones</h4>
            <div className="stat-card__content">
              <div className="stat-item">
                <span className="stat-label">Total Zones:</span>
                <span className="stat-value">{zones.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Active:</span>
                <span className="stat-value stat-value--success">
                  {zones.active || 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Inactive:</span>
                <span className="stat-value stat-value--warning">
                  {zones.inactive || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Cache Stats */}
        {cache && (
          <div className="stat-card">
            <h4 className="stat-card__title">Cache Performance</h4>
            <div className="stat-card__content">
              <div className="stat-item">
                <span className="stat-label">Hit Rate:</span>
                <span className="stat-value">
                  {cache.hitRate
                    ? `${(cache.hitRate * 100).toFixed(1)}%`
                    : "N/A"}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Entries:</span>
                <span className="stat-value">{cache.entries || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

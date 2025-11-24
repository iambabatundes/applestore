// providerStatus.jsx
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "../styles/providerStatus.css";

const PROVIDER_CONFIG = {
  stripe: {
    name: "Stripe",
    icon: "💳",
    color: "#635bff",
    description: "Cards, Apple Pay, Google Pay",
  },
  paypal: {
    name: "PayPal",
    icon: "🅿️",
    color: "#003087",
    description: "PayPal balance, cards",
  },
  paystack: {
    name: "Paystack",
    icon: "💰",
    color: "#00c3f7",
    description: "African payments",
  },
};

const HealthIndicator = ({ status, uptime }) => {
  const getHealthClass = () => {
    if (status === "healthy" || uptime >= 99) return "healthy";
    if (status === "degraded" || (uptime >= 95 && uptime < 99))
      return "degraded";
    return "down";
  };

  const healthClass = getHealthClass();
  const labels = {
    healthy: "Operational",
    degraded: "Degraded",
    down: "Down",
  };

  return (
    <div className={`health-indicator health-indicator--${healthClass}`}>
      <span className="health-indicator__dot" />
      <span className="health-indicator__label">{labels[healthClass]}</span>
    </div>
  );
};

const ProviderCard = ({ provider, data = {} }) => {
  const config = PROVIDER_CONFIG[provider] || {
    name: provider,
    icon: "💳",
    color: "#6b7280",
    description: "Payment provider",
  };

  const {
    enabled = false,
    healthy = false,
    successRate = 0,
    totalTransactions = 0,
    totalRevenue = 0,
    avgFraudScore = null,
    reliability = null,
  } = data;

  const formatSuccessRate = (rate) => {
    if (typeof rate === "number") {
      return `${rate.toFixed(1)}%`;
    }
    return "N/A";
  };

  const formatRevenue = (amount) => {
    if (typeof amount !== "number") return "N/A";
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div
      className={`provider-card ${!enabled ? "provider-card--disabled" : ""}`}
      style={{ "--provider-color": config.color }}
    >
      <div className="provider-card__header">
        <div className="provider-card__info">
          <span className="provider-card__icon">{config.icon}</span>
          <div className="provider-card__title-group">
            <h4 className="provider-card__name">{config.name}</h4>
            <span className="provider-card__description">
              {config.description}
            </span>
          </div>
        </div>
        <HealthIndicator
          status={healthy ? "healthy" : "down"}
          uptime={reliability?.uptime || 0}
        />
      </div>

      <div className="provider-card__stats">
        <div className="provider-stat">
          <span className="provider-stat__value">
            {formatSuccessRate(successRate)}
          </span>
          <span className="provider-stat__label">Success Rate</span>
        </div>
        <div className="provider-stat">
          <span className="provider-stat__value">
            {totalTransactions?.toLocaleString() || "0"}
          </span>
          <span className="provider-stat__label">Transactions</span>
        </div>
        <div className="provider-stat">
          <span className="provider-stat__value">
            {formatRevenue(totalRevenue)}
          </span>
          <span className="provider-stat__label">Revenue</span>
        </div>
      </div>

      {successRate > 0 && (
        <div className="provider-card__progress">
          <div className="progress-bar">
            <div
              className="progress-bar__fill"
              style={{
                width: `${Math.min(successRate, 100)}%`,
                backgroundColor:
                  successRate >= 95
                    ? "#10b981"
                    : successRate >= 85
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            />
          </div>
        </div>
      )}

      {!enabled && (
        <div className="provider-card__disabled-overlay">
          <span>Disabled</span>
        </div>
      )}
    </div>
  );
};

const ProviderStatus = ({ providers = [], successRates, loading = false }) => {
  // Merge provider trends with success rates
  const mergedProviders = React.useMemo(() => {
    const providerMap = {};

    // Add data from provider trends
    providers.forEach((p) => {
      const name = typeof p === "string" ? p : p.provider || p.name;
      providerMap[name] = typeof p === "string" ? { provider: p } : { ...p };
    });

    // Merge success rate data if available
    if (successRates?.byProvider) {
      Object.entries(successRates.byProvider).forEach(([name, data]) => {
        if (providerMap[name]) {
          providerMap[name] = { ...providerMap[name], ...data };
        }
      });
    }

    return Object.entries(providerMap).map(([name, data]) => ({
      provider: name,
      ...data,
    }));
  }, [providers, successRates]);

  if (loading) {
    return (
      <div className="provider-status provider-status--loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="provider-card provider-card--skeleton">
            <div className="skeleton skeleton--header" />
            <div className="skeleton skeleton--stats" />
          </div>
        ))}
      </div>
    );
  }

  if (!mergedProviders.length) {
    return (
      <div className="provider-status provider-status--empty">
        <div className="empty-state">
          <span className="empty-state__icon">🔌</span>
          <p className="empty-state__text">No payment providers configured</p>
          <Link
            to="/admin/payments-configuration"
            className="empty-state__link"
          >
            Configure Providers →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="provider-status">
      <div className="provider-status__list">
        {mergedProviders.map((p) => (
          <ProviderCard key={p.provider} provider={p.provider} data={p} />
        ))}
      </div>

      <a
        href="/admin/payments/configuration"
        className="provider-status__config-link"
      >
        ⚙️ Manage Providers
      </a>
    </div>
  );
};

ProviderStatus.propTypes = {
  providers: PropTypes.array,
  successRates: PropTypes.shape({
    byProvider: PropTypes.object,
  }),
  loading: PropTypes.bool,
};

export default ProviderStatus;

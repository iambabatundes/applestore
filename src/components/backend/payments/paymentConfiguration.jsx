// paymentConfiguration.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getAvailableProviders,
  getPaymentConfig,
  getProviderConfig,
  updatePaymentConfig,
  testProviderConnection,
  toggleProvider,
} from "../../../services/paymentService";
import LoadingSpinner from "./common/loadingSpinner";
import ErrorBanner from "./common/errorBanner";
import "./styles/paymentConfiguration.css";

const PROVIDER_INFO = {
  stripe: {
    name: "Stripe",
    icon: "💳",
    color: "#635bff",
    description: "Accept cards, Apple Pay, Google Pay, and more",
    fields: [
      {
        key: "publicKey",
        label: "Publishable Key",
        type: "text",
        required: true,
      },
      {
        key: "secretKey",
        label: "Secret Key",
        type: "password",
        required: true,
      },
      {
        key: "webhookSecret",
        label: "Webhook Secret",
        type: "password",
        required: false,
      },
    ],
  },
  paypal: {
    name: "PayPal",
    icon: "🅿️",
    color: "#003087",
    description: "Accept PayPal and card payments",
    fields: [
      { key: "clientId", label: "Client ID", type: "text", required: true },
      {
        key: "clientSecret",
        label: "Client Secret",
        type: "password",
        required: true,
      },
      {
        key: "mode",
        label: "Mode",
        type: "select",
        options: ["sandbox", "live"],
        required: true,
      },
    ],
  },
  paystack: {
    name: "Paystack",
    icon: "💰",
    color: "#00c3f7",
    description: "African payment gateway",
    fields: [
      { key: "publicKey", label: "Public Key", type: "text", required: true },
      {
        key: "secretKey",
        label: "Secret Key",
        type: "password",
        required: true,
      },
    ],
  },
};

const ProviderCard = ({
  provider,
  config,
  onUpdate,
  onTest,
  onToggle,
  saving,
  testing,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({});
  const [showSecrets, setShowSecrets] = useState({});

  const info = PROVIDER_INFO[provider] || {
    name: provider,
    icon: "💳",
    color: "#6b7280",
    description: "Payment provider",
    fields: [],
  };

  // Initialize form data from config
  useEffect(() => {
    setFormData(config || {});
  }, [config]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(provider, formData);
  };

  const toggleSecret = (key) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isEnabled = config?.enabled ?? false;

  return (
    <div
      className={`provider-card ${!isEnabled ? "provider-card--disabled" : ""}`}
      style={{ "--provider-color": info.color }}
    >
      {/* Card Header */}
      <div className="provider-card__header">
        <div className="provider-card__info">
          <span className="provider-card__icon">{info.icon}</span>
          <div className="provider-card__details">
            <h3 className="provider-card__name">{info.name}</h3>
            <p className="provider-card__description">{info.description}</p>
          </div>
        </div>

        <div className="provider-card__controls">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={() => onToggle(provider)}
              disabled={saving}
            />
            <span className="toggle-switch__slider" />
          </label>

          <button
            className="provider-card__expand"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="provider-card__status">
        <span
          className={`status-dot ${
            config?.healthy ? "status-dot--healthy" : "status-dot--unknown"
          }`}
        />
        <span className="status-text">
          {config?.healthy ? "Connected" : "Not connected"}
        </span>
        {config?.lastTested && (
          <span className="status-date">
            Last tested: {new Date(config.lastTested).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Expanded Configuration */}
      {isExpanded && (
        <form className="provider-card__form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {info.fields.map((field) => (
              <div key={field.key} className="form-group">
                <label
                  htmlFor={`${provider}-${field.key}`}
                  className="form-label"
                >
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>

                {field.type === "select" ? (
                  <select
                    id={`${provider}-${field.key}`}
                    value={formData[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="form-select"
                    required={field.required}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="input-wrapper">
                    <input
                      id={`${provider}-${field.key}`}
                      type={
                        field.type === "password" && !showSecrets[field.key]
                          ? "password"
                          : "text"
                      }
                      value={formData[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="form-input"
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        className="input-toggle"
                        onClick={() => toggleSecret(field.key)}
                        aria-label={showSecrets[field.key] ? "Hide" : "Show"}
                      >
                        {showSecrets[field.key] ? "🙈" : "👁️"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Webhook URL */}
          <div className="webhook-info">
            <label className="form-label">Webhook URL</label>
            <div className="webhook-url">
              <code>
                {`${window.location.origin}/api/payments/webhooks/${provider}`}
              </code>
              <button
                type="button"
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/api/payments/webhooks/${provider}`
                  );
                }}
                aria-label="Copy webhook URL"
              >
                📋
              </button>
            </div>
            <p className="webhook-hint">
              Add this URL to your {info.name} dashboard for webhook events
            </p>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => onTest(provider)}
              disabled={testing || saving}
            >
              {testing ? "Testing..." : "🔗 Test Connection"}
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={saving || testing}
            >
              {saving ? "Saving..." : "💾 Save Configuration"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const PaymentConfiguration = () => {
  const [providers, setProviders] = useState(["stripe", "paypal", "paystack"]); // Default providers
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState({});
  const [testing, setTesting] = useState({});

  // Load configuration with retry logic
  const loadConfiguration = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), 30000);
      });

      const loadPromise = Promise.allSettled([
        getAvailableProviders(),
        getPaymentConfig(),
      ]);

      const [providersRes, configRes] = await Promise.race([
        loadPromise,
        timeoutPromise,
      ]);

      // Process providers
      let providersList = [];
      if (providersRes.status === "fulfilled") {
        providersList = providersRes.value || [];
      } else {
        console.warn("Using fallback providers");
        providersList = ["stripe", "paypal", "paystack"];
      }

      // Process configs
      let configData = {};
      if (configRes.status === "fulfilled") {
        const data = configRes.value?.data || configRes.value;
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item?.provider) configData[item.provider] = item;
          });
        } else if (typeof data === "object") {
          configData = data;
        }
      }

      setProviders(providersList);
      setConfigs(configData);
    } catch (err) {
      console.error("Load error:", err);
      if (retryCount < 2) {
        // Retry after 2 seconds
        setTimeout(() => loadConfiguration(retryCount + 1), 2000);
      } else {
        setError(err.message || "Failed to load configuration");
        // Ensure we have some UI to show even on error
        setProviders(["stripe", "paypal", "paystack"]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  // Handle config update
  const handleConfigUpdate = async (provider, newConfig) => {
    try {
      setSaving((prev) => ({ ...prev, [provider]: true }));
      setError(null);
      setSuccess(null);

      await updatePaymentConfig(provider, newConfig);

      setConfigs((prev) => ({
        ...prev,
        [provider]: { ...prev[provider], ...newConfig },
      }));

      setSuccess(`${provider} configuration saved successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to update ${provider}: ${err.message}`);
    } finally {
      setSaving((prev) => ({ ...prev, [provider]: false }));
    }
  };

  // Handle test connection
  const handleTestConnection = async (provider) => {
    try {
      setTesting((prev) => ({ ...prev, [provider]: true }));
      setError(null);
      setSuccess(null);

      const result = await testProviderConnection(provider);

      if (result.success || result.data?.success) {
        setConfigs((prev) => ({
          ...prev,
          [provider]: {
            ...prev[provider],
            healthy: true,
            lastTested: new Date().toISOString(),
          },
        }));
        setSuccess(`${provider} connection successful!`);
      } else {
        throw new Error(result.message || "Connection test failed");
      }
    } catch (err) {
      setConfigs((prev) => ({
        ...prev,
        [provider]: { ...prev[provider], healthy: false },
      }));
      setError(`${provider} connection failed: ${err.message}`);
    } finally {
      setTesting((prev) => ({ ...prev, [provider]: false }));
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Handle toggle provider
  const handleToggleProvider = async (provider) => {
    try {
      setSaving((prev) => ({ ...prev, [provider]: true }));
      setError(null);

      await toggleProvider(provider);

      setConfigs((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          enabled: !prev[provider]?.enabled,
        },
      }));

      const newState = !configs[provider]?.enabled;
      setSuccess(`${provider} ${newState ? "enabled" : "disabled"}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to toggle ${provider}: ${err.message}`);
    } finally {
      setSaving((prev) => ({ ...prev, [provider]: false }));
    }
  };

  if (loading) {
    return (
      <div className="payment-config payment-config--loading">
        <LoadingSpinner size="large" message="Loading configuration..." />
      </div>
    );
  }

  return (
    <div className="payment-config">
      {/* Header */}
      <header className="payment-config__header">
        <div className="payment-config__title-section">
          <h1 className="payment-config__title">Payment Configuration</h1>
          <p className="payment-config__subtitle">
            Configure and manage your payment gateway settings
          </p>
        </div>
        <button
          className="btn btn--secondary"
          onClick={loadConfiguration}
          disabled={loading}
        >
          ↻ Refresh
        </button>
      </header>

      {/* Notifications */}
      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}
      {success && (
        <div className="success-banner">
          ✓ {success}
          <button onClick={() => setSuccess(null)} className="banner__close">
            ×
          </button>
        </div>
      )}

      {/* Provider Cards */}
      <div className="payment-config__providers">
        {providers.map((provider) => (
          <ProviderCard
            key={provider}
            provider={provider}
            config={configs[provider]}
            onUpdate={handleConfigUpdate}
            onTest={handleTestConnection}
            onToggle={handleToggleProvider}
            saving={saving[provider]}
            testing={testing[provider]}
          />
        ))}
      </div>

      {/* Notes */}
      <div className="payment-config__notes">
        <h3>Configuration Notes</h3>
        <ul>
          <li>🔒 API keys and secrets are encrypted before storage</li>
          <li>🔗 Webhook URLs are automatically generated for each provider</li>
          <li>✅ Test connections before enabling providers in production</li>
          <li>⏱️ Configuration changes may take a few minutes to propagate</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentConfiguration;

// components/admin/tax/configuration/ApiSettings.jsx
import React, { useState } from "react";

import { FaEye, FaEyeSlash, FaTools, FaInfoCircle } from "react-icons/fa";

export function ApiSettings({ config, onUpdate }) {
  const [showSecrets, setShowSecrets] = useState({});

  const toggleSecret = (key) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const testConnection = async (service) => {
    // Implementation would call actual API test endpoints
    alert(`Testing ${service} connection...`);
  };

  return (
    <div className="apiSettings">
      <div className="apiSettings__section">
        <h3 className="apiSettings__section-title">External Tax Services</h3>

        <div className="apiSettings__service">
          <div className="apiSettings__service-header">
            <h4 className="apiSettings__service-title">Avalara AvaTax</h4>
            <div className="apiSettings__service-status">
              <span
                className={`apiSettings__status-dot ${
                  config?.api?.avalara?.enabled
                    ? "apiSettings__status-dot--active"
                    : ""
                }`}
              ></span>
              {config?.api?.avalara?.enabled ? "Enabled" : "Disabled"}
            </div>
          </div>

          <div className="apiSettings__service-fields">
            <div className="apiSettings__field">
              <label className="apiSettings__label">Account ID</label>
              <div className="apiSettings__secret-field">
                <input
                  type={showSecrets.avalaraAccount ? "text" : "password"}
                  value={config?.api?.avalara?.accountId || ""}
                  onChange={(e) =>
                    onUpdate("api.avalara.accountId", e.target.value)
                  }
                  className="apiSettings__input"
                  placeholder="Your Avalara account ID"
                />
                <button
                  type="button"
                  className="apiSettings__secret-toggle"
                  onClick={() => toggleSecret("avalaraAccount")}
                >
                  {showSecrets.avalaraAccount ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="apiSettings__field">
              <label className="apiSettings__label">License Key</label>
              <div className="apiSettings__secret-field">
                <input
                  type={showSecrets.avalaraLicense ? "text" : "password"}
                  value={config?.api?.avalara?.licenseKey || ""}
                  onChange={(e) =>
                    onUpdate("api.avalara.licenseKey", e.target.value)
                  }
                  className="apiSettings__input"
                  placeholder="Your Avalara license key"
                />
                <button
                  type="button"
                  className="apiSettings__secret-toggle"
                  onClick={() => toggleSecret("avalaraLicense")}
                >
                  {showSecrets.avalaraLicense ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="apiSettings__field apiSettings__field--checkbox">
              <label className="apiSettings__checkbox-label">
                <input
                  type="checkbox"
                  checked={config?.api?.avalara?.enabled || false}
                  onChange={(e) =>
                    onUpdate("api.avalara.enabled", e.target.checked)
                  }
                  className="apiSettings__checkbox"
                />
                Enable Avalara Integration
              </label>
            </div>

            <div className="apiSettings__field apiSettings__field--checkbox">
              <label className="apiSettings__checkbox-label">
                <input
                  type="checkbox"
                  checked={config?.api?.avalara?.validateAddress || true}
                  onChange={(e) =>
                    onUpdate("api.avalara.validateAddress", e.target.checked)
                  }
                  className="apiSettings__checkbox"
                />
                Validate Addresses with Avalara
              </label>
            </div>

            <button
              className="apiSettings__test-btn"
              onClick={() => testConnection("Avalara")}
            >
              <FaTools /> Test Connection
            </button>
          </div>
        </div>

        <div className="apiSettings__service">
          <div className="apiSettings__service-header">
            <h4 className="apiSettings__service-title">TaxJar</h4>
            <div className="apiSettings__service-status">
              <span
                className={`apiSettings__status-dot ${
                  config?.api?.taxjar?.enabled
                    ? "apiSettings__status-dot--active"
                    : ""
                }`}
              ></span>
              {config?.api?.taxjar?.enabled ? "Enabled" : "Disabled"}
            </div>
          </div>

          <div className="apiSettings__service-fields">
            <div className="apiSettings__field">
              <label className="apiSettings__label">API Key</label>
              <div className="apiSettings__secret-field">
                <input
                  type={showSecrets.taxjarKey ? "text" : "password"}
                  value={config?.api?.taxjar?.apiKey || ""}
                  onChange={(e) =>
                    onUpdate("api.taxjar.apiKey", e.target.value)
                  }
                  className="apiSettings__input"
                  placeholder="Your TaxJar API key"
                />
                <button
                  type="button"
                  className="apiSettings__secret-toggle"
                  onClick={() => toggleSecret("taxjarKey")}
                >
                  {showSecrets.taxjarKey ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="apiSettings__field apiSettings__field--checkbox">
              <label className="apiSettings__checkbox-label">
                <input
                  type="checkbox"
                  checked={config?.api?.taxjar?.enabled || false}
                  onChange={(e) =>
                    onUpdate("api.taxjar.enabled", e.target.checked)
                  }
                  className="apiSettings__checkbox"
                />
                Enable TaxJar Integration
              </label>
            </div>

            <button
              className="apiSettings__test-btn"
              onClick={() => testConnection("TaxJar")}
            >
              <FaTools /> Test Connection
            </button>
          </div>
        </div>
      </div>

      <div className="apiSettings__section">
        <h3 className="apiSettings__section-title">API Rate Limiting</h3>

        <div className="apiSettings__rate-limit-grid">
          <div className="apiSettings__field">
            <label className="apiSettings__label">Requests Per Minute</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={config?.api?.rateLimit?.requestsPerMinute || 60}
              onChange={(e) =>
                onUpdate(
                  "api.rateLimit.requestsPerMinute",
                  parseInt(e.target.value)
                )
              }
              className="apiSettings__input"
            />
            <div className="apiSettings__help">
              <FaInfoCircle />
              Maximum API requests per minute per client
            </div>
          </div>

          <div className="apiSettings__field">
            <label className="apiSettings__label">Burst Capacity</label>
            <input
              type="number"
              min="1"
              max="100"
              value={config?.api?.rateLimit?.burstCapacity || 10}
              onChange={(e) =>
                onUpdate(
                  "api.rateLimit.burstCapacity",
                  parseInt(e.target.value)
                )
              }
              className="apiSettings__input"
            />
          </div>
        </div>
      </div>

      <div className="apiSettings__section">
        <h3 className="apiSettings__section-title">Webhook Settings</h3>

        <div className="apiSettings__field">
          <label className="apiSettings__label">Webhook URL</label>
          <input
            type="url"
            value={config?.api?.webhook?.url || ""}
            onChange={(e) => onUpdate("api.webhook.url", e.target.value)}
            className="apiSettings__input"
            placeholder="https://your-domain.com/webhooks/tax"
          />
          <div className="apiSettings__help">
            <FaInfoCircle />
            URL to receive tax calculation events and updates
          </div>
        </div>

        <div className="apiSettings__field apiSettings__field--checkbox">
          <label className="apiSettings__checkbox-label">
            <input
              type="checkbox"
              checked={config?.api?.webhook?.enabled || false}
              onChange={(e) =>
                onUpdate("api.webhook.enabled", e.target.checked)
              }
              className="apiSettings__checkbox"
            />
            Enable Webhook Notifications
          </label>
        </div>
      </div>
    </div>
  );
}

// providerConfig.jsx
import React, { useState } from "react";
import "../styles/providerConfig.css";

const ProviderConfig = ({
  provider,
  config,
  onUpdate,
  onTestConnection,
  onToggle,
  saving,
}) => {
  const [localConfig, setLocalConfig] = useState(config);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleInputChange = (field, value) => {
    setLocalConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onUpdate(provider, localConfig);
  };

  const handleToggle = () => {
    onToggle(provider, !localConfig.enabled);
  };

  const getProviderConfig = () => {
    const baseConfig = {
      stripe: [
        {
          key: "secretKey",
          label: "Secret Key",
          type: "password",
          required: true,
        },
        { key: "publicKey", label: "Public Key", type: "text", required: true },
        { key: "webhookSecret", label: "Webhook Secret", type: "password" },
      ],
      paystack: [
        {
          key: "paystackSecretKey",
          label: "Secret Key",
          type: "password",
          required: true,
        },
        {
          key: "paystackPublicKey",
          label: "Public Key",
          type: "text",
          required: true,
        },
      ],
      paypal: [
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
        },
      ],
      payoneer: [
        {
          key: "apiUsername",
          label: "API Username",
          type: "text",
          required: true,
        },
        {
          key: "apiPassword",
          label: "API Password",
          type: "password",
          required: true,
        },
      ],
    };

    return baseConfig[provider] || [];
  };

  const hasChanges = JSON.stringify(localConfig) !== JSON.stringify(config);

  return (
    <div
      className={`provider-config ${
        localConfig.enabled ? "enabled" : "disabled"
      }`}
    >
      <div className="config-header">
        <div className="provider-info">
          <h3>{provider.toUpperCase()} Configuration</h3>
          <div className="provider-status">
            <span
              className={`status-indicator ${
                localConfig.enabled ? "enabled" : "disabled"
              }`}
            >
              {localConfig.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
        <div className="config-actions">
          <button
            className={`toggle-btn ${
              localConfig.enabled ? "enabled" : "disabled"
            }`}
            onClick={handleToggle}
            disabled={saving}
          >
            {localConfig.enabled ? "Disable" : "Enable"}
          </button>
          <button
            className="test-btn"
            onClick={() => onTestConnection(provider)}
            disabled={saving}
          >
            Test Connection
          </button>
        </div>
      </div>

      <div className="config-fields">
        {getProviderConfig().map((field) => (
          <div key={field.key} className="config-field">
            <label htmlFor={field.key}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            {field.type === "select" ? (
              <select
                id={field.key}
                value={localConfig[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                disabled={saving}
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.key}
                type={
                  field.type === "password" && !showCredentials
                    ? "password"
                    : "text"
                }
                value={localConfig[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                disabled={saving}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}
          </div>
        ))}
      </div>

      {getProviderConfig().some((f) => f.type === "password") && (
        <div className="credentials-toggle">
          <label>
            <input
              type="checkbox"
              checked={showCredentials}
              onChange={(e) => setShowCredentials(e.target.checked)}
            />
            Show credentials
          </label>
        </div>
      )}

      <div className="config-footer">
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {hasChanges && (
          <button
            className="cancel-btn"
            onClick={() => setLocalConfig(config)}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default ProviderConfig;

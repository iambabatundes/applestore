// components/admin/tax/TaxConfiguration.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  FaSave,
  FaSync,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHistory,
  FaUpload,
  FaDownload,
  FaShieldAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getTaxConfiguration,
  updateTaxConfiguration,
  validateTaxConfiguration,
  exportTaxConfig,
  importTaxConfig,
} from "../../../services/taxConfigService";
import { ConfigurationForm } from "./configuration/ConfigurationForm";
import { ValidationResults } from "./configuration/ValidationResults";
import { ConfigHistory } from "./configuration/configHistory";
import { SystemDefaults } from "./configuration/systemDefaults";
import { ApiSettings } from "./configuration/apiSettings";
import "./styles/taxConfiguration.css";

export default function TaxConfiguration() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Load configuration
  const loadConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      const configData = await getTaxConfiguration();
      setConfig(configData);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to load tax configuration:", error);
      toast.error("Failed to load configuration");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  // Handle configuration updates
  const handleConfigUpdate = (path, value) => {
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      const keys = path.split(".");
      let current = newConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      setHasUnsavedChanges(true);
      return newConfig;
    });
  };

  // Validate configuration
  const handleValidate = async () => {
    try {
      setValidating(true);
      const results = await validateTaxConfiguration(config);
      setValidationResults(results);

      if (results.isValid) {
        toast.success("Configuration validation passed");
      } else {
        toast.warning("Configuration validation failed");
      }
    } catch (error) {
      console.error("Validation failed:", error);
      toast.error("Validation failed");
    } finally {
      setValidating(false);
    }
  };

  // Save configuration
  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate before saving
      const validation = await validateTaxConfiguration(config);
      if (!validation.isValid) {
        setValidationResults(validation);
        toast.error("Cannot save invalid configuration");
        return;
      }

      await updateTaxConfiguration(config);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      toast.success("Configuration saved successfully");
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  // Export configuration
  const handleExport = async () => {
    try {
      await exportTaxConfig(config);
      toast.success("Configuration exported successfully");
    } catch (error) {
      toast.error("Failed to export configuration");
    }
  };

  // Import configuration
  const handleImport = async (file) => {
    try {
      const importedConfig = await importTaxConfig(file);
      setConfig(importedConfig);
      setHasUnsavedChanges(true);
      toast.success("Configuration imported successfully");
    } catch (error) {
      toast.error("Failed to import configuration");
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to defaults? This cannot be undone."
      )
    ) {
      loadConfiguration();
      setHasUnsavedChanges(false);
      toast.info("Configuration reset to saved state");
    }
  };

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (loading) {
    return (
      <div className="taxConfig__loading">
        <div className="taxConfig__loading-spinner"></div>
        <span>Loading tax configuration...</span>
      </div>
    );
  }

  return (
    <div className="taxConfig">
      {/* Header */}
      <header className="taxConfig__header">
        <div className="taxConfig__header-main">
          <h1 className="taxConfig__title">Tax Configuration</h1>
          <p className="taxConfig__subtitle">
            Manage system-wide tax settings, rules, and integrations
          </p>
        </div>

        <div className="taxConfig__header-actions">
          {hasUnsavedChanges && (
            <div className="taxConfig__unsaved-indicator">
              <FaExclamationTriangle />
              Unsaved Changes
            </div>
          )}

          <button
            className="taxConfig__action-btn taxConfig__action-btn--secondary"
            onClick={handleValidate}
            disabled={validating}
          >
            <FaCheckCircle />
            {validating ? "Validating..." : "Validate"}
          </button>

          <button
            className="taxConfig__action-btn taxConfig__action-btn--secondary"
            onClick={handleReset}
          >
            <FaSync />
            Reset
          </button>

          <button
            className="taxConfig__action-btn taxConfig__action-btn--primary"
            onClick={handleSave}
            disabled={saving || !hasUnsavedChanges}
          >
            <FaSave />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      {/* Status Bar */}
      <div className="taxConfig__status-bar">
        <div className="taxConfig__status-item">
          <span className="taxConfig__status-label">Last Saved:</span>
          <span className="taxConfig__status-value">
            {lastSaved ? lastSaved.toLocaleString() : "Never"}
          </span>
        </div>

        <div className="taxConfig__status-item">
          <span className="taxConfig__status-label">Environment:</span>
          <span className="taxConfig__status-value taxConfig__status-value--production">
            Production
          </span>
        </div>

        <div className="taxConfig__status-item">
          <span className="taxConfig__status-label">Config Version:</span>
          <span className="taxConfig__status-value">
            v{config?.version || "1.0.0"}
          </span>
        </div>
      </div>

      {/* Validation Results */}
      {validationResults && (
        <ValidationResults
          results={validationResults}
          onDismiss={() => setValidationResults(null)}
        />
      )}

      {/* Main Content */}
      <div className="taxConfig__main">
        {/* Navigation Tabs */}
        <nav className="taxConfig__tabs">
          {[
            { id: "general", label: "General Settings", icon: "⚙️" },
            { id: "defaults", label: "System Defaults", icon: "🔧" },
            { id: "api", label: "API & Integration", icon: "🔌" },
            { id: "history", label: "Change History", icon: "📋" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`taxConfig__tab ${
                activeTab === tab.id ? "taxConfig__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="taxConfig__tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="taxConfig__content">
          {activeTab === "general" && (
            <ConfigurationForm
              config={config}
              onUpdate={handleConfigUpdate}
              onExport={handleExport}
              onImport={handleImport}
            />
          )}

          {activeTab === "defaults" && (
            <SystemDefaults config={config} onUpdate={handleConfigUpdate} />
          )}

          {activeTab === "api" && (
            <ApiSettings config={config} onUpdate={handleConfigUpdate} />
          )}

          {activeTab === "history" && <ConfigHistory />}
        </div>
      </div>
    </div>
  );
}

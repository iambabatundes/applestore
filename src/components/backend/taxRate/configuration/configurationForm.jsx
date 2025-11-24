// components/admin/tax/configuration/ConfigurationForm.jsx
import React, { useState } from "react";
import { FaUpload, FaDownload, FaInfoCircle } from "react-icons/fa";

export function ConfigurationForm({ config, onUpdate, onExport, onImport }) {
  const [importing, setImporting] = useState(false);

  const handleFileImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".json")) {
      alert("Please select a JSON file");
      return;
    }

    try {
      setImporting(true);
      await onImport(file);
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = "";
    }
  };

  return (
    <div className="configForm">
      <div className="configForm__section">
        <div className="configForm__section-header">
          <h3 className="configForm__section-title">General Settings</h3>
          <div className="configForm__section-actions">
            <button className="configForm__action-btn" onClick={onExport}>
              <FaDownload /> Export Config
            </button>

            <label className="configForm__action-btn configForm__action-btn--secondary">
              <FaUpload />
              {importing ? "Importing..." : "Import Config"}
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                disabled={importing}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        <div className="configForm__grid">
          <div className="configForm__field">
            <label className="configForm__label">
              System Mode
              <span className="configForm__required">*</span>
            </label>
            <select
              value={config?.system?.mode || "production"}
              onChange={(e) => onUpdate("system.mode", e.target.value)}
              className="configForm__select"
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
            <div className="configForm__help">
              <FaInfoCircle />
              Controls logging level and feature availability
            </div>
          </div>

          <div className="configForm__field">
            <label className="configForm__label">
              Default Currency
              <span className="configForm__required">*</span>
            </label>
            <select
              value={config?.system?.defaultCurrency || "USD"}
              onChange={(e) =>
                onUpdate("system.defaultCurrency", e.target.value)
              }
              className="configForm__select"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </div>

          <div className="configForm__field">
            <label className="configForm__label">Decimal Precision</label>
            <input
              type="number"
              min="2"
              max="6"
              value={config?.system?.decimalPrecision || 4}
              onChange={(e) =>
                onUpdate("system.decimalPrecision", parseInt(e.target.value))
              }
              className="configForm__input"
            />
            <div className="configForm__help">
              Number of decimal places for tax calculations
            </div>
          </div>

          <div className="configForm__field">
            <label className="configForm__label">Rounding Method</label>
            <select
              value={config?.system?.roundingMethod || "half_even"}
              onChange={(e) =>
                onUpdate("system.roundingMethod", e.target.value)
              }
              className="configForm__select"
            >
              <option value="half_even">Half Even (Bankers)</option>
              <option value="half_up">Half Up</option>
              <option value="half_down">Half Down</option>
              <option value="ceil">Ceiling</option>
              <option value="floor">Floor</option>
            </select>
          </div>
        </div>
      </div>

      <div className="configForm__section">
        <h3 className="configForm__section-title">Tax Calculation Settings</h3>

        <div className="configForm__grid">
          <div className="configForm__field configForm__field--checkbox">
            <label className="configForm__checkbox-label">
              <input
                type="checkbox"
                checked={config?.calculation?.includeShipping || false}
                onChange={(e) =>
                  onUpdate("calculation.includeShipping", e.target.checked)
                }
                className="configForm__checkbox"
              />
              Include Shipping in Tax Calculation
            </label>
          </div>

          <div className="configForm__field configForm__field--checkbox">
            <label className="configForm__checkbox-label">
              <input
                type="checkbox"
                checked={config?.calculation?.taxOnTax || false}
                onChange={(e) =>
                  onUpdate("calculation.taxOnTax", e.target.checked)
                }
                className="configForm__checkbox"
              />
              Enable Tax-on-Tax (Compound Tax)
            </label>
          </div>

          <div className="configForm__field configForm__field--checkbox">
            <label className="configForm__checkbox-label">
              <input
                type="checkbox"
                checked={config?.calculation?.validateAddress || true}
                onChange={(e) =>
                  onUpdate("calculation.validateAddress", e.target.checked)
                }
                className="configForm__checkbox"
              />
              Validate Address Before Calculation
            </label>
          </div>

          <div className="configForm__field">
            <label className="configForm__label">Default Tax Category</label>
            <select
              value={config?.calculation?.defaultCategory || "standard"}
              onChange={(e) =>
                onUpdate("calculation.defaultCategory", e.target.value)
              }
              className="configForm__select"
            >
              <option value="standard">Standard</option>
              <option value="reduced">Reduced Rate</option>
              <option value="zero">Zero Rate</option>
              <option value="exempt">Exempt</option>
            </select>
          </div>
        </div>
      </div>

      <div className="configForm__section">
        <h3 className="configForm__section-title">Compliance Settings</h3>

        <div className="configForm__grid">
          <div className="configForm__field">
            <label className="configForm__label">
              Audit Retention (Months)
            </label>
            <input
              type="number"
              min="12"
              max="84"
              value={config?.compliance?.auditRetention || 36}
              onChange={(e) =>
                onUpdate("compliance.auditRetention", parseInt(e.target.value))
              }
              className="configForm__input"
            />
            <div className="configForm__help">
              How long to keep audit records (12-84 months)
            </div>
          </div>

          <div className="configForm__field">
            <label className="configForm__label">
              Certificate Expiry Warning (Days)
            </label>
            <input
              type="number"
              min="1"
              max="90"
              value={config?.compliance?.certificateWarningDays || 30}
              onChange={(e) =>
                onUpdate(
                  "compliance.certificateWarningDays",
                  parseInt(e.target.value)
                )
              }
              className="configForm__input"
            />
          </div>

          <div className="configForm__field configForm__field--checkbox">
            <label className="configForm__checkbox-label">
              <input
                type="checkbox"
                checked={config?.compliance?.autoArchive || false}
                onChange={(e) =>
                  onUpdate("compliance.autoArchive", e.target.checked)
                }
                className="configForm__checkbox"
              />
              Auto-archive Old Rates
            </label>
          </div>

          <div className="configForm__field configForm__field--checkbox">
            <label className="configForm__checkbox-label">
              <input
                type="checkbox"
                checked={config?.compliance?.requireDeactivationReason || true}
                onChange={(e) =>
                  onUpdate(
                    "compliance.requireDeactivationReason",
                    e.target.checked
                  )
                }
                className="configForm__checkbox"
              />
              Require Deactivation Reason
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

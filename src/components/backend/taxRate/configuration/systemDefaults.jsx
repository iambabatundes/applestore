// components/admin/tax/configuration/SystemDefaults.jsx
import React from "react";
import { FaInfoCircle, FaPlus, FaTrash } from "react-icons/fa";

export function SystemDefaults({ config, onUpdate }) {
  const addDefaultRate = () => {
    const newRate = {
      id: Date.now().toString(),
      country: "",
      region: "",
      taxType: "VAT",
      rate: 0,
      category: "standard",
    };

    const defaults = [...(config?.defaults?.rates || []), newRate];
    onUpdate("defaults.rates", defaults);
  };

  const updateDefaultRate = (index, field, value) => {
    const rates = [...(config?.defaults?.rates || [])];
    rates[index] = { ...rates[index], [field]: value };
    onUpdate("defaults.rates", rates);
  };

  const removeDefaultRate = (index) => {
    const rates = (config?.defaults?.rates || []).filter((_, i) => i !== index);
    onUpdate("defaults.rates", rates);
  };

  return (
    <div className="systemDefaults">
      <div className="systemDefaults__section">
        <h3 className="systemDefaults__section-title">Default Tax Rates</h3>
        <p className="systemDefaults__section-description">
          Pre-configured tax rates that apply when no specific rate is found
        </p>

        <div className="systemDefaults__rates">
          {(config?.defaults?.rates || []).map((rate, index) => (
            <div key={rate.id} className="systemDefaults__rate-row">
              <div className="systemDefaults__rate-fields">
                <input
                  type="text"
                  placeholder="Country (e.g., US)"
                  value={rate.country}
                  onChange={(e) =>
                    updateDefaultRate(
                      index,
                      "country",
                      e.target.value.toUpperCase()
                    )
                  }
                  className="systemDefaults__input systemDefaults__input--country"
                  maxLength="2"
                />

                <input
                  type="text"
                  placeholder="Region (optional)"
                  value={rate.region}
                  onChange={(e) =>
                    updateDefaultRate(index, "region", e.target.value)
                  }
                  className="systemDefaults__input"
                />

                <select
                  value={rate.taxType}
                  onChange={(e) =>
                    updateDefaultRate(index, "taxType", e.target.value)
                  }
                  className="systemDefaults__select"
                >
                  <option value="VAT">VAT</option>
                  <option value="GST">GST</option>
                  <option value="SALES">Sales Tax</option>
                  <option value="EXCISE">Excise Tax</option>
                </select>

                <input
                  type="number"
                  step="0.001"
                  min="0"
                  max="100"
                  value={rate.rate}
                  onChange={(e) =>
                    updateDefaultRate(index, "rate", parseFloat(e.target.value))
                  }
                  className="systemDefaults__input systemDefaults__input--rate"
                />

                <select
                  value={rate.category}
                  onChange={(e) =>
                    updateDefaultRate(index, "category", e.target.value)
                  }
                  className="systemDefaults__select"
                >
                  <option value="standard">Standard</option>
                  <option value="reduced">Reduced</option>
                  <option value="zero">Zero</option>
                </select>
              </div>

              <button
                className="systemDefaults__remove-btn"
                onClick={() => removeDefaultRate(index)}
                title="Remove default rate"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <button className="systemDefaults__add-btn" onClick={addDefaultRate}>
          <FaPlus /> Add Default Rate
        </button>
      </div>

      <div className="systemDefaults__section">
        <h3 className="systemDefaults__section-title">Fallback Behavior</h3>

        <div className="systemDefaults__fallback-grid">
          <div className="systemDefaults__field">
            <label className="systemDefaults__label">When No Rate Found</label>
            <select
              value={config?.defaults?.fallbackBehavior || "use_default"}
              onChange={(e) =>
                onUpdate("defaults.fallbackBehavior", e.target.value)
              }
              className="systemDefaults__select"
            >
              <option value="use_default">Use Default Rate</option>
              <option value="throw_error">Throw Error</option>
              <option value="zero_tax">Apply Zero Tax</option>
            </select>
            <div className="systemDefaults__help">
              <FaInfoCircle />
              What to do when no specific tax rate is found
            </div>
          </div>

          <div className="systemDefaults__field">
            <label className="systemDefaults__label">
              Global Fallback Rate (%)
            </label>
            <input
              type="number"
              step="0.001"
              min="0"
              max="100"
              value={config?.defaults?.globalFallbackRate || 0}
              onChange={(e) =>
                onUpdate(
                  "defaults.globalFallbackRate",
                  parseFloat(e.target.value)
                )
              }
              className="systemDefaults__input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

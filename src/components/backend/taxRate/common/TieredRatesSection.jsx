import React from "react";
import { InputField } from "../../common/inputField";

export function TieredRatesSection({
  tier,
  onTierChange,
  onAddTier,
  tieredRates,
  onRemoveTier,
}) {
  return (
    <div className="tieredRate__form">
      <h3>Tiered Rates</h3>

      <InputField
        type="number"
        name="minAmount"
        value={tier.minAmount}
        onChange={onTierChange}
        placeholder="Min Amount"
      />
      <InputField
        type="number"
        name="maxAmount"
        value={tier.maxAmount}
        onChange={onTierChange}
        placeholder="Max Amount"
      />
      <InputField
        type="number"
        name="rate"
        value={tier.rate}
        onChange={onTierChange}
        placeholder="Rate (%)"
      />
      <button type="button" onClick={onAddTier}>
        Add Tiered Rate
      </button>

      {tieredRates.length > 0 && (
        <ul className="tiered-rates-list">
          {tieredRates.map((tier, index) => (
            <li key={index}>
              Min: {tier.minAmount}, Max: {tier.maxAmount}, Rate: {tier.rate}%
              <button type="button" onClick={() => onRemoveTier(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

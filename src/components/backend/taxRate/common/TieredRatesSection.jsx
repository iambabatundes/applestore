import React from "react";
import { InputField } from "../../common/inputField";
import "../styles/taxForm.css";

export function TieredRatesSection({
  tier,
  onTierChange,
  onAddTier,
  tieredRates,
  onRemoveTier,
}) {
  return (
    <div className="tieredRate__form">
      <h3 className="taxForm__heading">Tiered Rates</h3>

      <InputField
        type="number"
        name="minAmount"
        value={tier.minAmount}
        onChange={onTierChange}
        placeholder="Min Amount"
        inputFieldContainer="taxForm__container"
        inputFieldInput="taxForm__input"
      />
      <InputField
        type="number"
        name="maxAmount"
        value={tier.maxAmount}
        onChange={onTierChange}
        placeholder="Max Amount"
        inputFieldContainer="taxForm__container"
        inputFieldInput="taxForm__input"
      />
      <InputField
        type="number"
        name="rate"
        value={tier.rate}
        onChange={onTierChange}
        placeholder="Rate (%)"
        inputFieldContainer="taxForm__container"
        inputFieldInput="taxForm__input"
      />
      <button type="button" onClick={onAddTier} className="tieredRate__Addbtn">
        Add Tiered Rate
      </button>

      {tieredRates.length > 0 && (
        <ul className="tieredRates__lists">
          {tieredRates.map((tier, index) => (
            <li className="tieredRate__list" key={index}>
              Min: {tier.minAmount}, Max: {tier.maxAmount}, Rate: {tier.rate}%
              <button
                className="tieredRate__btn"
                type="button"
                onClick={() => onRemoveTier(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

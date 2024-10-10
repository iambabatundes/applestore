import React from "react";
import { InputField } from "../common/inputField";
import { TieredRatesSection } from "./common/TieredRatesSection";
import { useTaxForm } from "./hook/useTaxForm";

export default function TaxForm({ currentTax, onSaveComplete }) {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    tier,
    handleTierChange,
    addTieredRate,
    removeTieredRate,
  } = useTaxForm(currentTax, onSaveComplete);

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1>{currentTax ? "Edit Tax Rate" : "Create Tax Rate"}</h1>
        <InputField
          autoFocus
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          error={errors.country}
        />
        <InputField
          type="text"
          name="region"
          value={formData.region}
          onChange={handleChange}
          placeholder="Region"
          error={errors.region}
        />

        <InputField
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          error={errors.city}
        />

        <InputField
          type="text"
          name="taxCode"
          value={formData.taxCode}
          onChange={handleChange}
          placeholder="Tax Code"
          error={errors.taxCode}
        />

        <InputField
          type="number"
          name="taxRate"
          value={formData.taxRate}
          onChange={handleChange}
          placeholder="Tax Rate (%)"
          error={errors.taxRate}
        />

        <InputField
          label="Is Global"
          type="checkbox"
          name="isGlobal"
          checked={formData.isGlobal}
          onChange={handleChange}
        />

        <InputField
          label="Is Active"
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
        />

        <InputField
          type="date"
          name="effectiveDate"
          value={formData.effectiveDate}
          onChange={handleChange}
          placeholder="Effective Date"
          error={errors.effectiveDate}
        />

        <InputField
          type="date"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          placeholder="Expiration Date"
          error={errors.expirationDate}
        />

        <TieredRatesSection
          tier={tier}
          onTierChange={handleTierChange}
          onAddTier={addTieredRate}
          tieredRates={formData.tieredRates}
          onRemoveTier={removeTieredRate}
        />

        <button type="submit">
          {currentTax ? "Update Tax" : "Create Tax"}
        </button>
      </form>
    </section>
  );
}

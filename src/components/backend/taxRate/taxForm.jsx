import React from "react";
import { InputField } from "../common/inputField";
import { TieredRatesSection } from "./common/TieredRatesSection";
import { useTaxForm } from "./hook/useTaxForm";
import "./styles/taxForm.css";

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
    <section className="taxForm">
      <form onSubmit={handleSubmit}>
        <h1 className="taxForm__heading">
          {currentTax ? "Edit Tax Rate" : "Create Tax Rate"}
        </h1>
        <div className="taxForm__main">
          <InputField
            autoFocus
            type="text"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            placeholder="Country"
            error={errors.country}
            inputFieldContainer="taxForm__container"
            inputFieldInput="taxForm__input"
            inputFieldError="taxForm__error"
          />

          <div className="taxForm__group">
            <InputField
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Region"
              error={errors.region}
              inputFieldContainer="taxForm__container"
              inputFieldInput="taxForm__input"
              inputFieldError="taxForm__error"
            />

            <InputField
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              error={errors.city}
              inputFieldContainer="taxForm__container"
              inputFieldInput="taxForm__input"
            />
          </div>

          <div className="taxForm__group">
            <InputField
              type="text"
              name="taxCode"
              value={formData.taxCode}
              onChange={handleChange}
              placeholder="Tax Code"
              error={errors.taxCode}
              inputFieldContainer="taxForm__container"
              inputFieldInput="taxForm__input"
              inputFieldError="taxForm__error"
            />

            <InputField
              type="number"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              placeholder="Tax Rate (%)"
              error={errors.taxRate}
              inputFieldContainer="taxForm__container"
              inputFieldInput="taxForm__input"
              inputFieldError="taxForm__error"
            />
          </div>

          <div className="taxForm__checkbox">
            <InputField
              label="IsGlobal"
              type="checkbox"
              name="isGlobal"
              checked={formData.isGlobal}
              onChange={handleChange}
              inputFieldContainer="taxForm__container-isGlobal"
              inputFieldInput="taxForm__isGlobal"
              inputFieldLabel="taxForm__isGlobal-label"
            />

            <InputField
              label="IsActive"
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              inputFieldContainer="taxForm__isActive"
              inputFieldInput="taxForm__isActive-input"
              inputFieldLabel="taxForm__isActive-label"
            />
          </div>

          <div className="taxForm__group">
            <InputField
              type="date"
              name="effectiveDate"
              value={formData.effectiveDate}
              onChange={handleChange}
              placeholder="Effective Date"
              error={errors.effectiveDate}
              label="Effective Date"
              inputFieldContainer="taxForm__container"
              inputFieldInput="taxForm__input"
              inputFieldError="taxForm__error"
              inputFieldLabel="taxForm__label"
            />

            <InputField
              type="date"
              name="expirationDate"
              label="Expiration Date"
              value={formData.expirationDate || ""}
              onChange={handleChange}
              placeholder="Expiration Date"
              error={errors.expirationDate}
              inputFieldContainer="taxForm__container"
              inputFieldInput="taxForm__input"
              inputFieldError="taxForm__error"
              inputFieldLabel="taxForm__label"
            />
          </div>
          <TieredRatesSection
            tier={tier}
            onTierChange={handleTierChange}
            onAddTier={addTieredRate}
            tieredRates={formData.tieredRates}
            onRemoveTier={removeTieredRate}
          />
        </div>

        <button className="taxForm__btn" type="submit">
          {currentTax ? "Update Tax" : "Create Tax"}
        </button>
      </form>
    </section>
  );
}

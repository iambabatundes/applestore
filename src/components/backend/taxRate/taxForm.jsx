import React from "react";
import { InputField } from "../common/inputField";
import { SelectField } from "../common/selectField";
import { TieredRatesSection } from "./common/TieredRatesSection";
import { ProductCategoriesSection } from "./productCategoriesSection";
import { TaxCalculationPreview } from "./common/taxCalculationPreview";
import { useTaxForm } from "./hook/useTaxForm";
import "./styles/taxForm.css";

const TAX_TYPES = [
  { value: "VAT", label: "VAT" },
  { value: "GST", label: "GST" },
  { value: "SALES", label: "Sales Tax" },
  { value: "EXCISE", label: "Excise Tax" },
  { value: "IMPORT", label: "Import Tax" },
  { value: "OTHER", label: "Other" },
];

const JURISDICTION_LEVELS = [
  { value: "FEDERAL", label: "Federal" },
  { value: "STATE", label: "State" },
  { value: "COUNTY", label: "County" },
  { value: "CITY", label: "City" },
  { value: "MUNICIPAL", label: "Municipal" },
];

export default function TaxForm({ currentTax, onSaveComplete, onCancel }) {
  const {
    formData,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    tier,
    handleTierChange,
    addTieredRate,
    removeTieredRate,
    categoryInput,
    setCategoryInput,
    addProductCategory,
    productCategories,
    removeProductCategory,
    excludedCategoryInput,
    setExcludedCategoryInput,
    addExcludedCategory,
    excludedCategories,
    removeExcludedCategory,
    calculationPreview,
    testCalculation,
  } = useTaxForm(currentTax, onSaveComplete);

  return (
    <section className="taxForm">
      <form onSubmit={handleSubmit}>
        <div className="taxForm__header">
          <h1 className="taxForm__heading">
            {currentTax ? `Edit ${currentTax.taxName}` : "Create Tax Rate"}
          </h1>
          {currentTax && (
            <button
              type="button"
              className="taxForm__cancel-btn"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="taxForm__main">
          {/* Basic Information Section */}
          <div className="taxForm__section">
            <h3 className="taxForm__section-heading">Basic Information</h3>

            <div className="taxForm__group">
              <InputField
                autoFocus
                type="text"
                name="taxName"
                value={formData.taxName || ""}
                onChange={handleChange}
                placeholder="Tax Name (e.g., California Sales Tax)"
                error={errors.taxName}
                inputFieldContainer="taxForm__container"
                inputFieldInput="taxForm__input"
                inputFieldError="taxForm__error"
                required
              />

              <InputField
                type="text"
                name="taxCode"
                value={formData.taxCode || ""}
                onChange={handleChange}
                placeholder="Tax Code (e.g., CA_SALES)"
                error={errors.taxCode}
                inputFieldContainer="taxForm__container"
                inputFieldInput="taxForm__input"
                inputFieldError="taxForm__error"
                required
              />
            </div>

            <div className="taxForm__group">
              <SelectField
                name="taxType"
                value={formData.taxType}
                onChange={handleChange}
                options={TAX_TYPES}
                placeholder="Select Tax Type"
                error={errors.taxType}
                selectContainer="taxForm__container"
                selectInput="taxForm__select"
                selectError="taxForm__error"
              />

              <InputField
                type="number"
                name="taxRate"
                value={formData.taxRate || ""}
                onChange={handleChange}
                placeholder="Tax Rate (%)"
                error={errors.taxRate}
                inputFieldContainer="taxForm__container"
                inputFieldInput="taxForm__input"
                inputFieldError="taxForm__error"
                min="0"
                max="100"
                step="0.01"
                required
              />
            </div>

            <InputField
              type="text"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Description (optional)"
              error={errors.description}
              inputFieldContainer="taxForm__container"
              inputFieldInput="taxForm__input"
              inputFieldError="taxForm__error"
            />
          </div>

          {/* Location Information */}
          <div className="taxForm__section">
            <h3 className="taxForm__section-heading">
              Location & Jurisdiction
            </h3>

            <div className="taxForm__group">
              <InputField
                type="text"
                name="country"
                value={formData.country || ""}
                onChange={handleChange}
                placeholder="Country Code (e.g., US)"
                error={errors.country}
                inputFieldContainer="taxForm__container"
                inputFieldInput="taxForm__input"
                inputFieldError="taxForm__error"
                maxLength="3"
                required
              />

              <SelectField
                name="jurisdictionLevel"
                value={formData.jurisdictionLevel}
                onChange={handleChange}
                options={JURISDICTION_LEVELS}
                placeholder="Jurisdiction Level"
                error={errors.jurisdictionLevel}
                selectContainer="taxForm__container"
                selectInput="taxForm__select"
                selectError="taxForm__error"
              />
            </div>

            <div className="taxForm__group">
              <InputField
                type="text"
                name="region"
                value={formData.region || ""}
                onChange={handleChange}
                placeholder="Region/State"
                error={errors.region}
                inputFieldContainer="taxForm__container"
                inputFieldInput="taxForm__input"
                inputFieldError="taxForm__error"
              />

              <InputField
                type="text"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                placeholder="City"
                error={errors.city}
                inputFieldContainer="taxForm__container"
                inputFieldInput="taxForm__input"
                inputFieldError="taxForm__error"
              />
            </div>

            <InputField
              type="text"
              name="postalCode"
              value={formData.postalCode || ""}
              onChange={handleChange}
              placeholder="Postal Code"
              error={errors.postalCode}
              inputFieldContainer="taxForm__container"
              inputFieldInput="taxForm__input"
              inputFieldError="taxForm__error"
            />

            <InputField
              type="text"
              name="taxAuthority"
              value={formData.taxAuthority || ""}
              onChange={handleChange}
              placeholder="Tax Authority (e.g., California DOR)"
              error={errors.taxAuthority}
              inputFieldContainer="taxForm__container"
              inputFieldInput="taxForm__input"
              inputFieldError="taxForm__error"
            />
          </div>

          {/* Settings & Configuration */}
          <div className="taxForm__section">
            <h3 className="taxForm__section-heading">Configuration</h3>

            <div className="taxForm__checkbox-group">
              <InputField
                label="Global Tax Rate"
                type="checkbox"
                name="isGlobal"
                checked={formData.isGlobal}
                onChange={handleChange}
                inputFieldContainer="taxForm__checkbox-container"
                inputFieldInput="taxForm__checkbox"
                inputFieldLabel="taxForm__checkbox-label"
              />

              <InputField
                label="Active"
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                inputFieldContainer="taxForm__checkbox-container"
                inputFieldInput="taxForm__checkbox"
                inputFieldLabel="taxForm__checkbox-label"
              />

              <InputField
                label="Apply to Shipping"
                type="checkbox"
                name="applyToShipping"
                checked={formData.applyToShipping}
                onChange={handleChange}
                inputFieldContainer="taxForm__checkbox-container"
                inputFieldInput="taxForm__checkbox"
                inputFieldLabel="taxForm__checkbox-label"
              />

              <InputField
                label="Compound Tax"
                type="checkbox"
                name="isCompound"
                checked={formData.isCompound}
                onChange={handleChange}
                inputFieldContainer="taxForm__checkbox-container"
                inputFieldInput="taxForm__checkbox"
                inputFieldLabel="taxForm__checkbox-label"
              />
            </div>

            {formData.isCompound && (
              <InputField
                type="number"
                name="compoundOrder"
                value={formData.compoundOrder || 0}
                onChange={handleChange}
                placeholder="Compound Order"
                error={errors.compoundOrder}
                inputFieldContainer="taxForm__container"
                inputFieldInput="taxForm__input"
                inputFieldError="taxForm__error"
                min="0"
              />
            )}

            <InputField
              type="number"
              name="priority"
              value={formData.priority || 0}
              onChange={handleChange}
              placeholder="Priority (higher = applied first)"
              error={errors.priority}
              inputFieldContainer="taxForm__container"
              inputFieldInput="taxForm__input"
              inputFieldError="taxForm__error"
              min="0"
            />
          </div>

          {/* Validity Period */}
          <div className="taxForm__section">
            <h3 className="taxForm__section-heading">Validity Period</h3>

            <div className="taxForm__group">
              <InputField
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate || ""}
                onChange={handleChange}
                placeholder="Effective Date"
                error={errors.effectiveDate}
                label="Effective Date"
                inputFieldContainer="taxForm__container"
                inputFieldInput="taxForm__input"
                inputFieldError="taxForm__error"
                inputFieldLabel="taxForm__label"
                required
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
          </div>

          {/* Advanced Features */}
          <TieredRatesSection
            tier={tier}
            onTierChange={handleTierChange}
            onAddTier={addTieredRate}
            tieredRates={formData.tieredRates}
            onRemoveTier={removeTieredRate}
          />

          <ProductCategoriesSection
            categoryInput={categoryInput}
            setCategoryInput={setCategoryInput}
            addProductCategory={addProductCategory}
            productCategories={productCategories}
            removeProductCategory={removeProductCategory}
            excludedCategoryInput={excludedCategoryInput}
            setExcludedCategoryInput={setExcludedCategoryInput}
            addExcludedCategory={addExcludedCategory}
            excludedCategories={excludedCategories}
            removeExcludedCategory={removeExcludedCategory}
          />

          {/* Tax Calculation Preview */}
          <TaxCalculationPreview
            calculationPreview={calculationPreview}
            onTestCalculation={testCalculation}
            taxRate={formData}
          />
        </div>

        <div className="taxForm__actions">
          <button
            className="taxForm__btn taxForm__btn--primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : currentTax
              ? "Update Tax Rate"
              : "Create Tax Rate"}
          </button>

          {!currentTax && (
            <button
              type="button"
              className="taxForm__btn taxForm__btn--secondary"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to clear the form?")
                ) {
                  // Reset form logic here
                }
              }}
            >
              Clear Form
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

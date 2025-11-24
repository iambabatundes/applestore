// components/admin/tax/common/ProductCategoriesSection.jsx
import React from "react";
import "./styles/taxForm.css";

export function ProductCategoriesSection({
  categoryInput,
  setCategoryInput,
  addProductCategory,
  productCategories = [], // Default to empty array
  removeProductCategory,
  excludedCategoryInput,
  setExcludedCategoryInput,
  addExcludedCategory,
  excludedCategories = [], // Default to empty array
  removeExcludedCategory,
}) {
  // Safe array access with default values
  const safeProductCategories = productCategories || [];
  const safeExcludedCategories = excludedCategories || [];

  return (
    <div className="taxForm__section">
      <h3 className="taxForm__section-heading">Product Categories</h3>
      <p className="taxForm__help-text">
        Specify which product categories this tax applies to. Leave empty to
        apply to all products.
      </p>

      {/* Included Categories */}
      <div className="taxForm__category-group">
        <label className="taxForm__label">Applicable Categories</label>
        <div className="taxForm__category-input-group">
          <input
            type="text"
            value={categoryInput || ""}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addProductCategory?.(); // Safe function call
              }
            }}
            placeholder="e.g., Electronics, Clothing"
            className="taxForm__input"
          />
          <button
            type="button"
            onClick={addProductCategory}
            className="taxForm__category-btn"
            disabled={!categoryInput?.trim()} // Disable if no input
          >
            Add
          </button>
        </div>

        {safeProductCategories.length > 0 && (
          <ul className="taxForm__category-list">
            {safeProductCategories.map((category, index) => (
              <li key={index} className="taxForm__category-item">
                <span>{category}</span>
                <button
                  type="button"
                  onClick={() => removeProductCategory?.(index)}
                  className="taxForm__category-remove"
                  aria-label="Remove category"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Excluded Categories */}
      <div className="taxForm__category-group">
        <label className="taxForm__label">Excluded Categories</label>
        <div className="taxForm__category-input-group">
          <input
            type="text"
            value={excludedCategoryInput || ""}
            onChange={(e) => setExcludedCategoryInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addExcludedCategory?.(); // Safe function call
              }
            }}
            placeholder="e.g., Food, Medicine"
            className="taxForm__input"
          />
          <button
            type="button"
            onClick={addExcludedCategory}
            className="taxForm__category-btn"
            disabled={!excludedCategoryInput?.trim()} // Disable if no input
          >
            Add
          </button>
        </div>

        {safeExcludedCategories.length > 0 && (
          <ul className="taxForm__category-list">
            {safeExcludedCategories.map((category, index) => (
              <li key={index} className="taxForm__category-item">
                <span>{category}</span>
                <button
                  type="button"
                  onClick={() => removeExcludedCategory?.(index)}
                  className="taxForm__category-remove"
                  aria-label="Remove excluded category"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

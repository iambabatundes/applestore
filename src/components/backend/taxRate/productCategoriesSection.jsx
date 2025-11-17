// ProductCategoriesSection.jsx
import React from "react";
import "../styles/taxForm.css";

export function ProductCategoriesSection({
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
}) {
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
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addProductCategory();
              }
            }}
            placeholder="e.g., Electronics, Clothing"
            className="taxForm__input"
          />
          <button
            type="button"
            onClick={addProductCategory}
            className="taxForm__category-btn"
          >
            Add
          </button>
        </div>

        {productCategories.length > 0 && (
          <ul className="taxForm__category-list">
            {productCategories.map((category, index) => (
              <li key={index} className="taxForm__category-item">
                <span>{category}</span>
                <button
                  type="button"
                  onClick={() => removeProductCategory(index)}
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
            value={excludedCategoryInput}
            onChange={(e) => setExcludedCategoryInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addExcludedCategory();
              }
            }}
            placeholder="e.g., Food, Medicine"
            className="taxForm__input"
          />
          <button
            type="button"
            onClick={addExcludedCategory}
            className="taxForm__category-btn"
          >
            Add
          </button>
        </div>

        {excludedCategories.length > 0 && (
          <ul className="taxForm__category-list">
            {excludedCategories.map((category, index) => (
              <li key={index} className="taxForm__category-item">
                <span>{category}</span>
                <button
                  type="button"
                  onClick={() => removeExcludedCategory(index)}
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

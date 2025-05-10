import React from "react";
import CategoriesSection from "../categoriesSection";
import Currency from "../common/currency";

export default function NavbarMenu({
  isOpen,
  categories,
  currencyRates,
  selectedCurrency,
  handleCurrencyChange,
  currencyLoading,
  currencyError,
  setIsOpen,
  menuRef,
}) {
  return (
    <div className={`navbar-menu ${isOpen ? "is-active" : ""}`} ref={menuRef}>
      <CategoriesSection
        categories={categories}
        className="navbar-category-mobile"
        onItemSelect={() => setIsOpen(false)}
      />

      <Currency
        currencies={currencyRates}
        selectedCurrency={selectedCurrency}
        onCurrencyChange={(value) => {
          handleCurrencyChange(value);
          setIsOpen(false); // Close after choosing from dropdown
        }}
        loading={currencyLoading}
        error={currencyError}
        className="currency-wrapper-mobile"
        onSelect={() => setIsOpen(false)}
      />
    </div>
  );
}

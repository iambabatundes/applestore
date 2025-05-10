import React, { useState } from "react";
import { useCurrencyStore } from "../../store/currencyStore";
import "../styles/currency.css";

export default function Currency({ className, onSelect }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    currencyRates,
    selectedCurrency,
    setSelectedCurrency,
    loadingCurrency,
    errorCurrency,
  } = useCurrencyStore();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setIsDropdownOpen(false);
    if (onSelect) onSelect();
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  if (errorCurrency) {
    return <div className="currency-error">{errorCurrency}</div>;
  }

  return (
    <div
      className={`currency-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="currency-dropdown" onClick={toggleDropdown}>
        <span className="currency-button">
          {selectedCurrency}
          <i
            className={`fa ${
              isDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"
            } dropdown-arrow`}
          ></i>
        </span>

        {isDropdownOpen && (
          <ul className="currency-list">
            {Object.keys(currencyRates).map((currency) => (
              <li
                key={currency}
                className="currency-item"
                onClick={() => handleCurrencyChange(currency)}
              >
                {currency}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "../styles/currency.css";

export default function Currency({
  currencies,
  selectedCurrency,
  onCurrencyChange,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCurrencyChange = (currency) => {
    onCurrencyChange(currency);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="currency-wrapper">
      <div className="currency-dropdown" onClick={toggleDropdown}>
        <span className="currency-button">
          {selectedCurrency}
          <span className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}>
            ▼
          </span>
        </span>

        {isDropdownOpen && (
          <ul className="currency-list">
            {Object.keys(currencies).map((currency) => (
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

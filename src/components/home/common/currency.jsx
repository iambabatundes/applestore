import React, { useState } from "react";
import "../styles/currency.css";

export default function Currency({
  currencies,
  selectedCurrency,
  onCurrencyChange,
  loading,
  error,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCurrencyChange = (currency) => {
    onCurrencyChange(currency);
    setIsDropdownOpen(false);
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  if (loading) {
    return <div className="currency-loading">Loading currencies...</div>;
  }

  if (error) {
    return <div className="currency-error">{error}</div>;
  }

  return (
    <div
      className="currency-wrapper"
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

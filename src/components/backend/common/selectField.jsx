// components/common/SelectField.jsx
import React from "react";
import "./styles/selectField.css";

export function SelectField({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  disabled = false,
  required = false,
  selectContainer = "",
  selectInput = "",
  selectError = "",
  label,
  helpText,
  className = "",
}) {
  const handleChange = (e) => {
    onChange({
      target: {
        name,
        value: e.target.value,
        type: "select",
      },
    });
  };

  const containerClass = `selectField__container ${selectContainer} ${className}`.trim();
  const selectClass = `selectField__select ${selectInput} ${
    error ? "selectField__select--error" : ""
  } ${disabled ? "selectField__select--disabled" : ""}`.trim();
  const errorClass = `selectField__error ${selectError}`.trim();

  return (
    <div className={containerClass}>
      {label && (
        <label htmlFor={name} className="selectField__label">
          {label}
          {required && <span className="selectField__required">*</span>}
        </label>
      )}
      
      <div className="selectField__input-wrapper">
        <select
          id={name}
          name={name}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={selectClass}
          aria-describedby={error ? `${name}-error` : undefined}
          aria-invalid={!!error}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label || option.value}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="selectField__arrow">
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {helpText && !error && (
        <div className="selectField__help-text">{helpText}</div>
      )}

      {error && (
        <div id={`${name}-error`} className={errorClass} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

// Enhanced SelectField with search functionality for large option sets
export function SearchableSelectField({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error,
  disabled = false,
  required = false,
  selectContainer = "",
  selectInput = "",
  selectError = "",
  label,
  helpText,
  className = "",
  searchPlaceholder = "Search...",
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const selectRef = React.useRef(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (optionValue) => {
    onChange({
      target: {
        name,
        value: optionValue,
        type: "select",
      },
    });
    setIsOpen(false);
    setSearchTerm("");
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const containerClass = `searchableSelect__container ${selectContainer} ${className}`.trim();
  const selectClass = `searchableSelect__select ${selectInput} ${
    error ? "searchableSelect__select--error" : ""
  } ${disabled ? "searchableSelect__select--disabled" : ""}`.trim();
  const errorClass = `selectField__error ${selectError}`.trim();

  return (
    <div className={containerClass} ref={selectRef}>
      {label && (
        <label htmlFor={name} className="selectField__label">
          {label}
          {required && <span className="selectField__required">*</span>}
        </label>
      )}
      
      <div className="searchableSelect__wrapper">
        <button
          type="button"
          className={`${selectClass} ${isOpen ? "searchableSelect__select--open" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="searchableSelect__selected-value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className="searchableSelect__arrow">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="searchableSelect__dropdown">
            <div className="searchableSelect__search">
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="searchableSelect__search-input"
                autoFocus
              />
            </div>
            
            <div className="searchableSelect__options">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`searchableSelect__option ${
                      option.value === value ? "searchableSelect__option--selected" : ""
                    } ${option.disabled ? "searchableSelect__option--disabled" : ""}`}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    disabled={option.disabled}
                  >
                    {option.label}
                    {option.value === value && (
                      <span className="searchableSelect__checkmark">✓</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="searchableSelect__no-options">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {helpText && !error && (
        <div className="selectField__help-text">{helpText}</div>
      )}

      {error && (
        <div id={`${name}-error`} className={errorClass} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
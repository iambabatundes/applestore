import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/selectPromotion.css";

export default function SelectInput({
  label,
  name,
  options,
  value,
  onChange,
  error,
  selectContainer,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Handle closing dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectRef]);

  // Handle option select
  const handleOptionSelect = (option) => {
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  return (
    <div className={`${selectContainer}`} ref={selectRef}>
      <label htmlFor={name} className="selectinput__label">
        {label}
      </label>

      <div
        className={`select__input ${isOpen ? "select__input--open" : ""} ${
          error ? "select__input-error" : ""
        }`}
        // onClick={() => setIsOpen(!isOpen)}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {value || "Select an option"}
        <i
          className={`fa ${
            isOpen ? "fa-chevron-up" : "fa-chevron-down"
          } dropdown-arrow select__arrow`}
        ></i>
      </div>

      {isOpen && (
        <ul className="select__dropdown">
          {options.map((option) => (
            <li
              key={option}
              className={`select__option ${
                option === value ? "select__option-selected" : ""
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="selectinput__error">{error}</p>}
    </div>
  );
}

SelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

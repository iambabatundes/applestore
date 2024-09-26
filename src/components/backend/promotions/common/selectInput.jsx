import React from "react";
import PropTypes from "prop-types";
// import "../styles/selectinput.css";

export default function SelectInput({
  label,
  name,
  options,
  value,
  onChange,
  error,
}) {
  return (
    <div className="selectinput__container">
      <label htmlFor={name} className="selectinput__label">
        {label}
      </label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`selectinput__input ${
          error ? "selectinput__input--error" : ""
        }`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
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

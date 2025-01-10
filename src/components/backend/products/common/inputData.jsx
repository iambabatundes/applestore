import React from "react";
import "../styles/colorForm.css";

export default function InputData({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  error,
  darkMode,
  checked,
}) {
  return (
    <>
      <label className={`form-label ${darkMode ? "dark-mode" : ""}`}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label={placeholder}
        className={`productForm__input ${darkMode ? "dark-mode" : ""}`}
        checked={checked}
      />
      {error && (
        <p className={`product__errorMessage ${darkMode ? "dark-mode" : ""}`}>
          {error}
        </p>
      )}
    </>
  );
}

import React from "react";

export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  errors,
  tooltip,
  darkMode,
  autoFocus,
}) {
  return (
    <div className="productForm__field-container">
      <label
        htmlFor="name"
        className={`productForm__label ${darkMode ? "dark-mode" : ""}`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className={`productForm__input ${darkMode ? "dark-mode" : ""}`}
        placeholder={placeholder}
        spellCheck
        autoComplete="true"
        autoFocus={autoFocus}
        size={20}
      />
      {errors && (
        <div className="product__errorMessage alert-danger">{errors}</div>
      )}
      <span className="productForm__tooltip">{tooltip}</span>
    </div>
  );
}

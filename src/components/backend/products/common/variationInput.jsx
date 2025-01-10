import React from "react";

export default function VariationInput({
  value,
  placeholder,
  type = "text",
  onChange,
  errors,
  darkMode,
}) {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        aria-label={placeholder}
        className={`productForm__input ${darkMode ? "dark-mode" : ""}`}
      />
      {errors && (
        <p className={`error-message ${darkMode ? "dark-mode" : ""}`}>
          {errors}
        </p>
      )}
    </>
  );
}

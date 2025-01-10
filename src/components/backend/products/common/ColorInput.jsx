import React from "react";

export default function ColorInput({
  checked,
  errors,
  value,
  darkMode,
  placeholder,
  type = "text",
  onChange,
}) {
  return (
    <>
      <input
        type={type}
        checked={checked}
        placeholder={placeholder}
        value={value || ""}
        aria-label={placeholder}
        onChange={onChange}
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

import React from "react";

export default function VariablesInput({
  checked,
  errors,
  value,
  darkMode,
  placeholder,
  type = "text",
  onChange,
  name,
}) {
  return (
    <>
      <input
        type={type}
        name={name}
        checked={checked}
        placeholder={placeholder}
        value={value || ""}
        aria-label={placeholder}
        onChange={onChange}
        className={`productForm__input ${darkMode ? "dark-mode" : ""}`}
      />
      {errors && (
        <p className={`product__errorMessage ${darkMode ? "dark-mode" : ""}`}>
          {errors}
        </p>
      )}
    </>
  );
}

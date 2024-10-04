import React from "react";

export function InputField({
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  placeholder,
  inputFieldContainer,
  inputFieldLabel,
  inputFieldInput,
  inputFieldError,
}) {
  return (
    <div className={`${inputFieldContainer}`}>
      {label && <label className={`${inputFieldLabel}`}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${inputFieldInput}`}
      />
      {error && <p className={`${inputFieldError}`}>{error}</p>}
    </div>
  );
}

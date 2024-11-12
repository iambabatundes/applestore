import React from "react";
import "../styles/couponForm.css";

export default function FormField({
  autoFocus,
  label,
  placeholder,
  type,
  name,
  value,
  handleChange,
  error,
  textarea,
  tooltipTitle,
  tooltip,
  input,
  textArea,
  formContainer,
  formLabel,
  formInput,
  formError,
  inputError,
}) {
  return (
    <div className={`coupon__formContainer ${formContainer || ""}`}>
      <label className={`coupon__label ${formLabel || ""}`}>{label}</label>
      {input && (
        <input
          autoFocus={autoFocus}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`coupon__input ${formInput || ""} ${
            error ? `${inputError || "coupon__input-error"}` : ""
          }`}
        />
      )}
      {textarea && (
        <textarea
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          cols="30"
          rows="10"
          className={`formTextArea ${textArea || ""}`}
        />
      )}
      {error && <p className={`coupon__error ${formError || ""}`}>{error}</p>}
      {tooltip && <span className="formTooltip-title">{tooltipTitle}</span>}
    </div>
  );
}

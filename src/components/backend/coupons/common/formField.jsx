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
}) {
  return (
    <div className="coupon__formContainer">
      <label className="coupon__label">{label}</label>
      <input
        autoFocus={autoFocus}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`coupon__input ${error ? "coupon__input-error" : ""}`}
      />
      {error && <p className="coupon__error">{error}</p>}
    </div>
  );
}

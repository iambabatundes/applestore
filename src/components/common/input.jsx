import React from "react";
import "./styles/input.css";
// import { ErrorMessage } from "formik";

export default function Input({
  name,
  meta,
  className,
  value,
  setFieldValue,
  tooltip,
  tooltipTitle,
  placeholder,
  input,
  type,
}) {
  return (
    <div className={`checkout-add__address ${className}`}>
      <input
        className={`${
          meta.touched && meta.error ? "error-input" : "active-input"
        }`}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => setFieldValue(name, e.target.value)}
        placeholder={placeholder}
      />
      {input && (
        <input
          className="address-field"
          placeholder="Apt, suite, unit, building, floor, etc."
        />
      )}
      {tooltip && <span className="phoneNumber-tooltip">{tooltipTitle}</span>}
    </div>
  );
}

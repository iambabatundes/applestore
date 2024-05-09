import React from "react";
// import "./modal.css";

export default function Input({
  name,
  label,
  value,
  onChange,
  autoFocus,
  error,
  type,
  placeholder,
  alert,
  alertDanger,
  className,
}) {
  const getInputClassName = () => {
    if (error) {
      return `${className} invalid-input`;
    } else if (value) {
      return `${className} valid-input`;
    } else if (value === "") {
      return `${className} blue-outline`;
    }
    return className;
  };

  return (
    <>
      <label htmlFor={name} className={`form-label ${className}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        // className={`form-control ${className}`}
        className={getInputClassName()}
        autoFocus={autoFocus}
        onChange={onChange}
        placeholder={placeholder}
        id={name}
        required
      />
      {error && <div className={`${alert} ${alertDanger}`}>{error}</div>}
    </>
  );
}

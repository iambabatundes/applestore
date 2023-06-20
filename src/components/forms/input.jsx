import React from "react";
import "../styles/newsletter.css";

export default function Input({
  name,
  label,
  value,
  onChange,
  autoFocus,
  error,
  type,
  placeholder,
  className,
}) {
  return (
    <section>
      <label htmlFor={name} className={`form-label ${className}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        className={`form-control ${className}`}
        autoFocus={autoFocus}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </section>
  );
}

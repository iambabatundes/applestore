import React from "react";

function Input({
  name,
  label,
  value,
  onChange,
  autoFocus,
  error,
  type,
  tooltip,
  tooltipTitle,
}) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        name={name}
        id={name}
        type={type}
        className="form-control"
      />
      {tooltip && <span className={`tooltip-title`}>{tooltipTitle}</span>}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}

export default Input;

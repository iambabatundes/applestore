import React from "react";

export default function Input({
  className,
  name,
  type,
  onChange,
  id,
  checked,
  value,
  placeholder,
  size,
  spellCheck,
  autoComplete,
  label,
  autoFocus,
  tooltip,
  tooltipTitle,
  classNameLabel,
}) {
  return (
    <>
      {label && (
        <label htmlFor={name} className={`${classNameLabel}`}>
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        id={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={`${className}`}
        placeholder={placeholder}
        size={size}
        spellCheck={spellCheck}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />
      {tooltip && <span className={`tooltip-title`}>{tooltipTitle}</span>}
    </>
  );
}

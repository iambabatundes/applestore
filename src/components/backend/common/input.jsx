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
}) {
  return (
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
      className={`${className}`}
      placeholder={placeholder}
      size={size}
      spellCheck={spellCheck}
      autoComplete={autoComplete}
    />
  );
}

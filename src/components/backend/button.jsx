import React from "react";

export default function Button({
  className,
  disabled,
  iconData,
  title,
  type,
  onClick,
  onChange,
}) {
  return (
    <button
      className={`${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onChange={onChange}
    >
      {iconData && <i className={iconData} aria-hidden="true"></i>}
      {title}
    </button>
  );
}

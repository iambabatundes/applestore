import React from "react";

export default function Button({ className, disabled, title, type, onClick }) {
  return (
    <button
      className={`${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
}

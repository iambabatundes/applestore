import React from "react";

export default function ButtonSmall({ children, className }) {
  return (
    <button className={`${className}`}>
      <span>{children}</span>
    </button>
  );
}

import React from "react";

export default function Button({ children, disabled, className, type }) {
  return (
    <section>
      <button className={`${className}`} type={type} disabled={disabled}>
        {children}
      </button>
    </section>
  );
}

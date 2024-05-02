import React from "react";

export default function InputText({ name, className, labelTitle }) {
  return (
    <section className={`${className}`}>
      <label htmlFor={name}>{labelTitle}</label>
    </section>
  );
}

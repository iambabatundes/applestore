import React from "react";
import "./modal.css";

export default function ModalHeading({ className, title, subtitle, sub }) {
  return (
    <section>
      <h5 className={`modal-title ${className}`}>{title}</h5>
      {subtitle && <p className={`${sub}`}>{subtitle}</p>}
    </section>
  );
}

import React from "react";

export default function Button({ title, type, className, onClick }) {
  return (
    <button className={`${className}`} type={type} onClick={onClick}>
      {title}
    </button>
  );
}

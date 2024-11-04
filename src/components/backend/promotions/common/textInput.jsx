import React from "react";

const TextInput = ({
  label,
  name,
  value,
  placeholder,
  onChange,
  error,
  type = "text",
  textarea,
  checked,
  className = "promotions__input",
}) => (
  <div className="promotionForm__container">
    <label htmlFor={name}>{label}</label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="promotions__input"
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${className}`}
        placeholder={placeholder}
        checked={checked}
      />
    )}
    {error && <p className="promotions__error-text">{error}</p>}
  </div>
);

export default TextInput;

import React from "react";
import "../styles/tagForm.css";

const TagField = ({
  autoFocus,
  error,
  name,
  value,
  tooltipTitle,
  type,
  onChange,
  placeholder,
}) => (
  <div className="dataForm__container">
    {type === "textarea" ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`date__input ${error ? "dataInput-error" : ""}`}
        placeholder={placeholder}
      />
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`date__input ${error ? "dataInput-error" : ""}`}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    )}
    {tooltipTitle && <span className="tag__tooltip">{tooltipTitle}</span>}
    {error && <p className="dataform-error">{error}</p>}
  </div>
);

export default TagField;

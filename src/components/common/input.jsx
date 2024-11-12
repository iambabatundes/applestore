import React from "react";
import "./styles/input.css";

export default function Input({
  name,
  meta,
  className,
  value,
  setFieldValue,
  tooltip,
  tooltipTitle,
  placeholder,
  input,
  type,
  textarea,
  fieldInput,
  select,
  options,
}) {
  const renderOptions = (options) => {
    return options.map((item) => (
      <option
        key={item.id}
        value={item.id}
        style={{ marginLeft: `${item.depth * 20}px` }}
      >
        {"—".repeat(item.depth)} {item.name}
      </option>
    ));
  };

  return (
    <div className={`checkout-add__address ${className}`}>
      {fieldInput && (
        <input
          className={`${
            meta.touched && meta.error ? "error-input" : "active-input"
          }`}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={(e) => setFieldValue(name, e.target.value)}
          placeholder={placeholder}
        />
      )}
      {input && (
        <input
          className="address-field"
          placeholder="Apt, suite, unit, building, floor, etc."
        />
      )}

      {textarea && (
        <textarea
          id={name}
          name={name}
          key={name}
          cols="30"
          rows="10"
          value={value}
          onChange={(e) => setFieldValue(name, e.target.value)}
        ></textarea>
      )}

      {select && (
        <select
          name={name}
          id={name}
          value={value}
          onChange={(e) => setFieldValue(name, e.target.value)}
        >
          <option value="">{placeholder}</option>
          {renderOptions(options)}
        </select>
      )}
      {tooltip && <span className={`tooltip-title`}>{tooltipTitle}</span>}
    </div>
  );
}

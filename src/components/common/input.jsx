import React from "react";
import "./styles/input.css";
// import { ErrorMessage } from "formik";

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
  flattenedCategories,
}) {
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setFieldValue(name, selectedValue);
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
          cols="30"
          key={name}
          rows="10"
          value={value}
          // className="textareas"
        ></textarea>
      )}

      {select && (
        <select name={name} id={name} value={value} onChange={handleChange}>
          <option value="">{placeholder}</option>
          {flattenedCategories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.depth > 0
                ? `${"\u00A0".repeat(item.depth * 2)}${item.name}`
                : item.name}
            </option>
          ))}
        </select>
      )}
      {tooltip && <span className={`tooltip-title`}>{tooltipTitle}</span>}
    </div>
  );
}

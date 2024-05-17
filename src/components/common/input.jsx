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
}) {
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
          // onChange={onChange}
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
          onChange={(e) => setFieldValue(name, e.target.value)}
          // className="textareas"
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

          {options.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      )}
      {tooltip && <span className={`tooltip-title`}>{tooltipTitle}</span>}
    </div>
  );
}

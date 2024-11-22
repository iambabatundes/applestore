import React from "react";
import "../styles/categoryForm.css";

const renderOptions = (options) => {
  return options.map((item) => (
    <option
      key={item._id}
      value={item._id}
      style={{ marginLeft: `${item.depth * 20}px` }}
    >
      {"—".repeat(item.depth)} {item.name}
    </option>
  ));
};

const CategoryField = ({
  autoFocus,
  error,
  name,
  value,
  tooltipTitle,
  type,
  onChange,
  placeholder,
  options = [],
}) => (
  <div className="category-Form__container">
    {type === "textarea" ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`categoryForm__input ${error ? "categoryForm-error" : ""}`}
        placeholder={placeholder}
      />
    ) : type === "select" ? (
      <select name={name} id={name} value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {renderOptions(options)}
      </select>
    ) : (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`categoryForm__input ${error ? "categoryForm-error" : ""}`}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    )}
    {tooltipTitle && (
      <span className="categoryForm__tooltip">{tooltipTitle}</span>
    )}
    {error && <p className="categoryForm-error">{error}</p>}
  </div>
);

export default CategoryField;

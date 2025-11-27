import React, { useId } from "react";
import "../styles/categoryForm.css";

const renderOptions = (options) => {
  if (!options || options.length === 0) {
    return (
      <option value="" disabled>
        No options available
      </option>
    );
  }

  return options.map((item) => (
    <option
      key={item._id}
      value={item._id}
      style={{ paddingLeft: `${item.depth * 20}px` }}
    >
      {"—".repeat(item.depth)} {item.name}
    </option>
  ));
};

const CategoryField = ({
  autoFocus = false,
  error,
  name,
  value,
  tooltipTitle,
  type = "text",
  onChange,
  onBlur,
  placeholder,
  options = [],
  required = false,
  disabled = false,
  maxLength,
  minLength,
  pattern,
  ...rest
}) => {
  // Generate unique IDs for accessibility
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  // Determine which IDs to use for aria-describedby
  const describedBy = [];
  if (error) describedBy.push(errorId);
  if (tooltipTitle) describedBy.push(helpId);

  // Common input props
  const commonProps = {
    id: fieldId,
    name,
    value: value || "",
    onChange,
    onBlur,
    disabled,
    required,
    "aria-required": required,
    "aria-invalid": !!error,
    "aria-describedby":
      describedBy.length > 0 ? describedBy.join(" ") : undefined,
    className: `categoryForm__input ${
      error ? "categoryForm__input--error" : ""
    } ${disabled ? "categoryForm__input--disabled" : ""}`,
    ...rest,
  };

  const renderField = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            {...commonProps}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={4}
            aria-label={placeholder || name}
          />
        );

      case "select":
        return (
          <div className="categoryForm__select-wrapper">
            <select {...commonProps} aria-label={placeholder || name}>
              <option value="">{placeholder || "Select an option"}</option>
              {renderOptions(options)}
            </select>
            <i
              className="fa fa-chevron-down categoryForm__select-icon"
              aria-hidden="true"
            ></i>
          </div>
        );

      default:
        return (
          <input
            {...commonProps}
            type={type}
            placeholder={placeholder}
            autoFocus={autoFocus}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            aria-label={placeholder || name}
          />
        );
    }
  };

  return (
    <div className="category-Form__container">
      <label htmlFor={fieldId} className="categoryForm__label">
        {placeholder || name}
        {required && (
          <span className="categoryForm__required" aria-label="required">
            *
          </span>
        )}
      </label>

      {renderField()}

      {tooltipTitle && (
        <span className="categoryForm__tooltip" id={helpId}>
          <i className="fa fa-info-circle" aria-hidden="true"></i>
          {tooltipTitle}
        </span>
      )}

      {error && (
        <p className="categoryForm-error" id={errorId} role="alert">
          <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
          {error}
        </p>
      )}

      {/* Character count for textarea and text inputs with maxLength */}
      {maxLength && (type === "textarea" || type === "text") && value && (
        <span className="categoryForm__char-count" aria-live="polite">
          {value.length} / {maxLength}
        </span>
      )}
    </div>
  );
};

export default CategoryField;

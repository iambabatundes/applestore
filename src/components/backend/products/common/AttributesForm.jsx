import React, { useState } from "react";
import "../styles/attributes.css";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function AttributesForm({
  darkMode,
  attributes,
  onAttributesChange,
}) {
  const [errors, setErrors] = useState({});

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    onAttributesChange(updatedAttributes);

    // Validate the field
    const updatedErrors = { ...errors };
    if (!value) {
      updatedErrors[index] = {
        ...updatedErrors[index],
        [field]: `${field} is required`,
      };
    } else {
      if (updatedErrors[index]) delete updatedErrors[index][field];
      if (Object.keys(updatedErrors[index] || {}).length === 0)
        delete updatedErrors[index];
    }
    setErrors(updatedErrors);
  };

  const addAttribute = () => {
    const updatedAttributes = [...attributes, { key: "", value: "" }];
    onAttributesChange(updatedAttributes);

    // Add empty error state for the new attribute
    setErrors({
      ...errors,
      [attributes.length]: {
        key: "Key is required",
        value: "Value is required",
      },
    });
  };

  const removeAttribute = (index) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    onAttributesChange(updatedAttributes);

    // Remove errors for the deleted attribute
    const updatedErrors = { ...errors };
    delete updatedErrors[index];

    // Shift errors for subsequent attributes
    const shiftedErrors = {};
    Object.keys(updatedErrors).forEach((key) => {
      const newKey = key > index ? key - 1 : key;
      shiftedErrors[newKey] = updatedErrors[key];
    });
    setErrors(shiftedErrors);
  };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();

  //   // Check for empty fields
  //   const validationErrors = {};
  //   attributes.forEach((attr, index) => {
  //     if (!attr.key || !attr.value) {
  //       validationErrors[index] = {
  //         key: !attr.key ? "Key is required" : "",
  //         value: !attr.value ? "Value is required" : "",
  //       };
  //     }
  //   });

  //   setErrors(validationErrors);

  //   if (Object.keys(validationErrors).length === 0) {
  //     console.log("Form submitted successfully", attributes);
  //   } else {
  //     console.log("Validation errors", validationErrors);
  //   }
  // };

  return (
    <div className={`productAttributes ${darkMode ? "dark-mode" : ""}`}>
      <h1 className={`attributes__title ${darkMode ? "dark-mode" : ""}`}>
        Attributes
      </h1>
      {attributes.map((attribute, index) => (
        <div key={index} className="productForm__attribute">
          <div>
            <input
              type="text"
              name="key"
              placeholder="Key"
              value={attribute.key}
              onChange={(e) =>
                handleAttributeChange(index, "key", e.target.value)
              }
              className={`productForm__input ${darkMode ? "dark-mode" : ""}`}
            />
            {errors[index]?.key && (
              <small
                className={`product__errorMessage ${
                  darkMode ? "dark-mode" : ""
                }`}
              >
                {errors[index].key}
              </small>
            )}
          </div>
          <div>
            <input
              type="text"
              name="value"
              placeholder="Value"
              value={attribute.value}
              onChange={(e) =>
                handleAttributeChange(index, "value", e.target.value)
              }
              className={`productForm__input ${darkMode ? "dark-mode" : ""}`}
            />
            {errors[index]?.value && (
              <small
                className={`product__errorMessage ${
                  darkMode ? "dark-mode" : ""
                }`}
              >
                {errors[index].value}
              </small>
            )}
          </div>
          <span onClick={() => removeAttribute(index)} className="btn-remove">
            <FaTrash /> Remove
          </span>
        </div>
      ))}
      <button
        onClick={(e) => {
          e.preventDefault();
          addAttribute();
        }}
        className="btn-add"
      >
        <FaPlus /> Add Attribute
      </button>
    </div>
  );
}

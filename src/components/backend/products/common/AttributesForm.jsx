import React from "react";
import "../styles/attributes.css";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function AttributesForm({
  darkMode,
  attributes,
  errors,
  onAttributesChange,
}) {
  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    onAttributesChange(updatedAttributes);
  };

  const addAttribute = () => {
    onAttributesChange([...attributes, { key: "", value: "" }]);
  };

  const removeAttribute = (index) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    onAttributesChange(updatedAttributes);
  };

  return (
    <div className={`productAttributes ${darkMode ? "dark-mode" : ""}`}>
      <h1 className={`attributes__title ${darkMode ? "dark-mode" : ""}`}>
        Attributes
      </h1>
      {attributes.map((attribute, index) => (
        <div key={index} className="productForm__attribute">
          <input
            type="text"
            placeholder="Key"
            value={attribute.key}
            onChange={(e) =>
              handleAttributeChange(index, "key", e.target.value)
            }
            className={`productForm__input ${darkMode ? "dark-mode" : ""}`}
          />
          {errors?.[index]?.key && (
            <small className="error-message">{errors[index].key}</small>
          )}
          <input
            type="text"
            placeholder="Value"
            value={attribute.value}
            onChange={(e) =>
              handleAttributeChange(index, "value", e.target.value)
            }
            className={`productForm__input ${darkMode ? "dark-mode" : ""}`}
          />
          {errors?.[index]?.value && (
            <small className="error-message">{errors[index].value}</small>
          )}
          <span onClick={() => removeAttribute(index)} className="btn-remove">
            <FaTrash /> Remove
          </span>
        </div>
      ))}
      <button onClick={addAttribute} className="btn-add">
        <FaPlus /> Add Attribute
      </button>
    </div>
  );
}

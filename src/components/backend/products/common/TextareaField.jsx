import React from "react";
import ReactQuill from "react-quill";

export default function TextareaField({
  id,
  value,
  modules,
  label,
  onChange,
  errors,
  tooltip,
}) {
  return (
    <div className="productForm__editor-container">
      <label htmlFor="aboutProduct" className="productForm__label">
        {label}
      </label>
      <ReactQuill
        modules={modules}
        value={value}
        onChange={onChange}
        theme="snow"
        id={id}
      />
      {errors && <div className="alert alert-danger">{errors}</div>}
      <span className="productForm__tooltip">{tooltip}</span>
    </div>
  );
}

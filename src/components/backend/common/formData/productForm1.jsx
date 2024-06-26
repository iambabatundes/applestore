import React from "react";
import { Field, ErrorMessage } from "formik";
import ReactQuill from "react-quill";

export default function ProductForm({
  editorContent,
  handleEditorChange,
  handleSalePriceChange,
  showSaleDates,
}) {
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ color: [] }],
    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  return (
    <>
      <div>
        <label htmlFor="name">Name</label>
        <Field name="name" type="text" />
        <ErrorMessage name="name" component="div" />
      </div>

      <section>
        <div>
          <label htmlFor="sku">SKU</label>
          <Field name="sku" type="text" />
          <ErrorMessage name="sku" component="div" />
        </div>

        <div>
          <label htmlFor="weight">Weight</label>
          <Field name="weight" type="number" />
          <ErrorMessage name="weight" component="div" />
        </div>
      </section>

      <div>
        <label htmlFor="description">Description</label>
        <ReactQuill
          modules={modules}
          value={editorContent}
          onChange={handleEditorChange}
        />
        <ErrorMessage name="description" component="div" />
      </div>

      <section>
        <div>
          <label htmlFor="numberInStock">Number In Stock</label>
          <Field name="numberInStock" type="number" />
          <ErrorMessage name="numberInStock" component="div" />
        </div>

        <div>
          <label htmlFor="price">Price</label>
          <Field name="price" type="number" />
          <ErrorMessage name="price" component="div" />
        </div>
      </section>

      <section>
        <div>
          <label htmlFor="salePrice">Sale Price</label>
          <Field
            name="salePrice"
            type="number"
            onChange={handleSalePriceChange}
          />
          <ErrorMessage name="salePrice" component="div" />
        </div>
        {showSaleDates && (
          <>
            <div>
              <label htmlFor="saleStartDate">Sale Start Date</label>
              <Field name="saleStartDate" type="date" />
              <ErrorMessage name="saleStartDate" component="div" />
            </div>
            <div>
              <label htmlFor="saleEndDate">Sale End Date</label>
              <Field name="saleEndDate" type="date" />
              <ErrorMessage name="saleEndDate" component="div" />
            </div>
          </>
        )}
      </section>
    </>
  );
}

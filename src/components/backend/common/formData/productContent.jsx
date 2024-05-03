import React, { useState } from "react";
import ReactQuill from "react-quill";
import "./formContent.css";
import "./productContent.css";
import Button from "../../button";
import "../../styles/createNew.css";
import InputForm from "../../../common/inputForm";
import InputField from "../../../common/inputField";
import InputText from "../../../common/inputText";

export default function ProductForm() {
  const [editorContent, setEditorContent] = useState("");

  const handleChange = (content) => {
    setEditorContent(content);
  };

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript

    [{ color: [] }], // dropdown with defaults from theme
    // [{ font: [] }],

    ["clean"], // remove formatting button
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  return (
    <section className="formContent__main">
      <InputForm
        initialValues={{
          name: "",
          slug: "",
          description: "",
        }}
        // validationSchema={val}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        {(values, isSubmitting, setFieldValue) => (
          <>
            <section className="productForm__Container">
              <InputText
                labelTitle="Name"
                name="name"
                className="productForm__title"
              />
              <InputField
                name="name"
                fieldInput
                className="productForm__input"
              />
              <section className="form-input">
                <div>
                  <InputText
                    labelTitle="Weight"
                    name="weight"
                    className="productForm__title"
                  />
                  <InputField
                    name="weight"
                    fieldInput
                    className="productForm__input box"
                    placeholder="Weight (kg)"
                  />
                </div>
                <div>
                  <InputText
                    labelTitle="SKU"
                    name="sku"
                    className="productForm__title"
                  />
                  <InputField
                    name="sku"
                    fieldInput
                    className="productForm__input box"
                  />
                </div>
              </section>
              <section className="form-input">
                <div>
                  <InputText
                    labelTitle="Price"
                    name="price"
                    className="productForm__title"
                  />
                  <InputField
                    name="price"
                    fieldInput
                    className="productForm__input box"
                    placeholder="Price"
                  />
                </div>
                <div>
                  <InputText
                    labelTitle="Sale Price"
                    name="sale-price"
                    className="productForm__title"
                  />
                  <InputField
                    name="sale-price"
                    fieldInput
                    className="productForm__input box"
                  />
                </div>
              </section>

              <InputText
                labelTitle="Quantity"
                name="quantity"
                className="productForm__title"
              />
              <InputField
                name="quantity"
                fieldInput
                className="productForm__input"
              />
            </section>
          </>
        )}
      </InputForm>

      <div>
        <h1>Product Description</h1>
        <ReactQuill
          modules={modules}
          onChange={handleChange}
          value={editorContent}
          theme="snow"
          // formats={formats}
        />
      </div>
    </section>
  );
}

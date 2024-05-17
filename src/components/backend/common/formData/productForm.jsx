import React from "react";
import ReactQuill from "react-quill";
// import "./productForm.css";
import Input from "./formInput";
import InputForm from "../../../common/inputForm";
import InputText from "../../../common/inputText";
import InputField from "../../../common/inputField";
import { validationSchema } from "../../products/validateForm";

export default function ProductForm({
  data,
  productSchema,
  editorContent,
  handleChange,
  handleSubmit,
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
    <section className="productForm__main">
      <section>
        <InputForm
          initialValues={{
            name: "",
            sku: "",
            description: "",
            numberInStock: "",
            price: "",
            salePrice: "",
            saleStartDate: "",
            saleEndDate: "",
            weight: "",
            discountPercentage: "",
            featureImage: "",
            media: [],
            category: "",
            tags: [],
            subcategory: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(values, isSubmitting, setFieldValue) => (
            <>
              <InputText labelTitle="Name" name="name" />
              <InputField
                name="name"
                type="text"
                fieldInput
                placeholder="Product name"
                // value={values.name}
                // onChange={setFieldValue}
              />

              <section style={{ display: "flex", alignItems: "center" }}>
                <InputText labelTitle="SKU" name="sku" />
                <InputField
                  name="sku"
                  type="text"
                  fieldInput
                  placeholder="Sku"
                  // value={values.name}
                  // onChange={setFieldValue}
                />

                <InputText labelTitle="Weight" name="weight" />
                <InputField
                  name="weight"
                  type="text"
                  fieldInput
                  placeholder="weight"
                  // value={values.name}
                  // onChange={setFieldValue}
                />
              </section>

              <section style={{ display: "flex", alignItems: "center" }}>
                <InputText labelTitle="Sale Price" name="salePrice" />
                <InputField
                  name="salePrice"
                  type="text"
                  fieldInput
                  placeholder="Sale Price"
                  // value={values.name}
                  // onChange={setFieldValue}
                />

                <InputText labelTitle="Sale Start Date" name="saleStartDate" />
                <InputField
                  name="saleStartDate"
                  type="text"
                  fieldInput
                  placeholder="price"
                  // value={values.name}
                  // onChange={setFieldValue}
                />
                <InputText labelTitle="Sale End Date" name="saleEndDate" />
                <InputField
                  name="saleEndDate"
                  type="text"
                  fieldInput
                  placeholder="price"
                  // value={values.name}
                  // onChange={setFieldValue}
                />
              </section>
              <section style={{ display: "flex", alignItems: "center" }}>
                <InputText labelTitle="Quantity" name="numberInStock" />
                <InputField
                  name="numberInStock"
                  type="text"
                  fieldInput
                  placeholder="Quantity"
                  // value={values.name}
                  // onChange={setFieldValue}
                />

                <InputText labelTitle="Price" name="price" />
                <InputField
                  name="price"
                  type="text"
                  fieldInput
                  placeholder="price"
                  // value={values.name}
                  // onChange={setFieldValue}
                />
              </section>
            </>
          )}
        </InputForm>
      </section>

      <div>
        <h1>Product Description</h1>
        <ReactQuill
          modules={modules}
          onChange={handleChange}
          value={editorContent}
          theme="snow"
        />
      </div>
    </section>
  );
}

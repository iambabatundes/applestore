import React from "react";
import ReactQuill from "react-quill";
// import "./productForm.css";
import Input from "./formInput";

export default function ProductForm({
  data,
  onChange,
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
      <form onSubmit={handleSubmit}>
        <div className="productForm__container">
          <Input
            name="name"
            label="Name"
            autoFocus
            onChange={onChange}
            placeholder="Product Name"
            type="text"
            value={data.name}
          />
          <Input
            name="sku"
            label="SKU"
            onChange={onChange}
            placeholder="Product SKU"
            type="text"
            value={data.sku}
          />

          <Input
            name="weight"
            label="Weight"
            onChange={onChange}
            placeholder="Weight"
            type="text"
            value={data.weight}
          />

          <Input
            name="price"
            label="Price"
            onChange={onChange}
            placeholder="Product price"
            type="number"
            value={data.price}
          />

          <Input
            name="salePrice"
            label="Sale Price"
            onChange={onChange}
            placeholder="Sale Price"
            type="number"
            value={data.salePrice}
          />
          <Input
            name="quantity"
            label="Quantity"
            onChange={onChange}
            placeholder="Product Quantity"
            type="number"
            value={data.quantity}
          />

          {/* Add other input fields as needed */}
        </div>

        <div>
          <h1>Product Description</h1>
          <ReactQuill
            modules={modules}
            onChange={handleChange}
            value={editorContent}
            theme="snow"
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

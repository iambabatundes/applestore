import React from "react";
import ReactQuill from "react-quill";
import "../styles/productForm.css";

export default function ProductForm({
  data,
  darkMode,
  handleInputChange,
  handleChangeDecription,
  editorDecription,
  handleChangeAbout,
  editorAbout,
  handleSubmit,
  handleProductDetails,
  editorproductDetails,
  handleProductInformation,
  editorProductInformation,
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
    <section className={`productForm__main ${darkMode ? "dark-mode" : ""}`}>
      <form onSubmit={handleSubmit}>
        <div className="productForm__field-container">
          <label
            htmlFor="name"
            className={`productForm__label ${darkMode ? "dark-mode" : ""}`}
          >
            Product Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={data.name}
            onChange={handleInputChange}
            // className="productForm__input"
            className={`productForm__input ${darkMode ? "dark-mode" : ""}`}
            placeholder="Product Name"
            spellCheck
            autoComplete
            autoFocus
            size={20}
          />
          <span className="productForm__tooltip">Enter your product name</span>
        </div>
        <section className="productForm__group-two">
          <div className="productForm__field-container">
            <label htmlFor="sku" className="productForm__label">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              id="sku"
              className="productForm__input"
              placeholder="SKU"
              size="20"
              value={data.sku || ""}
              onChange={handleInputChange}
            />
            <span className="productForm__tooltip">Enter your SKU</span>
          </div>

          <div className="productForm__field-container">
            <label htmlFor="weight" className="productForm__label">
              Weight
            </label>
            <input
              type="text"
              name="weight"
              id="weight"
              className="productForm__input"
              placeholder="Weight"
              size="20"
              value={data.weight || ""}
              onChange={handleInputChange}
            />
            <span className="productForm__tooltip">
              Enter the product weight
            </span>
          </div>
        </section>
        <section className="productForm__group-two">
          <div className="productForm__field-container">
            <label htmlFor="price" className="productForm__label">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              className="productForm__input"
              placeholder="Price"
              size="20"
              value={data.price || ""}
              onChange={handleInputChange}
            />
            <span className="productForm__tooltip">
              Enter the product price
            </span>
          </div>

          <div className="productForm__field-container">
            <label htmlFor="numberInStock" className="productForm__label">
              Quantity
            </label>
            <input
              type="number"
              name="numberInStock"
              id="numberInStock"
              className="productForm__input"
              placeholder="Quantity"
              size="20"
              value={data.numberInStock || ""}
              onChange={handleInputChange}
            />
            <span className="productForm__tooltip">
              Enter the product quantity
            </span>
          </div>
        </section>

        <section className="productForm__group-two">
          <div className="productForm__field-container">
            <label htmlFor="brand" className="productForm__label">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              id="brand"
              className="productForm__input"
              placeholder="Brand"
              size="20"
              value={data.brand || ""}
              onChange={handleInputChange}
            />
            <span className="productForm__tooltip">
              Enter the product brand
            </span>
          </div>

          <div className="productForm__field-container">
            <label htmlFor="manufacturer" className="productForm__label">
              Manufacturer
            </label>
            <input
              type="text"
              name="manufacturer"
              id="manufacturer"
              className="productForm__input"
              placeholder="Manufacturer"
              size="20"
              value={data.manufacturer || ""}
              onChange={handleInputChange}
            />
            <span className="productForm__tooltip">
              Enter the product manufacturer
            </span>
          </div>
        </section>

        <section className="productForm__group-two">
          <div className="productForm__field-container">
            <label htmlFor="salePrice" className="productForm__label">
              Sale Price
            </label>
            <input
              type="number"
              name="salePrice"
              id="salePrice"
              className="productForm__input"
              placeholder="Sale Price"
              size="20"
              value={data.salePrice || ""}
              onChange={handleInputChange}
            />
            <span className="productForm__tooltip">Enter the sale price</span>
          </div>
          <div className="productForm__field-container">
            <label htmlFor="saleStartDate" className="productForm__label">
              Sale Start Date
            </label>
            <input
              type="date"
              name="saleStartDate"
              id="saleStartDate"
              className="productForm__input"
              placeholder="Sale Start Date"
              size="20"
              value={data.saleStartDate || ""}
              onChange={handleInputChange}
            />
            <span className="productForm__tooltip">
              Enter the sale start date
            </span>
          </div>
          <div className="productForm__field-container">
            <label htmlFor="saleEndDate" className="productForm__label">
              Sale End Date
            </label>
            <input
              type="date"
              name="saleEndDate"
              id="saleEndDate"
              className="productForm__input"
              placeholder="Sale End Date"
              size="20"
              value={data.saleEndDate || ""}
              onChange={handleInputChange}
            />
            <span className="productForm__tooltip">
              Enter the sale end date
            </span>
          </div>
        </section>
        <section className="productForm__group-three"></section>

        <div className="productForm__editor-container">
          <label htmlFor="aboutProduct" className="productForm__label">
            About the Product
          </label>
          <ReactQuill
            modules={modules}
            onChange={handleChangeAbout}
            value={editorAbout}
            theme="snow"
            id="aboutProduct"
          />
          <span className="productForm__tooltip">
            Enter information About the Product
          </span>
        </div>

        <div className="productForm__editor-container">
          <label htmlFor="productHighlight" className="productForm__label">
            Product Details
          </label>
          <ReactQuill
            modules={modules}
            onChange={handleProductDetails}
            value={editorproductDetails}
            theme="snow"
            id="productHighlight"
          />
          <span className="productForm__tooltip">Enter product highlights</span>
        </div>

        <div className="productForm__editor-container">
          <label htmlFor="productDescription" className="productForm__label">
            Product Description
          </label>
          <ReactQuill
            modules={modules}
            onChange={handleChangeDecription}
            value={editorDecription}
            theme="snow"
            id="productDescription"
          />
          <span className="productForm__tooltip">
            Enter product description
          </span>
        </div>

        <div className="productForm__editor-container">
          <label htmlFor="productHighlight" className="productForm__label">
            Product Information
          </label>
          <ReactQuill
            modules={modules}
            onChange={handleProductInformation}
            value={editorProductInformation}
            theme="snow"
            id="productHighlight"
          />
          <span className="productForm__tooltip">Enter product highlights</span>
        </div>
      </form>
    </section>
  );
}

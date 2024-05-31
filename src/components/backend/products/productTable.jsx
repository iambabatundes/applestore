import React from "react";
import "./styles/product.css";
import { Link } from "react-router-dom";
import Table from "../common/table";
import config from "../../../config.json";

// Utility function to truncate content
function truncateContent(content, wordLimit) {
  const words = content.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return content;
}

export default function ProductTable({
  productData,
  onDelete,
  onPreview,
  onEdit,
  sortColumn,
  onSort,
}) {
  const columns = [
    {
      label: "Name",
      path: "name",
      sortable: true,
      content: (product) => (
        <Link to={`/product/${product._id}`}>{product.name}</Link>
      ),
    },
    { label: "SKU", path: "sku" },
    {
      label: "Description",
      path: "description",
      content: (product) => (
        <div
          dangerouslySetInnerHTML={{
            __html: truncateContent(product.description, 15),
          }}
        ></div>
      ),
    },

    { label: "In Stock", path: "numberInStock" },
    { label: "Price", path: "price" },
    { label: "Sale Price", path: "salePrice" },
    { label: "%", path: "discountPercentage" },
    { label: "Category", path: "category" },
    { label: "Tags", path: "tags" },
    { label: "Date", path: "createdAt" },
    {
      label: "Thumbnail",
      path: "featureImage",
      content: (product) => (
        <img
          className="productTable__img"
          src={config.mediaUrl + `/uploads/${product.featureImage.filename}`} // Corrected image path
          alt={product.name}
        />
      ),
    },

    {
      content: (product) => (
        <section className="product__icon">
          <i
            className="fa fa-edit"
            aria-hidden="true"
            onClick={() => onEdit(product)}
          ></i>
          <i
            className="fa fa-eye"
            aria-hidden="true"
            onClick={() => onPreview(product)}
          ></i>
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={() => onDelete(product)}
          ></i>
        </section>
      ),
    },

    // Add more headings as needed
  ];
  return (
    <Table
      className="ProductTable"
      columns={columns}
      data={productData}
      onSort={onSort}
      sortColumn={sortColumn}
      table="product__table"
      tbody="product__tbody"
      tbodyTr="product__tbodytr"
      td="product__td"
      th="product__th"
      thead="product__thead"
    />
  );
}

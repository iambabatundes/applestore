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

// Utility function to get image URL from various possible sources
function getImageUrl(imageRef) {
  if (!imageRef) return null;

  // If it's a populated Upload object with url
  if (typeof imageRef === "object") {
    if (imageRef.url) return imageRef.url;
    if (imageRef.cloudUrl) return imageRef.cloudUrl;
    if (imageRef.publicUrl) return imageRef.publicUrl;
    if (imageRef.filename) {
      return `${config.mediaUrl}/uploads/${imageRef.filename}`;
    }
  }

  // If it's just an ID string (not populated)
  if (typeof imageRef === "string") {
    // Can't display unpopulated reference
    return null;
  }

  return null;
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
      label: "About",
      path: "aboutProduct",
      content: (product) => (
        <div
          dangerouslySetInnerHTML={{
            __html: truncateContent(product.aboutProduct || "", 15),
          }}
        ></div>
      ),
    },
    { label: "In Stock", path: "numberInStock" },
    { label: "Price", path: "price" },
    { label: "Sale Price", path: "salePrice" },
    { label: "%", path: "discountPercentage" },
    {
      label: "Category",
      path: "category",
      content: (product) => {
        if (!product.category) return "-";
        if (Array.isArray(product.category)) {
          return product.category
            .map((cat) => (typeof cat === "object" ? cat.name : cat))
            .join(", ");
        }
        return typeof product.category === "object"
          ? product.category.name
          : product.category;
      },
    },
    {
      label: "Tags",
      path: "tags",
      content: (product) => {
        if (!product.tags || !Array.isArray(product.tags)) return "-";
        return product.tags
          .map((tag) => (typeof tag === "object" ? tag.name : tag))
          .join(", ");
      },
    },
    {
      label: "Date",
      path: "createdAt",
      content: (product) => {
        if (!product.createdAt) return "-";
        return new Date(product.createdAt).toLocaleDateString();
      },
    },
    {
      label: "Thumbnail",
      path: "featureImage",
      content: (product) => {
        const imageUrl = getImageUrl(product.featureImage);

        if (!imageUrl) {
          return (
            <div className="productTable__img-placeholder">
              <i className="fa fa-image" aria-hidden="true"></i>
            </div>
          );
        }

        return (
          <img
            className="productTable__img"
            src={imageUrl}
            alt={product.name}
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.target.style.display = "none";
              e.target.parentElement.innerHTML =
                '<div class="productTable__img-placeholder"><i class="fa fa-image"></i></div>';
            }}
          />
        );
      },
    },
    {
      content: (product) => (
        <section className="product__icon">
          <i
            className="fa fa-edit"
            aria-hidden="true"
            onClick={() => onEdit(product)}
            title="Edit"
          ></i>
          <i
            className="fa fa-eye"
            aria-hidden="true"
            onClick={() => onPreview(product)}
            title="Preview"
          ></i>
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={() => onDelete(product)}
            title="Delete"
          ></i>
        </section>
      ),
    },
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

import React from "react";
// import "../styles/posts.css";
import "../backend/styles/dataTable.css";
import { Link } from "react-router-dom";
import Table from "../backend/common/table";

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
      label: "Title",
      path: "title",
      sortable: true,
      content: (product) => (
        <Link to={`/blog/${product._id}`}>{product.title}</Link>
      ),
    },
    { label: "SKU", path: "sku" },
    { label: "In Stock", path: "numberInStock" },
    { label: "Price", path: "price" },
    { label: "Sale Price", path: "salePrice" },
    { label: "Categories", path: "categories" },
    { label: "Tags", path: "tags" },
    { label: "Review", path: "review" },
    { label: "Date", path: "datePosted" },
    {
      label: "Thumbnail",
      path: "image",
      content: (data) => <img src={data.image} alt={data.title} width={50} />,
    },

    {
      content: (post) => (
        <>
          <i
            className="fa fa-edit"
            aria-hidden="true"
            onClick={() => onEdit(post)}
          ></i>
          <i
            className="fa fa-eye"
            aria-hidden="true"
            onClick={() => onPreview(post)}
          ></i>
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={() => onDelete(post)}
          ></i>
        </>
      ),
    },

    // Add more headings as needed
  ];
  return (
    <Table
      columns={columns}
      data={productData}
      onSort={onSort}
      sortColumn={sortColumn}
    />
  );
}

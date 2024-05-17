import React from "react";
import { Link } from "react-router-dom";
import config from "../../../config.json";
import Table from "../common/table";
import "./styles/post.css";

export default function PostTable({
  data,
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
      content: (post) => <Link to={`/product/${post._id}`}>{post.title}</Link>,
    },

    { label: "Description", path: "description" },
    { label: "Category", path: "category" },
    { label: "Tags", path: "tags" },
    { label: "Comment", path: "comment" },
    { label: "Date", path: "createdAt" },
    {
      label: "Thumbnail",
      path: "featureImage",
      content: (post) => (
        <img
          className="postTable__img"
          src={config.mediaUrl + `/uploads/${post.postMainImage.filename}`} // Corrected image path
          alt={post.originalName}
        />
      ),
    },

    {
      content: (product) => (
        <section className="post__icon">
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
      columns={columns}
      onSort={onSort}
      sortColumn={sortColumn}
      data={data}
      className="PostTable"
      table="post__table"
      tbody="post__tbody"
      tbodyTr="post__tbodytr"
      td="post__td"
      th="post__th"
      thead="post__thead"
    />
  );
}

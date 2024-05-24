import React from "react";
import { Link } from "react-router-dom";
import config from "../../../config.json";
import Table from "../common/table";
import "./styles/post.css";

// Utility function to truncate content
function truncateContent(content, wordLimit) {
  const words = content.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return content;
}

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

    {
      label: "Content",
      path: "content",
      content: (post) => (
        <div
          dangerouslySetInnerHTML={{
            __html: truncateContent(post.content, 20),
          }}
        ></div>
      ),
    },
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
      content: (post) => (
        <section className="post__icon">
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

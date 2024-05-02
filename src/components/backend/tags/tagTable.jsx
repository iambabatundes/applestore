import React from "react";
import "../styles/posts.css";
import { Link } from "react-router-dom";
import Table from "../common/table";

export default function TagTable({
  handleSort,
  currentPosts,
  onDelete,
  onPreview,
  onEdit,
  sortColumn,
  onSort,
}) {
  const columns = [
    {
      label: "name",
      path: "name",
      sortable: true,
      content: (tag) => <Link to={`/tags/${tag._id}`}>{tag.name}</Link>,
    },

    { label: "Description", path: "Description" },
    { label: "Slug", path: "slug" },
    {
      label: "Count",
      path: "count",
      content: (tag) => <Link to={`/product/${tag._id}`}>{tag.count}</Link>,
    },

    {
      content: (tag) => (
        <>
          <i
            className="fa fa-edit"
            aria-hidden="true"
            onClick={() => onEdit(tag)}
          ></i>
          <i
            className="fa fa-eye"
            aria-hidden="true"
            onClick={() => onPreview(tag)}
          ></i>
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={() => onDelete(tag)}
          ></i>
        </>
      ),
    },

    // Add more headings as needed
  ];
  return (
    <Table
      columns={columns}
      data={currentPosts}
      handleSort={handleSort}
      onSort={onSort}
      sortColumn={sortColumn}
    />
  );
}

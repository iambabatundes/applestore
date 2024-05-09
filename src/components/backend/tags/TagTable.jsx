import React from "react";
import "../../backend/styles/dataTable.css";
import { Link } from "react-router-dom";
import Table from "../common/table";

export default function TagTable({
  handleSort,
  data,
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
      content: (tag) => (
        <span
          // to={`/tags/${tag._id}`}
          onClick={() => onPreview(tag)}
          style={{ cursor: "pointer" }}
        >
          {tag.name}
        </span>
      ),
    },

    { label: "Description", path: `${"description" || "—"}` },
    { label: "Slug", path: "slug" },
    {
      label: "Count",
      path: "productCount",
      content: (tag) => (
        <span
          onClick={() => onPreview(tag)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {tag.productCount}
        </span>
      ),
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
      data={data}
      handleSort={handleSort}
      onSort={onSort}
      sortColumn={sortColumn}
    />
  );
}

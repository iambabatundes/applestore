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
      content: (tag) => <Link to={`/tags/${tag._id}`}>{tag.name}</Link>,
    },

    { label: "Description", path: `${"description" || "—"}` },
    { label: "Slug", path: "slug" },
    {
      label: "Count",
      path: "count",
      content: (tag) => (
        <Link to={`/product/${tag._id}`}>{tag.count || 0}</Link>
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

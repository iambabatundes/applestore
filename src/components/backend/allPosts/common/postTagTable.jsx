import React from "react";
// import "../../backend/styles/dataTable.css";
import Table from "../../common/table";

export default function PostTagTable({
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
        <span onClick={() => onPreview(tag)} style={{ cursor: "pointer" }}>
          {tag.name}
        </span>
      ),
    },

    { label: "Description", path: `${"description" || "—"}` },
    { label: "Slug", path: "slug" },
    {
      label: "Count",
      path: "postCount",
      content: (tag) => (
        <span
          onClick={() => onPreview(tag)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {tag.postCount}
        </span>
      ),
    },

    {
      content: (tag) => (
        <section className="tag__icon">
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
        </section>
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
      table="postTag__table"
      tbody="postTag__tbody"
      tbodyTr="postTag__tbodytr"
      td="postTag__td"
      th="postTag__th"
      thead="postTag__thead"
      className="postTagTable"
    />
  );
}

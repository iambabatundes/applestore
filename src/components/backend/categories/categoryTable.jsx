import React from "react";
import "../../backend/styles/dataTable.css";
import { Link } from "react-router-dom";
import Table from "../../backend/common/table";

export default function CategoryTable({
  handleSort,
  data,
  onDelete,
  onPreview,
  onEdit,
  sortColumn,
  onSort,
}) {
  const renderCategoryName = (category) => {
    const indentation = "—".repeat(category.depth); // Append dashes based on depth
    return (
      <span style={{ marginLeft: `${category.depth * 10}px` }}>
        {indentation} {category.name}
      </span>
    );
  };
  const columns = [
    {
      label: "Name",
      path: "name",
      sortable: true,
      content: (cateory) => (
        <Link to={`/tags/${cateory._id}`}>{renderCategoryName(cateory)}</Link>
      ),
    },

    { label: "Description", path: "description" },
    { label: "Slug", path: "slug" },
    {
      label: "Count",
      path: "count",
      content: (category) => (
        <Link to={`/product/${category._id}`}>{category.count}</Link>
      ),
    },

    {
      content: (category) => (
        <>
          <i
            className="fa fa-edit"
            aria-hidden="true"
            onClick={() => onEdit(category)}
          ></i>
          <i
            className="fa fa-eye"
            aria-hidden="true"
            onClick={() => onPreview(category)}
          ></i>
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={() => onDelete(category)}
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

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
  loading,
  error,
  onFilter,
}) {
  if (loading) {
    return <span className="tagList__loading">Loading Tags list...</span>;
  }

  if (error) {
    return <span className="tagList__error">Error loading Tags list</span>;
  }

  const renderCategoryName = (category) => {
    const indentation = "—".repeat(category.depth);
    return (
      <span style={{ marginLeft: `${category.depth * 20}px` }}>
        {indentation} {category.name}
      </span>
    );
  };

  const columns = [
    {
      label: "Name",
      path: "name",
      sortable: true,
      content: (category) => (
        <span to={`/category/${category._id}`}>
          {renderCategoryName(category)}
        </span>
      ),
    },
    { label: "Description", path: "description" },
    { label: "Slug", path: "slug" },
    {
      label: "Count",
      path: "productCount",
      content: (category) => <span>{category.productCount}</span>,
    },
    {
      content: (category) => (
        <section className="category__icon">
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
            onClick={() => onDelete(category._id)}
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
      table="category__table"
      tbody="category__tbody"
      tbodyTr="category__tbodytr"
      td="category__td"
      th="category__th"
      thead="category__thead"
      className="categorgTable"
    />
  );
}

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
    return <span className="tagList__loading">Loading Categories list...</span>;
  }

  if (error) {
    return (
      <span className="tagList__error">Error loading Categories list</span>
    );
  }

  const renderCategoryName = (category) => {
    const indentation = "—".repeat(category.depth);
    return (
      <span style={{ marginLeft: `${category.depth * 20}px` }}>
        {indentation} {category.name}
      </span>
    );
  };

  const renderCategoryImage = (category) => {
    const imageUrl =
      category.categoryImage?.url ||
      category.categoryImage?.cloudUrl ||
      category.categoryImage?.publicUrl;

    if (!imageUrl) {
      return <span style={{ color: "#999" }}>No image</span>;
    }

    return (
      <img
        src={imageUrl}
        alt={category.name}
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "inline";
        }}
      />
    );
  };

  const columns = [
    {
      label: "Image",
      content: (category) => renderCategoryImage(category),
    },
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
      label: "Storage",
      content: (category) => (
        <span
          style={{
            fontSize: "12px",
            padding: "2px 8px",
            borderRadius: "12px",
            backgroundColor:
              category.categoryImage?.storageType === "cloudinary"
                ? "#e3f2fd"
                : "#f3e5f5",
            color:
              category.categoryImage?.storageType === "cloudinary"
                ? "#1976d2"
                : "#7b1fa2",
          }}
        >
          {category.categoryImage?.storageType || "local"}
        </span>
      ),
    },
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

import React from "react";
import "./styles/categoryList.css";

export default function CategoryList({
  error,
  loading,
  categories,
  onEdit,
  onDelete,
  onPreview,
}) {
  const renderCategory = (category) => {
    const indentation = "—".repeat(category.depth);

    if (loading) {
      return (
        <span className="categoryList__loading">
          Loading Categories list...
        </span>
      );
    }

    if (error) {
      return (
        <span className="categoryList__error">
          Error loading Categories list
        </span>
      );
    }

    return (
      <li key={category._id} className="category-item">
        <span style={{ marginLeft: `${category.depth * 20}px` }}>
          {indentation} {category.name}
        </span>
        <section className="category-actions">
          <i className="fa fa-edit" onClick={() => onEdit(category)}></i>
          <i className="fa fa-eye" onClick={() => onPreview(category)}></i>
          <i className="fa fa-trash" onClick={() => onDelete(category)}></i>
        </section>
      </li>
    );
  };

  return (
    <ul className="category-list">
      {categories.map((category) => renderCategory(category))}
    </ul>
  );
}

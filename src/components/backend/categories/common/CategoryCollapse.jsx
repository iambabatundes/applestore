import React, { useState } from "react";
// import "./categoryCollapse.css";

export default function CategoryCollapse({
  categories,
  onEdit,
  onDelete,
  onPreview,
  error,
  loading,
}) {
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (id) => {
    setOpenCategories((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const renderCategory = (category) => {
    const hasChildren =
      category.subcategories && category.subcategories.length > 0;
    const isOpen = openCategories[category._id];

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
      <div key={category._id} className="category-item">
        <div
          className="category-header"
          onClick={() => toggleCategory(category._id)}
        >
          <span>{category.name}</span>
          {hasChildren && (
            <i className={`fa fa-chevron-${isOpen ? "up" : "down"}`}></i>
          )}
        </div>
        {isOpen && hasChildren && (
          <div className="subcategory-list">
            {category.subcategories.map((sub) => renderCategory(sub))}
          </div>
        )}
        <section className="category-actions">
          <i className="fa fa-edit" onClick={() => onEdit(category)}></i>
          <i className="fa fa-eye" onClick={() => onPreview(category)}></i>
          <i className="fa fa-trash" onClick={() => onDelete(category)}></i>
        </section>
      </div>
    );
  };

  return (
    <section className="category-list">
      {categories.map((category) => renderCategory(category))}
    </section>
  );
}

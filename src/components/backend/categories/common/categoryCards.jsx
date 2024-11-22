import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/categoryCards.css";

export default function CategoryCards({ data, onDelete, onPreview, onEdit }) {
  const [openCategories, setOpenCategories] = useState({});

  const toggleSubcategories = (id) => {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCards = (categories) => {
    return categories.map((category) => (
      <div key={category._id} className="category-card">
        <div className="card-header">
          <div className="card-info">
            <Link to={`/category/${category.name}`} className="category-name">
              {category.name}
            </Link>
            <p className="category-slug">{category.slug}</p>
            <p className="category-description">{category.description}</p>
          </div>
          <div className="card-actions">
            <i className="fa fa-edit" onClick={() => onEdit(category)}></i>
            <i className="fa fa-eye" onClick={() => onPreview(category)}></i>
            <i className="fa fa-trash" onClick={() => onDelete(category)}></i>
            {category.subcategories && (
              <i
                className={`fa ${
                  openCategories[category._id]
                    ? "fa-chevron-up"
                    : "fa-chevron-down"
                }`}
                onClick={() => toggleSubcategories(category._id)}
              ></i>
            )}
          </div>
        </div>
        {openCategories[category._id] && category.subcategories && (
          <div className="card-subcategories">
            {renderCards(category.subcategories)}
          </div>
        )}
      </div>
    ));
  };

  return <div className="category-cards-container">{renderCards(data)}</div>;
}

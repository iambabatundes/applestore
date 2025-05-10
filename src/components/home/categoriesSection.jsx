import React, { useState } from "react";
import "./styles/categoriesSection.css";

export default function CategoriesSection({
  categories,
  className,
  onItemSelect,
}) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleMouseEnter = (index) => {
    setHoveredCategory(index);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const toggleDropdownVisibility = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleItemClick = () => {
    if (onItemSelect) {
      onItemSelect();
    }
  };

  return (
    <section className={`navbar-category-menus ${className}`}>
      <div className="category-dropdown">
        <button className="category-button" onClick={toggleDropdownVisibility}>
          ☰ All Categories
        </button>
        {isDropdownVisible && (
          <div className="navCategory">
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-item"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {category.name}
                {hoveredCategory === index &&
                  Array.isArray(category.subcategories) &&
                  category.subcategories.length > 0 && (
                    <div className="subcategories">
                      {category.subcategories.map((subcategory, subIndex) => (
                        <div key={subIndex} className="subcategory-item">
                          <strong>{subcategory.name}</strong>
                          <ul>
                            {Array.isArray(subcategory.items) &&
                              subcategory.items.map((item, itemIndex) => (
                                <li key={itemIndex} onClick={handleItemClick}>
                                  {item}
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

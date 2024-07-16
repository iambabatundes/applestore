import React, { useState } from "react";
import Button from "../button";
import "./styles/dataCategory.css";

export default function DataCategory({
  isCategoriesVisible,
  selectedCategories = [],
  setSelectedCategories,
  categories = [],
  setCategories,
  saveCategory,
  getCategories,
  errors,
  setErrors,
}) {
  const [newCategory, setNewCategory] = useState({
    name: "",
    parent: "",
  });
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) => {
      const isSelected = prevSelected.some(
        (selected) => selected._id === category._id
      );

      if (isSelected) {
        return prevSelected.filter((selected) => selected._id !== category._id);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const handleAddNewCategory = async (e) => {
    e.preventDefault();
    if (newCategory.name.trim() !== "") {
      try {
        const response = await saveCategory(newCategory);
        const updatedCategories = await getCategories();
        setCategories(updatedCategories.data);
        setSelectedCategories([...selectedCategories, response.data]);
        setNewCategory({ name: "", parent: "" });
        setIsAddingNewCategory(false);
        setErrors({ ...errors, category: "" });
      } catch (error) {
        setErrors({ ...errors, category: "Failed to add category" });
      }
    } else {
      setErrors({ ...errors, category: "Category name is required" });
    }
  };

  const flattenCategories = (categories, depth = 0) => {
    let flatCategories = [];
    categories.forEach((category) => {
      flatCategories.push({
        ...category,
        depth,
        label: `${"—".repeat(depth)} ${category.name}`,
      });
      if (category.subcategories) {
        flatCategories = [
          ...flatCategories,
          ...flattenCategories(category.subcategories, depth + 1),
        ];
      }
    });
    return flatCategories;
  };

  const flattenedCategories = flattenCategories(categories);

  return (
    <>
      {isCategoriesVisible && (
        <section className="categories">
          <div className="categories__list">
            {flattenedCategories.map((category) => (
              <div
                key={category._id}
                className="categories__item"
                style={{ marginLeft: category.depth * 20 }}
              >
                <label>
                  <input
                    className="categories__checkbox"
                    type="checkbox"
                    value={category._id}
                    checked={selectedCategories.some(
                      (selected) => selected._id === category._id
                    )}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category.label}
                </label>
              </div>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <p className="categories__info">
              The first selected category will be used as the primary category.
            </p>
          )}
          <Button
            title={isAddingNewCategory ? null : "+ Add New Category"}
            onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
            className="categories__add-button"
          />
          {isAddingNewCategory && (
            <form onSubmit={handleAddNewCategory} className="categories__form">
              <input
                type="text"
                placeholder="Search or add Category..."
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="categories__input"
              />
              <select
                value={newCategory.parent}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, parent: e.target.value })
                }
                className="categories__select"
              >
                <option value="">No Parent</option>
                {flattenedCategories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                    style={{ marginLeft: category.depth * 20 }}
                  >
                    {category.label}
                  </option>
                ))}
              </select>
              <Button
                type="submit"
                title="Add New Category"
                className="categories__submit-button"
              />
              <Button
                title={isAddingNewCategory ? "Cancel" : ""}
                onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                className="categories__cancel-button"
              />
              {errors.category && (
                <p className="categories__error">{errors.category}</p>
              )}
            </form>
          )}
        </section>
      )}
    </>
  );
}

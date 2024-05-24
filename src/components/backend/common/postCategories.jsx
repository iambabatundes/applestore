import React, { useState } from "react";
import Button from "../button";
import "./styles/PostCategories.css";

export default function PostCategories({
  isCategoriesVisible,
  selectedCategories,
  setSelectedCategories,
  categories,
  setCategories,
  savePostCategory,
  getPostCategories,
}) {
  const [newCategory, setNewCategory] = useState({
    name: "",
    parent: "",
  });
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [error, setError] = useState("");

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) => {
      const isSelected = prevSelected.include(
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
        const response = await savePostCategory(newCategory);
        const updatedCategories = await getPostCategories();
        setCategories(updatedCategories.data);
        setSelectedCategories([...selectedCategories, response.data]);
        setNewCategory({ name: "", parent: "" });
        setIsAddingNewCategory(false);
      } catch (error) {
        setError("Failed to add category");
      }
    }
  };

  const flattenCategories = (categories, depth = 0) => {
    let flatCategories = [];
    categories.forEach((category) => {
      flatCategories.push({
        ...category,
        depth,
        label: `${"--".repeat(depth)} ${category.name}`,
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
        <section className="post-categories">
          <div className="categories-list">
            {flattenedCategories.map((category) => (
              <div
                key={category._id}
                className="category-item"
                style={{ marginLeft: category.depth * 20 }}
              >
                <label>
                  <input
                    type="checkbox"
                    value={category._id}
                    checked={
                      selectedCategories &&
                      selectedCategories.include(
                        (selected) => selected._id === category._id
                      )
                    }
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category.name}
                </label>
              </div>
            ))}
          </div>
          {selectedCategories.length === 1 && (
            <p className="primary-category-info">
              The first selected category will be used as the primary category.
            </p>
          )}
          <Button
            title={isAddingNewCategory ? "Cancel" : "+ Add New Category"}
            onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
          />
          {isAddingNewCategory && (
            <form onSubmit={handleAddNewCategory} className="new-category-form">
              <input
                type="text"
                placeholder="Enter new category name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="new-category-input"
              />
              <select
                value={newCategory.parent}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, parent: e.target.value })
                }
                className="new-category-select"
              >
                <option value="">No Parent</option>
                {flattenedCategories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                    style={{ marginLeft: category.depth * 20 }}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              <Button type="submit" title="Add New Category" />
              {error && <p className="error-message">{error}</p>}
            </form>
          )}
        </section>
      )}
    </>
  );
}

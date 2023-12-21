import React, { useState } from "react";
import Button from "../button";

export default function PostCategories({ isCategoriesVisible, blogPosts }) {
  const [allCategories, setAllCategories] = useState(
    Array.from(new Set(blogPosts.flatMap((post) => post.categories || [])))
  );

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((selected) => selected !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() !== "") {
      const updatedCategories = Array.from(
        new Set([...allCategories, newCategory.trim()])
      );

      // Update allCategories with the new category
      setSelectedCategories((prevSelected) => [
        ...prevSelected,
        newCategory.trim(),
      ]);

      // Update allCategories state
      setAllCategories(updatedCategories);

      // Clear the newCategory input
      setNewCategory("");
    }
  };

  return (
    <>
      {isCategoriesVisible && (
        <section>
          {allCategories.map((category) => (
            <div key={category}>
              <label htmlFor="">
                <input
                  type="checkbox"
                  name={category}
                  id={category}
                  value={category}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            </div>
          ))}
          <Button
            title={isAddingNewCategory ? "Cancel" : "+Add New Category"}
            onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
          />
          {isAddingNewCategory && (
            <div>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button title="Add New Category" onClick={handleAddNewCategory} />
            </div>
          )}
        </section>
      )}
    </>
  );
}

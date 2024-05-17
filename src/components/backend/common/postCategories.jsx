import React, { useState, useEffect } from "react";
import Button from "../button";
import InputForm from "../../common/inputForm";
import InputField from "../../common/inputField";

export default function PostCategories({
  isCategoriesVisible,
  selectedCategories,
  setSelectedCategories,
  categories,
  setCategories,
  getCategory,
}) {
  const [newCategory, setNewCategory] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  const handleCategoryChange = (category) => {
    if (selectedCategories.length === 1) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories((prevSelected) => {
        if (prevSelected.includes(category)) {
          return prevSelected.filter((selected) => selected !== category);
        } else {
          return [category, prevSelected[0]];
        }
      });
    }
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim() !== "") {
      const existingCategory = getCategory(newCategory.trim());
      if (existingCategory) {
        if (selectedCategories.length === 1) {
          setSelectedCategories([newCategory.trim()]);
        } else {
          setSelectedCategories([newCategory.trim(), selectedCategories[0]]);
        }
      } else {
        const updatedCategories = [...selectedCategories, newCategory.trim()];
        setSelectedCategories(updatedCategories);
        setCategories([
          ...categories,
          { id: categories.length + 1, name: newCategory.trim() },
        ]);
      }
      setNewCategory("");
    }
  };

  const flattenCategories = (categories, depth = 0) => {
    let flatCategories = [];
    categories.forEach((category) => {
      flatCategories.push({ ...category, depth });
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

  useEffect(() => {
    handleCategoriesChange(selectedCategories);
  }, [selectedCategories]);

  const handleCategoriesChange = (selectedCategories) => {
    console.log("Selected categories:", selectedCategories);
  };

  return (
    <>
      {isCategoriesVisible && (
        <section>
          {flattenedCategories.map((category) => (
            <div key={category.id} style={{ marginLeft: category.depth * 20 }}>
              <label>
                <input
                  type="checkbox"
                  value={category.name}
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryChange(category.name)}
                />
                {category.name}
              </label>
            </div>
          ))}
          {selectedCategories.length === 2 && (
            <p>
              The first selected category will be used as the primary category.
            </p>
          )}
          <Button
            title={isAddingNewCategory ? "Cancel" : "+ Add New Category"}
            onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
          />
          {isAddingNewCategory && (
            <div>
              <InputForm
                initialValues={{
                  name: "",
                  parentCategory: "",
                }}
                // validationSchema={val}
                onSubmit={handleAddNewCategory}
              >
                {(values, isSubmitting, setFieldValue) => (
                  <>
                    <InputField
                      type="text"
                      placeholder="Parent Category"
                      name="category"
                      fieldInput
                      // value={newCategory}
                      // value={values}
                      // setFieldValue={setFieldValue}
                    />
                    <InputField
                      select
                      flattenedCategories={flattenedCategories}
                      // name="category"
                      placeholder="Parent Category"
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="addButton"
                      title="Add new category"
                    ></Button>
                  </>
                )}
              </InputForm>
              {/* <input
                type="text"
                placeholder="Enter new category..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              /> */}

              {/* <Button title="Add New Category" onClick={handleAddNewCategory} /> */}
            </div>
          )}
        </section>
      )}
    </>
  );
}

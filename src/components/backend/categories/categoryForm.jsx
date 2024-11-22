import React from "react";
import useCategoryForm from "./hooks/useCategoryForm";
import CategoryField from "./common/categoryField";
import "./styles/categoryForm.css";

export default function CategoryForm({
  onAddCategory,
  selectedCategory,
  onEditCategory,
  parentCategories = [],
}) {
  const initialValues = { name: "", slug: "", description: "", parent: "" };

  const onSubmit = (data) => {
    if (selectedCategory) {
      onEditCategory(selectedCategory._id, data);
    } else {
      onAddCategory(data);
    }
  };

  const { formData, errors, handleChange, handleSubmit } = useCategoryForm(
    initialValues,
    onSubmit,
    selectedCategory
  );

  return (
    <section className="categoryForm__container">
      <h1 className="categoryForm__title">
        {selectedCategory ? "Edit Category" : "Add New Category"}
      </h1>

      <form onSubmit={handleSubmit}>
        <CategoryField
          autoFocus
          name="name"
          placeholder="Category Name"
          type="text"
          value={formData.name}
          error={errors.name}
          onChange={handleChange}
          tooltipTitle="The name is how it appears on your site."
        />

        <CategoryField
          name="slug"
          placeholder="Category Slug"
          type="text"
          value={formData.slug}
          error={errors.slug}
          onChange={handleChange}
          tooltipTitle="The slug is the URL-friendly version of the name."
        />

        <CategoryField
          name="parent"
          placeholder="Select Parent Category"
          type="select"
          value={formData.parent}
          options={parentCategories}
          // options={[{ label: "None", value: null }, ...parentCategories]}
          onChange={handleChange}
          tooltipTitle="Select the parent category, if any."
        />

        <CategoryField
          name="description"
          placeholder="Category Description"
          type="textarea"
          value={formData.description}
          error={errors.description}
          onChange={handleChange}
          tooltipTitle="The description is optional."
        />

        <button className="categoryForm__btn" type="submit">
          {selectedCategory ? "Edit Category" : "Add New Category"}
        </button>
      </form>
    </section>
  );
}

import React, { useState } from "react";
import CategoryField from "./common/categoryField";
import "./styles/categoryForm.css";

export default function CategoryForm({
  onAddCategory,
  selectedCategory,
  onEditCategory,
  parentCategories = [],
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent: "",
  });
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [storageType, setStorageType] = useState("local");
  const [errors, setErrors] = useState({});

  // Update form when editing
  React.useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name || "",
        slug: selectedCategory.slug || "",
        description: selectedCategory.description || "",
        parent: selectedCategory.parent || "",
      });

      // Set preview for existing image
      if (selectedCategory.categoryImage?.url) {
        setImagePreview(selectedCategory.categoryImage.url);
      }
    } else {
      // Reset form
      setFormData({ name: "", slug: "", description: "", parent: "" });
      setCategoryImage(null);
      setImagePreview(null);
    }
  }, [selectedCategory]);

  const handleChange = ({ target: input }) => {
    const newErrors = { ...errors };

    if (input.name === "name" && !input.value.trim()) {
      newErrors.name = "Category name is required";
    } else {
      delete newErrors[input.name];
    }

    setFormData((prev) => ({
      ...prev,
      [input.name]: input.name === "parent" ? input.value || null : input.value,
    }));

    setErrors(newErrors);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, categoryImage: "Only image files are allowed" });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          categoryImage: "Image size must be less than 5MB",
        });
        return;
      }

      setCategoryImage(file);
      setErrors({ ...errors, categoryImage: null });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCategoryImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!selectedCategory && !categoryImage) {
      newErrors.categoryImage = "Category image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append(
      "slug",
      formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-")
    );
    submitData.append("description", formData.description);
    if (formData.parent) submitData.append("parent", formData.parent);

    // Add image if selected
    if (categoryImage) {
      submitData.append("categoryImage", categoryImage);
    }

    try {
      if (selectedCategory) {
        await onEditCategory(selectedCategory._id, submitData, storageType);
      } else {
        await onAddCategory(submitData, storageType);
      }

      // Reset form
      setFormData({ name: "", slug: "", description: "", parent: "" });
      setCategoryImage(null);
      setImagePreview(null);
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ submit: error.message || "Failed to submit form" });
    }
  };

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

        {/* Image Upload Section */}
        <div className="category-Form__container">
          <label htmlFor="categoryImage" className="categoryForm__label">
            Category Image{" "}
            {!selectedCategory && <span style={{ color: "red" }}>*</span>}
          </label>

          <div className="categoryForm__image-upload">
            <input
              type="file"
              id="categoryImage"
              name="categoryImage"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            <label htmlFor="categoryImage" className="categoryForm__upload-btn">
              {imagePreview ? "Change Image" : "Choose Image"}
            </label>

            {imagePreview && (
              <div className="categoryForm__image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="categoryForm__remove-btn"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {errors.categoryImage && (
            <p className="categoryForm-error">{errors.categoryImage}</p>
          )}

          <span className="categoryForm__tooltip">
            Upload an image for this category (max 5MB)
          </span>
        </div>

        {/* Storage Type Selection */}
        <div className="category-Form__container">
          <label className="categoryForm__label">Storage Type</label>
          <div className="categoryForm__storage-options">
            <label className="categoryForm__radio">
              <input
                type="radio"
                name="storageType"
                value="local"
                checked={storageType === "local"}
                onChange={(e) => setStorageType(e.target.value)}
              />
              <span>Local Storage</span>
            </label>
            <label className="categoryForm__radio">
              <input
                type="radio"
                name="storageType"
                value="cloudinary"
                checked={storageType === "cloudinary"}
                onChange={(e) => setStorageType(e.target.value)}
              />
              <span>Cloud (Cloudinary)</span>
            </label>
          </div>
          <span className="categoryForm__tooltip">
            Choose where to store the category image
          </span>
        </div>

        {errors.submit && <p className="categoryForm-error">{errors.submit}</p>}

        <button className="categoryForm__btn" type="submit">
          {selectedCategory ? "Update Category" : "Add New Category"}
        </button>
      </form>
    </section>
  );
}

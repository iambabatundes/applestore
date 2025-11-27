import React, { useState, useCallback, useMemo } from "react";
import CategoryField from "./common/categoryField";
import "./styles/categoryForm.css";

// Constants for validation and configuration
const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-_&]+$/,
    message:
      "Category name must be 2-100 characters and contain only letters, numbers, spaces, hyphens, underscores, and ampersands",
  },
  slug: {
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    maxLength: 100,
    message: "Slug must be lowercase letters, numbers, and hyphens only",
  },
  description: {
    maxLength: 500,
    message: "Description must not exceed 500 characters",
  },
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ],
    message: "Image must be JPEG, PNG, WebP, or GIF and less than 5MB",
  },
};

const STORAGE_TYPES = {
  LOCAL: "local",
  CLOUDINARY: "cloudinary",
};

export default function CategoryForm({
  onAddCategory,
  selectedCategory,
  onEditCategory,
  parentCategories = [],
}) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parent: "",
  });

  // Image state
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [storageType, setStorageType] = useState(STORAGE_TYPES.LOCAL);

  // UI state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // Update form when editing
  React.useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name || "",
        slug: selectedCategory.slug || "",
        description: selectedCategory.description || "",
        parent: selectedCategory.parent || "",
      });

      // Set storage type from existing category
      if (selectedCategory.categoryImage?.storageType) {
        setStorageType(selectedCategory.categoryImage.storageType);
      }

      // Set preview for existing image
      if (
        selectedCategory.categoryImage?.url ||
        selectedCategory.categoryImage?.cloudUrl ||
        selectedCategory.categoryImage?.publicUrl
      ) {
        const imageUrl =
          selectedCategory.categoryImage.url ||
          selectedCategory.categoryImage.cloudUrl ||
          selectedCategory.categoryImage.publicUrl;
        setImagePreview(imageUrl);
      }

      // Reset UI state
      setErrors({});
      setTouched({});
      setSubmitStatus(null);
    } else {
      resetForm();
    }
  }, [selectedCategory]);

  // Generate slug from name
  const generateSlug = useCallback((name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  // Validate individual field
  const validateField = useCallback((name, value) => {
    const rules = VALIDATION_RULES[name];
    if (!rules) return null;

    // Required validation
    if (rules.required && !value?.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return rules.message || `Must be at least ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.message || `Must not exceed ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.message || `Invalid ${name} format`;
    }

    return null;
  }, []);

  // Handle input change with validation
  const handleChange = useCallback(
    ({ target: input }) => {
      const { name, value } = input;

      setFormData((prev) => {
        const newData = {
          ...prev,
          [name]: name === "parent" ? value || null : value,
        };

        // Auto-generate slug from name if slug is empty
        if (name === "name" && !prev.slug) {
          newData.slug = generateSlug(value);
        }

        return newData;
      });

      // Validate on change if field has been touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (error) {
            newErrors[name] = error;
          } else {
            delete newErrors[name];
          }
          return newErrors;
        });
      }

      // Clear submit status on change
      if (submitStatus) {
        setSubmitStatus(null);
      }
    },
    [touched, validateField, generateSlug, submitStatus]
  );

  // Handle field blur
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name, formData[name]);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    },
    [formData, validateField]
  );

  // Validate image file
  const validateImage = useCallback((file) => {
    const rules = VALIDATION_RULES.image;

    if (!rules.allowedTypes.includes(file.type)) {
      return "Only JPEG, PNG, WebP, and GIF images are allowed";
    }

    if (file.size > rules.maxSize) {
      return "Image size must be less than 5MB";
    }

    return null;
  }, []);

  // Handle image change
  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const error = validateImage(file);

      if (error) {
        setErrors((prev) => ({ ...prev, categoryImage: error }));
        setCategoryImage(null);
        setImagePreview(null);
        return;
      }

      setCategoryImage(file);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.categoryImage;
        return newErrors;
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        setErrors((prev) => ({
          ...prev,
          categoryImage: "Failed to read image file",
        }));
      };
      reader.readAsDataURL(file);

      // Clear submit status
      if (submitStatus) {
        setSubmitStatus(null);
      }
    },
    [validateImage, submitStatus]
  );

  // Remove image
  const removeImage = useCallback(() => {
    setCategoryImage(null);
    setImagePreview(null);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.categoryImage;
      return newErrors;
    });

    // Reset file input
    const fileInput = document.getElementById("categoryImage");
    if (fileInput) {
      fileInput.value = "";
    }
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate name
    const nameError = validateField("name", formData.name);
    if (nameError) newErrors.name = nameError;

    // Validate slug if provided
    if (formData.slug) {
      const slugError = validateField("slug", formData.slug);
      if (slugError) newErrors.slug = slugError;
    }

    // Validate description if provided
    if (formData.description) {
      const descError = validateField("description", formData.description);
      if (descError) newErrors.description = descError;
    }

    // Image required for new categories
    if (!selectedCategory && !categoryImage && !imagePreview) {
      newErrors.categoryImage = "Category image is required";
    }

    // Check for circular parent reference
    if (selectedCategory && formData.parent === selectedCategory._id) {
      newErrors.parent = "A category cannot be its own parent";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, categoryImage, imagePreview, selectedCategory, validateField]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({ name: "", slug: "", description: "", parent: "" });
    setCategoryImage(null);
    setImagePreview(null);
    setStorageType(STORAGE_TYPES.LOCAL);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitStatus(null);

    // Reset file input
    const fileInput = document.getElementById("categoryImage");
    if (fileInput) {
      fileInput.value = "";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      slug: true,
      description: true,
      parent: true,
    });

    if (!validateForm()) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("name", formData.name.trim());
      submitData.append(
        "slug",
        formData.slug.trim() || generateSlug(formData.name)
      );
      submitData.append("description", formData.description.trim());
      if (formData.parent) {
        submitData.append("parent", formData.parent);
      }

      // Add image if selected
      if (categoryImage) {
        submitData.append("categoryImage", categoryImage);
      }

      // Call appropriate handler
      if (selectedCategory) {
        await onEditCategory(selectedCategory._id, submitData, storageType);
      } else {
        await onAddCategory(submitData, storageType);
      }

      // Success - reset form
      setSubmitStatus("success");
      resetForm();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");

      // Handle duplicate name errors specifically
      if (error.isDuplicate && error.field === "name") {
        setErrors((prev) => ({
          ...prev,
          name: "A category with this name already exists. Please choose a different name.",
          submit: error.message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: error.message || "Failed to submit form. Please try again.",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableParentCategories = useMemo(() => {
    if (!selectedCategory) return parentCategories;

    return parentCategories.filter((cat) => {
      // Exclude the current category
      if (cat._id === selectedCategory._id) return false;

      // Exclude children of current category (prevent circular reference)
      let parent = parentCategories.find((p) => p._id === cat.parent);
      while (parent) {
        if (parent._id === selectedCategory._id) return false;
        parent = parentCategories.find((p) => p._id === parent.parent);
      }

      return true;
    });
  }, [selectedCategory, parentCategories]);

  // Form title
  const formTitle = selectedCategory ? "Edit Category" : "Add New Category";
  const submitButtonText = selectedCategory
    ? "Update Category"
    : "Add New Category";

  return (
    <section
      className="categoryForm__container"
      role="form"
      aria-label={formTitle}
    >
      <h1 className="categoryForm__title">{formTitle}</h1>

      {/* Success Message */}
      {submitStatus === "success" && (
        <div
          className="categoryForm__alert categoryForm__alert--success"
          role="alert"
        >
          <i className="fa fa-check-circle" aria-hidden="true"></i>
          <span>
            Category {selectedCategory ? "updated" : "added"} successfully!
          </span>
        </div>
      )}

      {/* Error Message */}
      {submitStatus === "error" && errors.submit && (
        <div
          className="categoryForm__alert categoryForm__alert--error"
          role="alert"
        >
          <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
          <span>{errors.submit}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <CategoryField
          autoFocus
          name="name"
          placeholder="Category Name"
          type="text"
          value={formData.name}
          error={touched.name && errors.name}
          onChange={handleChange}
          onBlur={handleBlur}
          tooltipTitle="The name is how it appears on your site (2-100 characters)."
          required
          disabled={isSubmitting}
          aria-required="true"
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={
            touched.name && errors.name ? "name-error" : undefined
          }
        />

        <CategoryField
          name="slug"
          placeholder="Category Slug (auto-generated if empty)"
          type="text"
          value={formData.slug}
          error={touched.slug && errors.slug}
          onChange={handleChange}
          onBlur={handleBlur}
          tooltipTitle="The slug is the URL-friendly version of the name. Leave empty to auto-generate."
          disabled={isSubmitting}
          aria-invalid={touched.slug && !!errors.slug}
          aria-describedby={
            touched.slug && errors.slug ? "slug-error" : undefined
          }
        />

        <CategoryField
          name="parent"
          placeholder="Select Parent Category"
          type="select"
          value={formData.parent}
          options={availableParentCategories}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.parent && errors.parent}
          tooltipTitle="Select the parent category to create a subcategory."
          disabled={isSubmitting}
          aria-invalid={touched.parent && !!errors.parent}
          aria-describedby={
            touched.parent && errors.parent ? "parent-error" : undefined
          }
        />

        <CategoryField
          name="description"
          placeholder="Category Description"
          type="textarea"
          value={formData.description}
          error={touched.description && errors.description}
          onChange={handleChange}
          onBlur={handleBlur}
          tooltipTitle="Brief description of the category (optional, max 500 characters)."
          disabled={isSubmitting}
          maxLength={500}
          aria-invalid={touched.description && !!errors.description}
          aria-describedby={
            touched.description && errors.description
              ? "description-error"
              : undefined
          }
        />

        {/* Image Upload Section */}
        <div className="category-Form__container">
          <label htmlFor="categoryImage" className="categoryForm__label">
            Category Image{" "}
            {!selectedCategory && (
              <span className="categoryForm__required">*</span>
            )}
          </label>

          <div className="categoryForm__image-upload">
            <input
              type="file"
              id="categoryImage"
              name="categoryImage"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              disabled={isSubmitting}
              className="categoryForm__file-input"
              aria-required={!selectedCategory}
              aria-invalid={!!errors.categoryImage}
              aria-describedby={
                errors.categoryImage ? "image-error" : "image-help"
              }
            />

            <label
              htmlFor="categoryImage"
              className={`categoryForm__upload-btn ${
                isSubmitting ? "categoryForm__upload-btn--disabled" : ""
              }`}
              tabIndex={isSubmitting ? -1 : 0}
              role="button"
              aria-label={
                imagePreview ? "Change category image" : "Choose category image"
              }
            >
              <i className="fa fa-upload" aria-hidden="true"></i>
              {imagePreview ? "Change Image" : "Choose Image"}
            </label>

            {imagePreview && (
              <div
                className="categoryForm__image-preview"
                role="img"
                aria-label="Category image preview"
              >
                <img src={imagePreview} alt="Category preview" />
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isSubmitting}
                  className="categoryForm__remove-btn"
                  aria-label="Remove image"
                  title="Remove image"
                >
                  <i className="fa fa-times" aria-hidden="true"></i>
                </button>
              </div>
            )}
          </div>

          {errors.categoryImage && (
            <p className="categoryForm-error" id="image-error" role="alert">
              <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
              {errors.categoryImage}
            </p>
          )}

          <span className="categoryForm__tooltip" id="image-help">
            Upload an image for this category (JPEG, PNG, WebP, or GIF - max
            5MB)
          </span>
        </div>

        {/* Storage Type Selection */}
        <div className="category-Form__container">
          <fieldset className="categoryForm__fieldset">
            <legend className="categoryForm__label">Storage Type</legend>
            <div className="categoryForm__storage-options" role="radiogroup">
              <label className="categoryForm__radio">
                <input
                  type="radio"
                  name="storageType"
                  value={STORAGE_TYPES.LOCAL}
                  checked={storageType === STORAGE_TYPES.LOCAL}
                  onChange={(e) => setStorageType(e.target.value)}
                  disabled={isSubmitting}
                  aria-label="Local storage"
                />
                <span>
                  <i className="fa fa-hdd-o" aria-hidden="true"></i>
                  Local Storage
                </span>
              </label>
              <label className="categoryForm__radio">
                <input
                  type="radio"
                  name="storageType"
                  value={STORAGE_TYPES.CLOUDINARY}
                  checked={storageType === STORAGE_TYPES.CLOUDINARY}
                  onChange={(e) => setStorageType(e.target.value)}
                  disabled={isSubmitting}
                  aria-label="Cloud storage"
                />
                <span>
                  <i className="fa fa-cloud" aria-hidden="true"></i>
                  Cloud (Cloudinary)
                </span>
              </label>
            </div>
            <span className="categoryForm__tooltip">
              Choose where to store the category image
            </span>
          </fieldset>
        </div>

        {/* Form Actions */}
        <div className="categoryForm__actions">
          <button
            className="categoryForm__btn categoryForm__btn--primary"
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>
                {selectedCategory ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <i
                  className={`fa ${selectedCategory ? "fa-save" : "fa-plus"}`}
                  aria-hidden="true"
                ></i>
                {submitButtonText}
              </>
            )}
          </button>

          {selectedCategory && (
            <button
              type="button"
              className="categoryForm__btn categoryForm__btn--secondary"
              onClick={resetForm}
              disabled={isSubmitting}
              aria-label="Cancel editing"
            >
              <i className="fa fa-times" aria-hidden="true"></i>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

import React, { useCallback } from "react";
import PropTypes from "prop-types";
import "./styles/categoryViews.css";

export default function CategoryGridView({
  data = [],
  onEdit,
  onPreview,
  onDelete,
  loading = false,
}) {
  // Render category image
  const renderImage = useCallback((category) => {
    const imageUrl =
      category.categoryImage?.url ||
      category.categoryImage?.cloudUrl ||
      category.categoryImage?.publicUrl;

    if (!imageUrl) {
      return (
        <div className="categoryGrid__image-placeholder">
          <i className="fa fa-image" aria-hidden="true"></i>
          <span>No Image</span>
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={category.name}
        className="categoryGrid__image"
        loading="lazy"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.parentElement.innerHTML =
            '<div class="categoryGrid__image-placeholder"><i class="fa fa-image"></i><span>No Image</span></div>';
        }}
      />
    );
  }, []);

  // Handle delete with confirmation
  const handleDelete = useCallback(
    async (category) => {
      if (
        !window.confirm(
          `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
        )
      ) {
        return;
      }

      try {
        await onDelete(category._id);
      } catch (error) {
        alert(`Failed to delete category: ${error.message}`);
      }
    },
    [onDelete]
  );

  if (loading) {
    return (
      <div className="categoryGrid__loading">
        <div className="categoryGrid__spinner"></div>
        <span>Loading categories...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="categoryGrid__empty">
        <i className="fa fa-folder-open-o" aria-hidden="true"></i>
        <p>No categories to display</p>
      </div>
    );
  }

  return (
    <div className="categoryGrid__container">
      {data.map((category) => {
        const storageType = category.categoryImage?.storageType || "local";
        const isCloud = storageType === "cloudinary";
        const depth = category.depth || 0;

        return (
          <article key={category._id} className="categoryGrid__card">
            {/* Depth Indicator */}
            {depth > 0 && (
              <div className="categoryGrid__depth-indicator">
                <i className="fa fa-level-down" aria-hidden="true"></i>
                Level {depth}
              </div>
            )}

            {/* Image Container */}
            <div
              className="categoryGrid__image-container"
              onClick={() => onPreview(category)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPreview(category);
                }
              }}
            >
              {renderImage(category)}

              {/* Overlay on Hover */}
              <div className="categoryGrid__image-overlay">
                <i className="fa fa-search-plus" aria-hidden="true"></i>
                <span>View Details</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="categoryGrid__body">
              {/* Title */}
              <h3 className="categoryGrid__title" title={category.name}>
                {category.name}
              </h3>

              {/* Slug */}
              {category.slug && (
                <p className="categoryGrid__slug">
                  <i className="fa fa-link" aria-hidden="true"></i>
                  {category.slug}
                </p>
              )}

              {/* Description */}
              {category.description && (
                <p className="categoryGrid__description">
                  {category.description.length > 80
                    ? `${category.description.substring(0, 80)}...`
                    : category.description}
                </p>
              )}

              {/* Meta Info */}
              <div className="categoryGrid__meta">
                <span
                  className={`categoryGrid__badge categoryGrid__badge--${
                    isCloud ? "cloud" : "local"
                  }`}
                  title={`Stored in ${
                    isCloud ? "Cloudinary" : "local storage"
                  }`}
                >
                  <i
                    className={`fa fa-${isCloud ? "cloud" : "hdd-o"}`}
                    aria-hidden="true"
                  ></i>
                  {storageType}
                </span>

                <span
                  className="categoryGrid__products"
                  title={`${category.productCount || 0} products`}
                >
                  <i className="fa fa-cubes" aria-hidden="true"></i>
                  {category.productCount || 0}
                </span>
              </div>
            </div>

            {/* Card Actions */}
            <div className="categoryGrid__actions">
              <button
                className="categoryGrid__action-btn categoryGrid__action-btn--edit"
                onClick={() => onEdit(category)}
                aria-label={`Edit ${category.name}`}
                title="Edit category"
              >
                <i className="fa fa-edit" aria-hidden="true"></i>
                Edit
              </button>
              <button
                className="categoryGrid__action-btn categoryGrid__action-btn--view"
                onClick={() => onPreview(category)}
                aria-label={`View ${category.name}`}
                title="View details"
              >
                <i className="fa fa-eye" aria-hidden="true"></i>
                View
              </button>
              <button
                className="categoryGrid__action-btn categoryGrid__action-btn--delete"
                onClick={() => handleDelete(category)}
                aria-label={`Delete ${category.name}`}
                title="Delete category"
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
                Delete
              </button>
            </div>

            {/* Parent Badge (if has parent) */}
            {category.parentName && (
              <div className="categoryGrid__parent-badge">
                <i className="fa fa-folder-o" aria-hidden="true"></i>
                {category.parentName}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

CategoryGridView.propTypes = {
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

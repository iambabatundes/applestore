import React, { useCallback } from "react";
import PropTypes from "prop-types";
import "./styles/categoryViews.css";

export default function CategoryListView({
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
        <div className="categoryList__image-placeholder">
          <i className="fa fa-image" aria-hidden="true"></i>
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={category.name}
        className="categoryList__image"
        loading="lazy"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.parentElement.innerHTML =
            '<div class="categoryList__image-placeholder"><i class="fa fa-image"></i></div>';
        }}
      />
    );
  }, []);

  // Render storage badge
  const renderStorageBadge = useCallback((category) => {
    const storageType = category.categoryImage?.storageType || "local";
    const isCloud = storageType === "cloudinary";

    return (
      <span
        className={`categoryList__badge categoryList__badge--${
          isCloud ? "cloud" : "local"
        }`}
      >
        <i
          className={`fa fa-${isCloud ? "cloud" : "hdd-o"}`}
          aria-hidden="true"
        ></i>
        {storageType}
      </span>
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
      <div className="categoryList__loading">
        <div className="categoryList__spinner"></div>
        <span>Loading categories...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="categoryList__empty">
        <i className="fa fa-folder-open-o" aria-hidden="true"></i>
        <p>No categories to display</p>
      </div>
    );
  }

  return (
    <div className="categoryList__container">
      {data.map((category) => (
        <article
          key={category._id}
          className="categoryList__item"
          style={{ paddingLeft: `${(category.depth || 0) * 20 + 16}px` }}
        >
          {/* Image */}
          <div className="categoryList__image-wrapper">
            {renderImage(category)}
          </div>

          {/* Content */}
          <div className="categoryList__content">
            <div className="categoryList__header">
              <h3 className="categoryList__title">
                {"—".repeat(category.depth || 0)} {category.name}
              </h3>
              <div className="categoryList__meta">
                {renderStorageBadge(category)}
                <span className="categoryList__products">
                  <i className="fa fa-cubes" aria-hidden="true"></i>
                  {category.productCount || 0}
                </span>
              </div>
            </div>

            {category.slug && (
              <p className="categoryList__slug">
                <i className="fa fa-link" aria-hidden="true"></i>
                {category.slug}
              </p>
            )}

            {category.description && (
              <p className="categoryList__description">
                {category.description.length > 120
                  ? `${category.description.substring(0, 120)}...`
                  : category.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="categoryList__actions">
            <button
              className="categoryList__action-btn categoryList__action-btn--edit"
              onClick={() => onEdit(category)}
              aria-label={`Edit ${category.name}`}
              title="Edit"
            >
              <i className="fa fa-edit" aria-hidden="true"></i>
            </button>
            <button
              className="categoryList__action-btn categoryList__action-btn--view"
              onClick={() => onPreview(category)}
              aria-label={`View ${category.name}`}
              title="View"
            >
              <i className="fa fa-eye" aria-hidden="true"></i>
            </button>
            <button
              className="categoryList__action-btn categoryList__action-btn--delete"
              onClick={() => handleDelete(category)}
              aria-label={`Delete ${category.name}`}
              title="Delete"
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

CategoryListView.propTypes = {
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

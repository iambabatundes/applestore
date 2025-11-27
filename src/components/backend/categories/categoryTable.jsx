import React, { useState, useCallback, memo } from "react";
import "../../backend/styles/dataTable.css";
import Table from "../../backend/common/table";

// Memoized row component for better performance
const CategoryRow = memo(({ category, onEdit, onPreview, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(category._id);
    } catch (error) {
      console.error("Delete failed:", error);
      setIsDeleting(false);
    }
  }, [category._id, category.name, onDelete]);

  return {
    category,
    onEdit,
    onPreview,
    handleDelete,
    imageError,
    handleImageError,
    isDeleting,
  };
});

CategoryRow.displayName = "CategoryRow";

export default function CategoryTable({
  data = [],
  onDelete,
  onPreview,
  onEdit,
  sortColumn,
  onSort,
  loading = false,
  error = null,
}) {
  // Loading state
  if (loading) {
    return (
      <div
        className="categoryTable__loading-container"
        role="status"
        aria-live="polite"
      >
        <div className="categoryTable__spinner"></div>
        <span className="categoryTable__loading-text">
          Loading Categories...
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="categoryTable__error-container" role="alert">
        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
        <div className="categoryTable__error-content">
          <h3>Error Loading Categories</h3>
          <p>
            {error.message ||
              "An unexpected error occurred while loading categories."}
          </p>
          <button
            className="categoryTable__retry-btn"
            onClick={() => window.location.reload()}
            aria-label="Retry loading categories"
          >
            <i className="fa fa-refresh" aria-hidden="true"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="categoryTable__empty-container" role="status">
        <i className="fa fa-folder-open-o" aria-hidden="true"></i>
        <h3>No Categories Found</h3>
        <p>Start by creating your first category using the form above.</p>
      </div>
    );
  }

  // Render category name with proper indentation
  const renderCategoryName = useCallback((category) => {
    const indentation = "—".repeat(category.depth || 0);
    return (
      <span
        style={{
          marginLeft: `${(category.depth || 0) * 20}px`,
          fontWeight: category.depth === 0 ? "600" : "400",
        }}
        title={category.name}
      >
        {indentation} {category.name}
      </span>
    );
  }, []);

  // Render category image with error handling
  const renderCategoryImage = useCallback((category) => {
    const imageUrl =
      category.categoryImage?.url ||
      category.categoryImage?.cloudUrl ||
      category.categoryImage?.publicUrl;

    if (!imageUrl) {
      return (
        <div className="categoryTable__image-placeholder" aria-label="No image">
          <i className="fa fa-image" aria-hidden="true"></i>
        </div>
      );
    }

    return (
      <div className="categoryTable__image-wrapper">
        <img
          src={imageUrl}
          alt={`${category.name} category`}
          className="categoryTable__image"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentElement.innerHTML =
              '<div class="categoryTable__image-placeholder"><i class="fa fa-image"></i></div>';
          }}
        />
      </div>
    );
  }, []);

  // Render storage type badge
  const renderStorageType = useCallback((category) => {
    const storageType = category.categoryImage?.storageType || "local";
    const isCloud = storageType === "cloudinary";

    return (
      <span
        className={`categoryTable__badge categoryTable__badge--${
          isCloud ? "cloud" : "local"
        }`}
        title={`Stored in ${isCloud ? "Cloudinary" : "local storage"}`}
        aria-label={`Storage type: ${storageType}`}
      >
        <i
          className={`fa fa-${isCloud ? "cloud" : "hdd-o"}`}
          aria-hidden="true"
        ></i>
        {storageType}
      </span>
    );
  }, []);

  // Render description with truncation
  const renderDescription = useCallback((category) => {
    const description = category.description || "";
    const maxLength = 100;

    if (!description) {
      return <span className="categoryTable__no-data">No description</span>;
    }

    if (description.length <= maxLength) {
      return <span title={description}>{description}</span>;
    }

    return (
      <span title={description}>{description.substring(0, maxLength)}...</span>
    );
  }, []);

  // Render action buttons
  const renderActions = useCallback(
    (category) => {
      return (
        <section
          className="categoryTable__actions"
          role="group"
          aria-label={`Actions for ${category.name}`}
        >
          <button
            className="categoryTable__action-btn categoryTable__action-btn--edit"
            onClick={() => onEdit(category)}
            aria-label={`Edit ${category.name}`}
            title="Edit category"
          >
            <i className="fa fa-edit" aria-hidden="true"></i>
          </button>
          <button
            className="categoryTable__action-btn categoryTable__action-btn--view"
            onClick={() => onPreview(category)}
            aria-label={`View ${category.name}`}
            title="View category details"
          >
            <i className="fa fa-eye" aria-hidden="true"></i>
          </button>
          <button
            className="categoryTable__action-btn categoryTable__action-btn--delete"
            onClick={async () => {
              if (
                window.confirm(
                  `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
                )
              ) {
                try {
                  await onDelete(category._id);
                } catch (error) {
                  alert(`Failed to delete category: ${error.message}`);
                }
              }
            }}
            aria-label={`Delete ${category.name}`}
            title="Delete category"
          >
            <i className="fa fa-trash" aria-hidden="true"></i>
          </button>
        </section>
      );
    },
    [onEdit, onPreview, onDelete]
  );

  // Table columns configuration
  const columns = [
    {
      label: "Image",
      content: renderCategoryImage,
      className: "categoryTable__cell--image",
    },
    {
      label: "Name",
      path: "name",
      sortable: true,
      content: renderCategoryName,
      className: "categoryTable__cell--name",
    },
    {
      label: "Description",
      path: "description",
      content: renderDescription,
      className: "categoryTable__cell--description",
    },
    {
      label: "Slug",
      path: "slug",
      sortable: true,
      className: "categoryTable__cell--slug",
    },
    {
      label: "Storage",
      content: renderStorageType,
      className: "categoryTable__cell--storage",
    },
    {
      label: "Products",
      path: "productCount",
      sortable: true,
      content: (category) => (
        <span
          className="categoryTable__count"
          aria-label={`${category.productCount} products`}
        >
          {category.productCount || 0}
        </span>
      ),
      className: "categoryTable__cell--count",
    },
    {
      label: "Actions",
      content: renderActions,
      className: "categoryTable__cell--actions",
    },
  ];

  return (
    <div className="categoryTable__wrapper">
      <Table
        columns={columns}
        data={data}
        onSort={onSort}
        sortColumn={sortColumn}
        table="category__table"
        tbody="category__tbody"
        tbodyTr="category__tbodytr"
        td="category__td"
        th="category__th"
        thead="category__thead"
        className="categoryTable"
        ariaLabel="Categories table"
      />
    </div>
  );
}

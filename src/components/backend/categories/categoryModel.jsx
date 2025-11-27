import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { getProductsByCategorys } from "../../../services/productService";
import "./styles/categoryModel.css";

export default function CategoryModal({ category, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement;

    return () => {
      // Return focus when modal closes
      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current.focus === "function"
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Fetch products on mount
  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [category]);

  const fetchProducts = async () => {
    if (!category?._id) {
      setError("Invalid category");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch products
      const fetchedProducts = await getProductsByCategorys(category._id);

      // Handle different response formats
      const productData = fetchedProducts?.data || fetchedProducts || [];
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (err) {
      console.error("Error fetching products:", err);

      // Enhanced error message
      let errorMessage = "Failed to load products. Please try again.";

      if (err.response?.status === 404) {
        errorMessage = "No products found for this category.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please contact support.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus trap implementation
  useEffect(() => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element on mount
    if (firstElement) {
      setTimeout(() => firstElement.focus(), 100);
    }

    const trapFocus = (event) => {
      if (event.key === "Tab") {
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [loading, error, products]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle product click
  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
    // You can add navigation logic here
    // Example: window.location.href = `/products/${product._id}`;
  }, []);

  const renderProductImage = (product) => {
    const imageUrl =
      product.featureImage?.url ||
      product.featureImage?.cloudUrl ||
      product.featureImage?.publicUrl ||
      product.featureImage?.previewUrl ||
      product.image || // fallback to simple image field
      product.thumbnail;

    if (!imageUrl) {
      // Fallback icon if no image available
      return (
        <div className="categoryModal__product-image-placeholder">
          <i className="fa fa-cube" aria-hidden="true"></i>
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={product.name}
        className="categoryModal__product-img"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
    );
  };

  // Render category image
  const renderCategoryImage = () => {
    const imageUrl =
      category.categoryImage?.url ||
      category.categoryImage?.cloudUrl ||
      category.categoryImage?.publicUrl;

    if (!imageUrl) return null;

    return (
      <div className="categoryModal__image-container">
        <img
          src={imageUrl}
          alt={category.name}
          className="categoryModal__image"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
    );
  };

  return (
    <div
      className="categoryModal__overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <section className="categoryModal__container" ref={modalRef}>
        {/* Header */}
        <header className="categoryModal__header">
          <div className="categoryModal__header-content">
            <h2 className="categoryModal__title" id="modal-title">
              {category.name}
            </h2>
            <span className="categoryModal__subtitle">Category Details</span>
          </div>
          <button
            className="categoryModal__close"
            onClick={onClose}
            aria-label="Close modal"
            title="Close (Esc)"
          >
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
        </header>

        {/* Content */}
        <div className="categoryModal__content" id="modal-description">
          {/* Category Image */}
          {renderCategoryImage()}

          {/* Category Details */}
          <div className="categoryModal__details">
            <div className="categoryModal__detail-grid">
              <div className="categoryModal__detail-item">
                <span className="categoryModal__detail-label">
                  <i className="fa fa-tag" aria-hidden="true"></i>
                  Name
                </span>
                <span className="categoryModal__detail-value">
                  {category.name}
                </span>
              </div>

              <div className="categoryModal__detail-item">
                <span className="categoryModal__detail-label">
                  <i className="fa fa-link" aria-hidden="true"></i>
                  Slug
                </span>
                <span className="categoryModal__detail-value categoryModal__detail-value--code">
                  {category.slug}
                </span>
              </div>

              {category.parent && (
                <div className="categoryModal__detail-item">
                  <span className="categoryModal__detail-label">
                    <i className="fa fa-folder" aria-hidden="true"></i>
                    Parent Category
                  </span>
                  <span className="categoryModal__detail-value">
                    {category.parentName || "N/A"}
                  </span>
                </div>
              )}

              <div className="categoryModal__detail-item">
                <span className="categoryModal__detail-label">
                  <i className="fa fa-database" aria-hidden="true"></i>
                  Storage Type
                </span>
                <span
                  className={`categoryModal__badge categoryModal__badge--${
                    category.categoryImage?.storageType === "cloudinary"
                      ? "cloud"
                      : "local"
                  }`}
                >
                  <i
                    className={`fa fa-${
                      category.categoryImage?.storageType === "cloudinary"
                        ? "cloud"
                        : "hdd-o"
                    }`}
                    aria-hidden="true"
                  ></i>
                  {category.categoryImage?.storageType || "local"}
                </span>
              </div>

              <div className="categoryModal__detail-item">
                <span className="categoryModal__detail-label">
                  <i className="fa fa-cubes" aria-hidden="true"></i>
                  Total Products
                </span>
                <span className="categoryModal__detail-value categoryModal__detail-value--count">
                  {category.productCount || 0}
                </span>
              </div>
            </div>

            {category.description && (
              <div className="categoryModal__detail-item categoryModal__detail-item--full">
                <span className="categoryModal__detail-label">
                  <i className="fa fa-align-left" aria-hidden="true"></i>
                  Description
                </span>
                <p className="categoryModal__description">
                  {category.description}
                </p>
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="categoryModal__products">
            <h3 className="categoryModal__products-title">
              <i className="fa fa-shopping-bag" aria-hidden="true"></i>
              Associated Products
              {!loading && !error && (
                <span className="categoryModal__products-count">
                  ({products.length})
                </span>
              )}
            </h3>

            {loading ? (
              <div
                className="categoryModal__loading"
                role="status"
                aria-live="polite"
              >
                <div className="categoryModal__spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="categoryModal__error" role="alert">
                <i
                  className="fa fa-exclamation-triangle"
                  aria-hidden="true"
                ></i>
                <p>{error}</p>
                <button
                  onClick={fetchProducts}
                  className="categoryModal__retry-btn"
                  aria-label="Retry loading products"
                >
                  <i className="fa fa-refresh" aria-hidden="true"></i>
                  Retry
                </button>
              </div>
            ) : products.length > 0 ? (
              <ul className="categoryModal__products-list" role="list">
                {products.map((product) => (
                  <li
                    key={product._id}
                    className="categoryModal__product-item"
                    onClick={() => handleProductClick(product)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleProductClick(product);
                      }
                    }}
                    aria-label={`View ${product.name}`}
                  >
                    {/* Product Image */}
                    <div className="categoryModal__product-image">
                      {renderProductImage(product)}
                    </div>

                    <div className="categoryModal__product-info">
                      <span className="categoryModal__product-name">
                        {product.name}
                      </span>
                      {product.price && (
                        <span className="categoryModal__product-price">
                          $
                          {typeof product.price === "number"
                            ? product.price.toFixed(2)
                            : product.price}
                        </span>
                      )}
                    </div>
                    <i
                      className="fa fa-chevron-right categoryModal__product-arrow"
                      aria-hidden="true"
                    ></i>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="categoryModal__empty" role="status">
                <i className="fa fa-inbox" aria-hidden="true"></i>
                <p>No products found in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="categoryModal__footer">
          <button
            className="categoryModal__btn categoryModal__btn--secondary"
            onClick={onClose}
            type="button"
          >
            <i className="fa fa-times" aria-hidden="true"></i>
            Close
          </button>
        </footer>
      </section>

      {/* Product Detail Modal (Optional) */}
      {selectedProduct && (
        <div
          className="categoryModal__product-detail-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="categoryModal__product-detail"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="categoryModal__product-detail-content">
              <button
                className="categoryModal__close"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details"
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
              <h4>{selectedProduct.name}</h4>
              {selectedProduct.description && (
                <p>{selectedProduct.description}</p>
              )}
              {selectedProduct.price && (
                <div className="categoryModal__product-detail-price">
                  Price: $
                  {typeof selectedProduct.price === "number"
                    ? selectedProduct.price.toFixed(2)
                    : selectedProduct.price}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

CategoryModal.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    description: PropTypes.string,
    productCount: PropTypes.number,
    parent: PropTypes.string,
    parentName: PropTypes.string,
    categoryImage: PropTypes.shape({
      url: PropTypes.string,
      cloudUrl: PropTypes.string,
      publicUrl: PropTypes.string,
      storageType: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/checkoutNavbar.css";

const LockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckoutNavbar = ({
  cartItemCount = 0,
  logoImage,
  onReturnToCart,
  securityBadgeText = "Secure Checkout",
  ariaLabels = {},
  logoAlt = "Store logo",
  onModalOpen,
  onModalClose,
}) => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for DOM manipulation
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // Merge default aria labels with custom ones
  const labels = {
    cartButton: "View cart items",
    returnToCart: "Return to shopping cart",
    stayInCheckout: "Stay in checkout",
    secureCheckout: "Secure checkout indicator",
    modal: "Cart navigation confirmation",
    ...ariaLabels,
  };

  const handleToggleModal = useCallback(() => {
    if (cartItemCount === 0) return;

    if (isModalOpen) {
      setIsAnimating(false);
      setTimeout(() => {
        setIsModalOpen(false);
        if (onModalClose) onModalClose();
      }, 200);
    } else {
      setIsModalOpen(true);
      setTimeout(() => {
        setIsAnimating(true);
        if (onModalOpen) onModalOpen();
      }, 10);
    }
  }, [isModalOpen, cartItemCount, onModalOpen, onModalClose]);

  /**
   * Handle return to cart action
   */
  const handleReturnToCart = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
      if (onModalClose) onModalClose();

      if (onReturnToCart) {
        onReturnToCart();
      } else {
        navigate("/cart");
      }
    }, 200);
  }, [navigate, onReturnToCart, onModalClose]);

  /**
   * Handle stay in checkout action
   */
  const handleStayInCheckout = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsModalOpen(false);
      if (onModalClose) onModalClose();
    }, 200);
  }, [onModalClose]);

  /**
   * Close modal on ESC key press
   */
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        handleStayInCheckout();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen, handleStayInCheckout]);

  /**
   * Close modal when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isModalOpen &&
        modalRef.current &&
        buttonRef.current &&
        !modalRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        handleStayInCheckout();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen, handleStayInCheckout]);

  /**
   * Prevent body scroll when modal is open
   */
  useEffect(() => {
    if (isModalOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isModalOpen]);

  /**
   * Format item count text with proper grammar
   */
  const getItemText = () => {
    if (cartItemCount === 0) return "0 items";
    if (cartItemCount === 1) return "1 item";
    return `${cartItemCount.toLocaleString()} items`;
  };

  /**
   * Handle logo error (fallback to text)
   */
  const handleLogoError = (e) => {
    e.target.style.display = "none";
    console.warn("Failed to load logo image:", logoImage);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className="checkout-navbar"
        role="navigation"
        aria-label="Checkout navigation"
      >
        <div className="checkout-navbar__container">
          {/* Logo Section */}
          <div className="checkout-navbar__logo">
            {logoImage ? (
              <>
                <img
                  src={logoImage}
                  alt={logoAlt}
                  className="checkout-navbar__logo-image"
                  onError={handleLogoError}
                />
                <span
                  className="checkout-navbar__logo-text"
                  style={{ display: "none" }}
                >
                  Store
                </span>
              </>
            ) : (
              <span className="checkout-navbar__logo-text">Store</span>
            )}
          </div>

          {/* Checkout Title with Cart Count Button */}
          <div className="checkout-navbar__title">
            <h1 className="checkout-navbar__heading">
              Checkout
              <button
                ref={buttonRef}
                className={`checkout-navbar__cart-button ${
                  cartItemCount === 0
                    ? "checkout-navbar__cart-button--disabled"
                    : ""
                }`}
                onClick={handleToggleModal}
                disabled={cartItemCount === 0}
                aria-label={labels.cartButton}
                aria-expanded={isModalOpen}
                aria-haspopup="dialog"
                type="button"
              >
                <span className="checkout-navbar__cart-count">
                  ({getItemText()})
                </span>
                {cartItemCount > 0 && (
                  <span className="checkout-navbar__chevron">
                    <ChevronDownIcon />
                  </span>
                )}
              </button>
            </h1>
          </div>

          {/* Security Badge */}
          <div
            className="checkout-navbar__security"
            aria-label={labels.secureCheckout}
            role="img"
          >
            <LockIcon />
            <span className="checkout-navbar__security-text">
              {securityBadgeText}
            </span>
          </div>
        </div>
      </nav>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <>
          {/* Modal Overlay */}
          <div
            className={`checkout-modal-overlay ${
              isAnimating ? "checkout-modal-overlay--visible" : ""
            }`}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div
            ref={modalRef}
            className={`checkout-modal ${
              isAnimating ? "checkout-modal--visible" : ""
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            {/* Arrow pointing to cart button */}
            <div className="checkout-modal__arrow" aria-hidden="true" />

            <div className="checkout-modal__content">
              {/* Modal Message */}
              <p id="modal-description" className="checkout-modal__text">
                Are you sure you want to return to your shopping cart? Your
                checkout progress will be saved.
              </p>

              {/* Modal Actions */}
              <div className="checkout-modal__actions">
                <button
                  className="checkout-modal__button checkout-modal__button--secondary"
                  onClick={handleStayInCheckout}
                  aria-label={labels.stayInCheckout}
                  type="button"
                >
                  Stay in Checkout
                </button>
                <button
                  className="checkout-modal__button checkout-modal__button--primary"
                  onClick={handleReturnToCart}
                  aria-label={labels.returnToCart}
                  type="button"
                  autoFocus
                >
                  Return to Cart
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CheckoutNavbar;

import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

import EmptyCart from "./cart/emptyCart";
import NotLoginCart from "./cart/notLoginCart";
import SavedForLater from "./cart/savedForLater";
import PriceDisplay from "./utils/priceDisplay";
import "./styles/cart.css";
import { useCartStore } from "./store/cartStore";
import CartSummary from "./cart/cartSummary";

export default function Cart({
  isLoggedIn = false,
  conversionRate = 1,
  selectedCurrency,
  companyName,
}) {
  const {
    cartItems,
    savedItems,
    isLoading,
    error,
    syncCart,
    updateQuantity,
    updateCustomQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    removeFromSaved,
    validateCartForCheckout,
    checkStockAvailability,
    autoFixStockIssues,
    clearError,
    getCartTotals,
  } = useCartStore();

  const [localError, setLocalError] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [fieldWarnings, setFieldWarnings] = useState({});
  const [localCustomQuantity, setLocalCustomQuantity] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [cartValidation, setCartValidation] = useState({
    isValid: true,
    errors: [],
    warnings: [],
  });

  const timeoutRefs = useRef({});

  useEffect(() => {
    if (isLoggedIn) {
      syncCart();
    }
  }, [isLoggedIn, syncCart]);

  useEffect(() => {
    if (error || localError) {
      const timer = setTimeout(() => {
        clearError();
        setLocalError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, localError, clearError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    const validate = async () => {
      try {
        const validation = await validateCartForCheckout();
        setCartValidation(validation);
      } catch (err) {
        setCartValidation({
          isValid: false,
          errors: [err.message],
          warnings: [],
        });
      }
    };

    if (isLoggedIn && cartItems.length > 0) {
      validate();
    }
  }, [cartItems, isLoggedIn, validateCartForCheckout]);

  const handleQuantityChange = useCallback(
    async (itemId, quantity, product) => {
      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        setLocalError(null);
        setValidationErrors((prev) => ({ ...prev, [itemId]: null }));

        // Handle 10+ selection - just expand the input WITHOUT updating
        if (quantity === "10+") {
          const currentQty = product?.quantity || 1;
          setExpandedItems((prev) => ({ ...prev, [itemId]: true }));
          setLocalCustomQuantity((prev) => ({
            ...prev,
            [itemId]: currentQty >= 10 ? currentQty : 10,
          }));
          setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
          return;
        }

        const parsedQuantity = parseInt(quantity, 10);

        const stock = product?.numberInStock || 0;
        if (stock > 0 && parsedQuantity > stock) {
          throw new Error("Out of Stock");
        }

        // For 1-9: Update immediately (optimistic)
        await updateQuantity(itemId, parsedQuantity);
        setSuccessMessage("Quantity updated successfully");
      } catch (err) {
        const errorMsg =
          err.message.includes("stock") || err.message.includes("Stock")
            ? "Out of Stock"
            : err.message || "Failed to update quantity";

        setLocalError(errorMsg);
        // setLocalError(err.message || "Failed to update quantity");
        setValidationErrors((prev) => ({ ...prev, [itemId]: err.message }));
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [updateQuantity]
  );

  const handleCustomQuantityChange = useCallback(
    (e, itemId, product) => {
      const inputValue = e.target.value;

      // Clear any pending timeout
      if (timeoutRefs.current[itemId]) {
        clearTimeout(timeoutRefs.current[itemId]);
      }

      // Allow empty input temporarily
      if (inputValue === "") {
        setLocalCustomQuantity((prev) => ({ ...prev, [itemId]: "" }));
        setValidationErrors((prev) => ({ ...prev, [itemId]: null }));
        setFieldWarnings((prev) => ({ ...prev, [itemId]: null }));
        return;
      }

      const parsedValue = parseInt(inputValue, 10);

      // Basic validation
      if (isNaN(parsedValue) || parsedValue < 1) {
        setLocalCustomQuantity((prev) => ({ ...prev, [itemId]: inputValue }));
        setValidationErrors((prev) => ({
          ...prev,
          [itemId]: "Quantity must be at least 1",
        }));
        return;
      }

      // Update local state
      setLocalCustomQuantity((prev) => ({ ...prev, [itemId]: parsedValue }));

      // If user types 1-9, switch back to dropdown automatically
      if (parsedValue >= 1 && parsedValue <= 9) {
        // Auto-switch to dropdown after a short delay
        timeoutRefs.current[itemId] = setTimeout(async () => {
          try {
            setLoadingItems((prev) => ({ ...prev, [itemId]: true }));

            // Check stock before updating
            const stock = product?.numberInStock || 0;
            if (stock > 0 && parsedValue > stock) {
              throw new Error("Out of Stock");
            }

            await updateQuantity(itemId, parsedValue);
            setExpandedItems((prev) => ({ ...prev, [itemId]: false }));
            setLocalCustomQuantity((prev) => {
              const newState = { ...prev };
              delete newState[itemId];
              return newState;
            });
            setValidationErrors((prev) => ({ ...prev, [itemId]: null }));
            setFieldWarnings((prev) => ({ ...prev, [itemId]: null }));
            setSuccessMessage("Quantity updated successfully");
          } catch (error) {
            const errorMsg = error.message.includes("stock")
              ? "Out of Stock"
              : error.message;
            setLocalError(errorMsg);
            setValidationErrors((prev) => ({ ...prev, [itemId]: errorMsg }));
          } finally {
            setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
          }
        }, 800); // Wait 800ms after typing stops
        return;
      }

      // For 10+: Just validate, don't update yet
      if (parsedValue >= 10) {
        // Clear any errors
        setValidationErrors((prev) => ({ ...prev, [itemId]: null }));

        // Check stock and show warning (not error)
        const stock = product?.numberInStock || 0;
        if (stock === 0) {
          setFieldWarnings((prev) => ({
            ...prev,
            [itemId]: `Out of Stock`,
          }));
        } else if (parsedValue > stock) {
          setFieldWarnings((prev) => ({
            ...prev,
            [itemId]: `Only ${stock} items available in stock`,
          }));
        } else {
          setFieldWarnings((prev) => ({ ...prev, [itemId]: null }));
        }
      }
    },
    [updateQuantity]
  );

  const handleCustomQuantitySubmit = useCallback(
    async (itemId) => {
      const quantity = localCustomQuantity[itemId];

      if (!quantity || quantity === "") {
        setValidationErrors((prev) => ({
          ...prev,
          [itemId]: "Please enter a quantity",
        }));
        return;
      }

      const parsedQuantity = parseInt(quantity, 10);

      if (parsedQuantity < 10) {
        setValidationErrors((prev) => ({
          ...prev,
          [itemId]: "Custom quantity must be 10 or more. Use dropdown for 1-9.",
        }));
        return;
      }

      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        setLocalError(null);
        setValidationErrors((prev) => ({ ...prev, [itemId]: null }));

        // Check stock locally before making API call
        const item = cartItems.find((item) => item._id === itemId);
        const stock = item?.numberInStock || 0;

        if (stock > 0 && parsedQuantity > stock) {
          throw new Error("Out of Stock");
        }

        // NOW we update the cart - this will check stock on backend
        await updateCustomQuantity(itemId, parsedQuantity);

        setSuccessMessage("Quantity updated successfully");

        // Keep the input expanded since quantity is 10+
        // Just clear any warnings
        setFieldWarnings((prev) => ({ ...prev, [itemId]: null }));
      } catch (err) {
        // Check if it's a stock error from backend
        const errorMsg =
          err.message.includes("stock") ||
          err.message.includes("Stock") ||
          err.type === "STOCK_ERROR" ||
          err.statusCode === 422
            ? "Out of Stock"
            : err.message || "Failed to update quantity";

        setLocalError(errorMsg);
        setValidationErrors((prev) => ({ ...prev, [itemId]: errorMsg }));
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [localCustomQuantity, updateCustomQuantity, cartItems]
  );

  // Handle item deletion from cart
  const handleDeleteItem = useCallback(
    async (itemId, productName) => {
      if (!window.confirm(`Remove "${productName}" from cart?`)) {
        return;
      }

      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        await removeItem(itemId);
        setSuccessMessage("Item removed from cart");
      } catch (err) {
        setLocalError(err.message || "Failed to remove item");
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [removeItem]
  );

  // Handle save for later
  const handleSaveForLater = useCallback(
    async (itemId, productName) => {
      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        saveForLater(itemId);
        setSuccessMessage(`"${productName}" saved for later`);
      } catch (err) {
        setLocalError(err.message || "Failed to save item");
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [saveForLater]
  );

  // Handle move to cart from saved
  const handleMoveToCart = useCallback(
    async (itemId, productName) => {
      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        await moveToCart(itemId);
        setSuccessMessage(`"${productName}" moved to cart`);
      } catch (err) {
        setLocalError(err.message || "Failed to move item to cart");
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [moveToCart]
  );

  // Handle remove from saved
  const handleRemoveFromSaved = useCallback(
    async (itemId, productName) => {
      if (!window.confirm(`Remove "${productName}" from saved items?`)) {
        return;
      }

      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        removeFromSaved(itemId);
        setSuccessMessage("Item removed from saved items");
      } catch (err) {
        setLocalError(err.message || "Failed to remove item");
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [removeFromSaved]
  );

  // Format product permalink
  const formatPermalink = useCallback((name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }, []);

  // Handle share functionality
  const handleShare = useCallback(
    (item) => {
      const url = `${window.location.origin}/${formatPermalink(item.name)}`;

      if (navigator.share) {
        navigator
          .share({
            title: item.name,
            url: url,
          })
          .catch((err) => console.log("Share cancelled:", err));
      } else {
        navigator.clipboard
          .writeText(url)
          .then(() => {
            setSuccessMessage("Link copied to clipboard");
          })
          .catch(() => {
            setLocalError("Failed to copy link");
          });
      }
    },
    [formatPermalink]
  );

  // Select all items
  const handleSelectAll = useCallback(() => {
    const allSelected = cartItems.every((item) => selectedItems[item._id]);
    const newSelected = {};
    if (!allSelected) {
      cartItems.forEach((item) => {
        newSelected[item._id] = true;
      });
    }
    setSelectedItems(newSelected);
  }, [cartItems, selectedItems]);

  // Get cart totals
  const cartTotals = getCartTotals();
  const { itemCount, subtotal, discount, tax, shippingFee, total } = cartTotals;

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const isCartEmpty = cartItems.length === 0;
  const hasSavedItems = savedItems.length > 0;

  if (!isLoggedIn && isCartEmpty && !hasSavedItems) {
    return <NotLoginCart companyName={companyName} />;
  }

  if (isLoggedIn && isCartEmpty && !hasSavedItems) {
    return (
      <EmptyCart
        companyName={companyName}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
      />
    );
  }

  return (
    <div className="cart-container">
      {/* Stock Validation Banner */}
      {!cartValidation.isValid && (
        <div className="cart-alert-banner">
          <div className="cart-alert-content">
            <svg
              className="cart-alert-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>{cartValidation.errors[0] || "Cart validation failed"}</span>
            <button
              className="cart-alert-fix-btn"
              onClick={async () => {
                const results = await autoFixStockIssues();
                setSuccessMessage(`Fixed ${results.length} stock issues`);
              }}
            >
              Auto-fix Issues
            </button>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {(error || localError || successMessage) && (
        <div className="cart-toast-container">
          {(error || localError) && (
            <div className="cart-toast cart-toast-error">
              <svg
                className="cart-toast-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{error || localError}</span>
              <button
                className="cart-toast-close"
                onClick={() => {
                  clearError();
                  setLocalError(null);
                }}
              >
                ×
              </button>
            </div>
          )}
          {successMessage && (
            <div className="cart-toast cart-toast-success">
              <svg
                className="cart-toast-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              <span>{successMessage}</span>
              <button
                className="cart-toast-close"
                onClick={() => setSuccessMessage(null)}
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      <div className="cart-main">
        {/* Left Section - Cart Items */}
        <section className="cart-items-section">
          {/* Header */}
          <div className="cart-section-header">
            <div className="cart-header-top">
              <h1 className="cart-title">Shopping Cart</h1>
              <button className="cart-deselect-link" onClick={handleSelectAll}>
                {cartItems.every((item) => selectedItems[item._id])
                  ? "Deselect all items"
                  : "Select all items"}
              </button>
            </div>
            <div className="cart-header-price-label">Price</div>
          </div>

          <div className="cart-divider"></div>

          {/* Cart Items List */}
          <div className="cart-items-list">
            {cartItems.map((item) => {
              const isLoading = loadingItems[item._id];
              const isExpanded = expandedItems[item._id];
              const stockInfo = checkStockAvailability(item._id);
              const currentQuantity = item.quantity || 1;
              const itemTotalPrice =
                (item.unitPrice || item.price) * currentQuantity;

              return (
                <article
                  key={item._id}
                  className={`cart-item-card ${
                    isLoading ? "cart-item-loading" : ""
                  } ${!stockInfo.isAvailable ? "cart-item-stock-issue" : ""}`}
                >
                  {/* Item Image */}
                  <div className="cart-item-image-container">
                    <input
                      type="checkbox"
                      className="cart-item-checkbox"
                      checked={selectedItems[item._id] || false}
                      onChange={() =>
                        setSelectedItems((prev) => ({
                          ...prev,
                          [item._id]: !prev[item._id],
                        }))
                      }
                      aria-label={`Select ${item.name}`}
                    />
                    <Link to={`/${formatPermalink(item.name)}`}>
                      <img
                        src={
                          item.featureImage?.filename
                            ? `${import.meta.env.VITE_API_URL}/uploads/${
                                item.featureImage.filename
                              }`
                            : item.featureImage || "/default-image.jpg"
                        }
                        alt={item.name}
                        className="cart-item-image"
                        loading="lazy"
                      />
                    </Link>
                  </div>

                  {/* Item Details */}
                  <div className="cart-item-details">
                    <div className="cart-item-info">
                      <Link
                        to={`/${formatPermalink(item.name)}`}
                        className="cart-item-title"
                      >
                        {item.name}
                      </Link>

                      {/* Stock Status Display */}
                      {stockInfo.status === "pending" ? (
                        <div className="cart-item-stock-status pending">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                          <span>Updating...</span>
                        </div>
                      ) : stockInfo.status === "exceeds_stock" ? (
                        <div className="cart-item-stock-status out-of-stock">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                          </svg>
                          <span>Out of Stock</span>
                          {stockInfo.availableStock > 0 && (
                            <span className="cart-stock-warning-inline">
                              - Only {stockInfo.availableStock} available
                            </span>
                          )}
                        </div>
                      ) : stockInfo.isAvailable ? (
                        <div className="cart-item-stock-status in-stock">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          <span>In Stock</span>
                        </div>
                      ) : (
                        <div className="cart-item-stock-status out-of-stock">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                          </svg>
                          <span>Out of Stock</span>
                        </div>
                      )}

                      {/* SKU */}
                      {item.sku && (
                        <div className="cart-item-sku">SKU: {item.sku}</div>
                      )}

                      {/* Action Buttons */}
                      <div className="cart-item-actions">
                        {/* Quantity Selector */}
                        {isExpanded ? (
                          <div className="cart-quantity-expanded">
                            <div className="cart-quantity-input-wrapper">
                              <input
                                type="number"
                                className={`cart-quantity-input ${
                                  validationErrors[item._id] ? "error" : ""
                                } ${fieldWarnings[item._id] ? "warning" : ""}`}
                                min="1"
                                max={item.numberInStock || 9999}
                                value={localCustomQuantity[item._id] ?? ""}
                                onChange={(e) =>
                                  handleCustomQuantityChange(e, item._id, item)
                                }
                                disabled={isLoading}
                                placeholder="Enter quantity"
                              />
                              {validationErrors[item._id] && (
                                <div className="cart-quantity-error">
                                  {validationErrors[item._id]}
                                </div>
                              )}
                              {fieldWarnings[item._id] &&
                                !validationErrors[item._id] && (
                                  <div className="cart-quantity-warning">
                                    {fieldWarnings[item._id]}
                                  </div>
                                )}
                            </div>
                            <button
                              className="cart-quantity-update-btn"
                              onClick={() =>
                                handleCustomQuantitySubmit(item._id)
                              }
                              disabled={
                                isLoading ||
                                !!validationErrors[item._id] ||
                                !localCustomQuantity[item._id] ||
                                localCustomQuantity[item._id] === item.quantity
                              }
                            >
                              {isLoading ? "Updating..." : "Update"}
                            </button>
                          </div>
                        ) : currentQuantity >= 10 ? (
                          <button
                            className="cart-quantity-display-btn"
                            onClick={() => {
                              setExpandedItems((prev) => ({
                                ...prev,
                                [item._id]: true,
                              }));
                              setLocalCustomQuantity((prev) => ({
                                ...prev,
                                [item._id]: currentQuantity,
                              }));
                            }}
                            disabled={isLoading}
                          >
                            Qty: {currentQuantity}
                          </button>
                        ) : (
                          // Show dropdown for 1-9
                          <select
                            className="cart-quantity-select"
                            value={currentQuantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item._id,
                                e.target.value,
                                item
                              )
                            }
                            disabled={isLoading}
                          >
                            {Array.from({ length: 9 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                Qty: {i + 1}
                              </option>
                            ))}
                            <option value="10+">10+</option>
                          </select>
                        )}

                        <div className="cart-action-divider"></div>

                        <button
                          className="cart-action-btn"
                          onClick={() => handleDeleteItem(item._id, item.name)}
                          disabled={isLoading}
                        >
                          Delete
                        </button>

                        <div className="cart-action-divider"></div>

                        <button
                          className="cart-action-btn"
                          onClick={() =>
                            handleSaveForLater(item._id, item.name)
                          }
                          disabled={isLoading}
                        >
                          Save for later
                        </button>

                        <div className="cart-action-divider"></div>

                        <button
                          className="cart-action-btn"
                          onClick={() => handleShare(item)}
                        >
                          Share
                        </button>
                      </div>
                    </div>

                    {/* Item Price */}
                    <div className="cart-item-price-container">
                      <div className="cart-item-price">
                        <PriceDisplay
                          price={item.unitPrice || item.price}
                          currency={selectedCurrency}
                          conversionRate={conversionRate}
                        />
                      </div>
                      {currentQuantity > 1 && (
                        <div className="cart-item-subtotal">
                          Subtotal:{" "}
                          <PriceDisplay
                            price={itemTotalPrice}
                            currency={selectedCurrency}
                            conversionRate={conversionRate}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Subtotal Footer */}
          <div className="cart-subtotal-section">
            <div className="cart-subtotal-content">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):
              <span className="cart-subtotal-price">
                <PriceDisplay
                  price={subtotal}
                  currency={selectedCurrency}
                  conversionRate={conversionRate}
                />
              </span>
            </div>
          </div>
        </section>

        {/* Right Section - Cart Summary */}
        <aside className="cart-summary-section">
          <CartSummary
            totals={cartTotals}
            selectedCurrency={selectedCurrency}
            isCartValid={cartValidation.isValid}
            conversionRate={conversionRate}
          />
        </aside>
      </div>

      {/* Saved For Later Section */}
      {hasSavedItems && (
        <SavedForLater
          savedItems={savedItems}
          conversionRate={conversionRate}
          selectedCurrency={selectedCurrency}
          formatPermalink={formatPermalink}
          onMoveToCart={handleMoveToCart}
          onRemoveFromSaved={handleRemoveFromSaved}
          loadingItems={loadingItems}
        />
      )}
    </div>
  );
}

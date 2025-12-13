import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

import EmptyCart from "./cart/emptyCart";
import NotLoginCart from "./cart/notLoginCart";
import SavedForLater from "./cart/savedForLater";
import config from "../config.json";
import PriceDisplay from "./utils/priceDisplay";
import "./styles/cart.css";
import { useCartStore } from "./store/cartStore";
import CartSummary from "./cart/cartSummary";

export default function Cart({
  isLoggedIn = false,
  conversionRate = 1,
  selectedCurrency = "USD",
  companyName = "Our Store",
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
    validateQuantity: storeValidateQuantity,
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

  // Sync cart on component mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      syncCart();
    }
  }, [isLoggedIn, syncCart]);

  // Auto-dismiss messages
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

  // Validate cart on changes
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

    if (isLoggedIn) {
      validate();
    }
  }, [cartItems, isLoggedIn, validateCartForCheckout]);

  // Real-time validation
  const getRealTimeValidation = useCallback(
    (quantity, item, isCustom = false) => {
      try {
        const parsedQuantity = storeValidateQuantity(quantity, isCustom);
        const stock = item?.numberInStock || 0;
        const errors = [];
        const warnings = [];

        if (stock > 0 && parsedQuantity > stock) {
          if (isCustom) {
            errors.push(`Only ${stock} items available in stock`);
          } else {
            warnings.push(`Only ${stock} items available`);
          }
        }

        return {
          isValid: errors.length === 0,
          errors,
          warning: warnings.length > 0 ? warnings[0] : null,
          canAutoUpdate: errors.length === 0,
        };
      } catch (error) {
        return {
          isValid: false,
          errors: [error.message],
          warning: null,
          canAutoUpdate: false,
        };
      }
    },
    [storeValidateQuantity]
  );

  // Handle quantity change
  const handleQuantityChange = useCallback(
    async (itemId, quantity, product) => {
      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        setLocalError(null);
        setValidationErrors((prev) => ({ ...prev, [itemId]: null }));

        if (quantity === "10+") {
          setExpandedItems((prev) => ({ ...prev, [itemId]: true }));
          return;
        }

        const parsedQuantity = parseInt(quantity, 10);

        // Validate stock
        const stock = product?.numberInStock || 0;
        if (stock > 0 && parsedQuantity > stock) {
          throw new Error(`Only ${stock} items available in stock`);
        }

        await updateQuantity(itemId, parsedQuantity);
        setSuccessMessage("Quantity updated successfully");
      } catch (err) {
        setLocalError(err.message || "Failed to update quantity");
        setValidationErrors((prev) => ({ ...prev, [itemId]: err.message }));
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [updateQuantity]
  );

  // Handle custom quantity input
  const handleCustomQuantity = useCallback(
    async (itemId, quantity, product) => {
      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        setLocalError(null);
        setValidationErrors((prev) => ({ ...prev, [itemId]: null }));

        const parsedQuantity = parseInt(quantity, 10);

        if (parsedQuantity < 10) {
          throw new Error("Custom quantity must be 10 or more");
        }

        // Validate stock
        const stock = product?.numberInStock || 0;
        if (stock > 0 && parsedQuantity > stock) {
          throw new Error(`Only ${stock} items available in stock`);
        }

        await updateCustomQuantity(itemId, parsedQuantity);
        setSuccessMessage("Quantity updated successfully");
        setExpandedItems((prev) => ({ ...prev, [itemId]: false }));
      } catch (err) {
        setLocalError(err.message || "Failed to update quantity");
        setValidationErrors((prev) => ({ ...prev, [itemId]: err.message }));
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [updateCustomQuantity]
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
              <button
                className="cart-deselect-link"
                onClick={() => setSelectedItems({})}
              >
                Deselect all items
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
              const itemTotalPrice =
                (item.unitPrice || item.price) * (item.quantity || 1);

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
                    <Link
                      to={`/product/${item._id}/${formatPermalink(item.name)}`}
                    >
                      <img
                        src={
                          item.featureImage?.filename
                            ? `${config.mediaUrl}/uploads/${item.featureImage.filename}`
                            : item.snapshot?.featureImage ||
                              "/default-image.jpg"
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
                        to={`/product/${item._id}/${formatPermalink(
                          item.name
                        )}`}
                        className="cart-item-title"
                      >
                        {item.name}
                      </Link>

                      {/* Stock Status */}
                      {stockInfo.isAvailable ? (
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
                          {stockInfo.availableStock > 0 && (
                            <span className="cart-stock-warning-inline">
                              - Only {stockInfo.availableStock} available
                            </span>
                          )}
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
                            <input
                              type="number"
                              className="cart-quantity-input"
                              min="10"
                              max={item.numberInStock || 1000}
                              defaultValue={item.quantity || 10}
                              onBlur={(e) =>
                                handleCustomQuantity(
                                  item._id,
                                  e.target.value,
                                  item
                                )
                              }
                              disabled={isLoading}
                              placeholder="Enter quantity (10+)"
                            />
                            <button
                              className="cart-quantity-cancel"
                              onClick={() =>
                                setExpandedItems((prev) => ({
                                  ...prev,
                                  [item._id]: false,
                                }))
                              }
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <select
                            className="cart-quantity-select"
                            value={item.quantity || 1}
                            onChange={(e) =>
                              handleQuantityChange(
                                item._id,
                                e.target.value,
                                item
                              )
                            }
                            disabled={isLoading || !stockInfo.isAvailable}
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
                      {(item.quantity || 1) > 1 && (
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

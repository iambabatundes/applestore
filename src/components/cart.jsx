import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { calculateTotalPrice } from "./utils/utils";
import CartSummary from "./cart/CartSummary";
import EmptyCart from "./cart/emptyCart";
import NotLoginCart from "./cart/notLoginCart";
import SavedForLater from "../components/cart/savedForLater";
import config from "../config.json";
import { useCartStore } from "../components/store/cartStore";
import "./styles/cart.css";
import PriceDisplay from "./utils/priceDisplay";

export default function Cart({
  isLoggedIn = false,
  handleDelete,
  conversionRate,
  selectedCurrency,
}) {
  const {
    cartItems,
    updateQuantity,
    updateCustomQuantity,
    removeItem,
    saveForLater,
    savedForLater,
    selectedQuantities,
    quantityTenPlus,
    error,
    clearError,
    validateCartForCheckout,
    checkStockAvailability,
    autoFixStockIssues,
    validateQuantity: storeValidateQuantity,
  } = useCartStore();

  const [localError, setLocalError] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [fieldWarnings, setFieldWarnings] = useState({});
  const [localCustomQuantity, setLocalCustomQuantity] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedItems, setSelectedItems] = useState({});

  const timeoutRefs = useRef({});

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

  // Real-time validation
  const getRealTimeValidation = useCallback(
    (quantity, item, isCustom = false) => {
      try {
        const parsedQuantity = storeValidateQuantity(quantity, isCustom);
        const stock = item?.numberInStock ?? item?.inStock;
        const errors = [];
        const warnings = [];

        if (stock !== undefined && parsedQuantity > stock) {
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
    async (itemId, quantity) => {
      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        setLocalError(null);
        setValidationErrors((prev) => ({ ...prev, [itemId]: null }));

        await updateQuantity(itemId, quantity);

        if (quantity !== "10+") {
          setSuccessMessage("Quantity updated successfully");
        }
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
  const handleQuantityTenPlusChange = useCallback(
    (e, itemId, item) => {
      const inputValue = e.target.value;

      if (timeoutRefs.current[itemId]) {
        clearTimeout(timeoutRefs.current[itemId]);
      }

      if (inputValue === "") {
        setLocalCustomQuantity((prev) => ({ ...prev, [itemId]: "" }));
        setValidationErrors((prev) => ({ ...prev, [itemId]: null }));
        setFieldWarnings((prev) => ({ ...prev, [itemId]: null }));
        return;
      }

      const parsedValue = parseInt(inputValue, 10);
      if (!isNaN(parsedValue) && parsedValue >= 1) {
        setLocalCustomQuantity((prev) => ({ ...prev, [itemId]: parsedValue }));

        const validation = getRealTimeValidation(parsedValue, item, true);

        if (!validation.isValid) {
          setValidationErrors((prev) => ({
            ...prev,
            [itemId]: validation.errors[0],
          }));
          setFieldWarnings((prev) => ({
            ...prev,
            [itemId]: validation.warning,
          }));
          return;
        }

        setValidationErrors((prev) => ({ ...prev, [itemId]: null }));
        setFieldWarnings((prev) => ({ ...prev, [itemId]: validation.warning }));

        if (validation.canAutoUpdate) {
          timeoutRefs.current[itemId] = setTimeout(() => {
            handleQuantityUpdate(itemId, parsedValue);
          }, 800);
        }
      }
    },
    [getRealTimeValidation]
  );

  // Update quantity
  const handleQuantityUpdate = useCallback(
    async (itemId, quantity) => {
      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        setLocalError(null);
        setValidationErrors((prev) => ({ ...prev, [itemId]: null }));

        if (quantity < 10) {
          await updateQuantity(itemId, quantity);
        } else {
          await updateCustomQuantity(itemId, quantity);
        }

        setSuccessMessage("Quantity updated successfully");
        setLocalCustomQuantity((prev) => {
          const newState = { ...prev };
          delete newState[itemId];
          return newState;
        });
      } catch (err) {
        setLocalError(err.message || "Failed to update quantity");
        setValidationErrors((prev) => ({ ...prev, [itemId]: err.message }));
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [updateQuantity, updateCustomQuantity]
  );

  // Handle quantity submit
  const handleQuantitySubmit = useCallback(
    async (e, itemId) => {
      e.preventDefault();
      const currentValue =
        localCustomQuantity[itemId] ?? quantityTenPlus[itemId];
      if (!currentValue) {
        setLocalError("Please enter a quantity");
        return;
      }
      await handleQuantityUpdate(itemId, currentValue);
    },
    [localCustomQuantity, quantityTenPlus, handleQuantityUpdate]
  );

  // Handle item deletion
  const handleDeleteItem = useCallback(
    async (itemId) => {
      if (!window.confirm("Are you sure you want to remove this item?")) {
        return;
      }

      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        await removeItem(itemId);

        if (handleDelete) {
          await handleDelete(itemId);
        }

        setSuccessMessage("Item removed from cart");
      } catch (err) {
        setLocalError(err.message || "Failed to remove item");
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [removeItem, handleDelete]
  );

  // Handle save for later
  const handleSaveForLater = useCallback(
    async (itemId) => {
      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        await saveForLater(itemId);
        setSuccessMessage("Item saved for later");
      } catch (err) {
        setLocalError(err.message || "Failed to save item");
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [saveForLater]
  );

  // Calculate totals
  const totalItem = cartItems.reduce((total, item) => {
    const itemQuantity =
      quantityTenPlus[item._id] ?? selectedQuantities[item._id] ?? 1;
    return total + itemQuantity;
  }, 0);

  const price = calculateTotalPrice(
    cartItems,
    selectedQuantities,
    quantityTenPlus,
    conversionRate
  );

  // Format product permalink
  const formatPermalink = useCallback((name) => {
    return name.toLowerCase().replaceAll(" ", "-");
  }, []);

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

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  if (
    cartItems.length === 0 &&
    (!savedForLater || savedForLater.length === 0)
  ) {
    return isLoggedIn ? <EmptyCart /> : <NotLoginCart />;
  }

  const cartValidity = validateCartForCheckout();

  return (
    <div className="cart-container">
      {/* Top Banner */}
      {!cartValidity.isValid && (
        <div className="cart-alert-banner">
          <div className="cart-alert-content">
            <svg
              className="cart-alert-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <span>
              Some items exceed available stock. Please adjust quantities.
            </span>
            <button
              className="cart-alert-fix-btn"
              onClick={() => {
                const results = autoFixStockIssues();
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
              const selectedQuantity = selectedQuantities[item._id] || 1;
              const isQuantityTenPlus = quantityTenPlus[item._id] !== undefined;
              const isLoading = loadingItems[item._id];
              const currentQuantity =
                quantityTenPlus[item._id] || selectedQuantity;
              const itemTotalPrice = item.price * currentQuantity;
              const stockInfo = checkStockAvailability(item._id);

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
                            ? `${config.mediaUrl}/uploads/${item.featureImage.filename}`
                            : "/default-image.jpg"
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

                      {/* Stock Status */}
                      {item.numberInStock > 0 ? (
                        <div className="cart-item-stock-status in-stock">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                          <span>In Stock</span>
                          {!stockInfo.isAvailable && (
                            <span className="cart-stock-warning-inline">
                              - Only {stockInfo.availableStock} available
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="cart-item-stock-status out-of-stock">
                          Out of Stock
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="cart-item-actions">
                        {/* Quantity Selector */}
                        {isQuantityTenPlus ? (
                          <form
                            className="cart-quantity-form"
                            onSubmit={(e) => handleQuantitySubmit(e, item._id)}
                          >
                            <div className="cart-quantity-input-wrapper">
                              <input
                                type="number"
                                className={`cart-quantity-input ${
                                  validationErrors[item._id] ? "error" : ""
                                } ${fieldWarnings[item._id] ? "warning" : ""}`}
                                min="1"
                                max={item.numberInStock || 999}
                                value={
                                  localCustomQuantity[item._id] ??
                                  quantityTenPlus[item._id] ??
                                  10
                                }
                                onChange={(e) =>
                                  handleQuantityTenPlusChange(e, item._id, item)
                                }
                                onBlur={() => {
                                  const currentValue =
                                    localCustomQuantity[item._id] ??
                                    quantityTenPlus[item._id];
                                  if (currentValue) {
                                    handleQuantityUpdate(
                                      item._id,
                                      currentValue
                                    );
                                  }
                                }}
                                disabled={isLoading}
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
                              type="submit"
                              className="cart-quantity-update-btn"
                              disabled={
                                isLoading || !!validationErrors[item._id]
                              }
                            >
                              Update
                            </button>
                          </form>
                        ) : (
                          <select
                            className="cart-quantity-select"
                            value={selectedQuantity}
                            onChange={(e) =>
                              handleQuantityChange(item._id, e.target.value)
                            }
                            disabled={isLoading || !item.numberInStock}
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
                          onClick={() => handleDeleteItem(item._id)}
                          disabled={isLoading}
                        >
                          Delete
                        </button>

                        <div className="cart-action-divider"></div>

                        <button
                          className="cart-action-btn"
                          onClick={() => handleSaveForLater(item._id)}
                          disabled={isLoading}
                        >
                          Save for later
                        </button>

                        <div className="cart-action-divider"></div>

                        <button
                          className="cart-action-btn"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: item.name,
                                url: `${
                                  window.location.origin
                                }/${formatPermalink(item.name)}`,
                              });
                            } else {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/${formatPermalink(
                                  item.name
                                )}`
                              );
                              setSuccessMessage("Link copied to clipboard");
                            }
                          }}
                        >
                          Share
                        </button>
                      </div>
                    </div>

                    {/* Item Price - UPDATED WITH PROPER FORMATTING */}
                    <div className="cart-item-price-container">
                      <div className="cart-item-price">
                        <PriceDisplay
                          price={item.price}
                          currency={selectedCurrency}
                          conversionRate={conversionRate}
                        />
                      </div>
                      {(selectedQuantity > 1 || isQuantityTenPlus) && (
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

          {/* Subtotal Footer - UPDATED WITH PROPER FORMATTING */}
          <div className="cart-subtotal-section">
            <div className="cart-subtotal-content">
              Subtotal ({totalItem} {totalItem === 1 ? "item" : "items"}):
              <span className="cart-subtotal-price">
                <PriceDisplay
                  price={price}
                  currency={selectedCurrency}
                  conversionRate={1}
                />
              </span>
            </div>
          </div>
        </section>

        {/* Right Section - Cart Summary */}
        <aside className="cart-summary-section">
          <CartSummary
            totalItem={totalItem}
            price={price}
            selectedCurrency={selectedCurrency}
            isCartValid={cartValidity.isValid}
            conversionRate={conversionRate}
          />
        </aside>
      </div>

      {/* Saved For Later Section */}
      {savedForLater && savedForLater.length > 0 && (
        <SavedForLater
          savedItems={savedForLater}
          conversionRate={conversionRate}
          selectedCurrency={selectedCurrency}
          formatPermalink={formatPermalink}
        />
      )}
    </div>
  );
}

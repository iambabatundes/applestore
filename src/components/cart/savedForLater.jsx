import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import config from "../../config.json";
import PriceDisplay from "../utils/priceDisplay";
import "./styles/saveForLater.css";

export default function SavedForLater({
  savedItems,
  conversionRate,
  selectedCurrency,
  formatPermalink,
  onMoveToCart,
  onRemoveFromSaved,
  loadingItems = {},
}) {
  const [successMessage, setSuccessMessage] = useState(null);

  const handleMoveToCart = useCallback(
    async (itemId, itemName) => {
      try {
        await onMoveToCart(itemId, itemName);
        setSuccessMessage(`"${itemName}" moved to cart`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error("Failed to move item to cart:", err);
      }
    },
    [onMoveToCart]
  );

  const handleRemove = useCallback(
    async (itemId, itemName) => {
      try {
        await onRemoveFromSaved(itemId, itemName);
        setSuccessMessage(`"${itemName}" removed from saved items`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error("Failed to remove item:", err);
      }
    },
    [onRemoveFromSaved]
  );

  if (!savedItems || savedItems.length === 0) {
    return null;
  }

  return (
    <section className="saved-for-later" aria-label="Saved for later items">
      {successMessage && (
        <div
          className="cart-notification cart-notification--success"
          role="alert"
        >
          <span className="cart-notification__icon">✓</span>
          <span className="cart-notification__message">{successMessage}</span>
        </div>
      )}

      <header className="saved-for-later__header">
        <h2>Saved For Later ({savedItems.length})</h2>
      </header>

      <div className="saved-for-later__grid">
        {savedItems.map((item) => {
          const isLoading = loadingItems[item._id];
          const itemName = item.name || "Unknown Product";

          return (
            <article
              key={item._id}
              className={`saved-item ${isLoading ? "saved-item--loading" : ""}`}
              aria-label={`${itemName} saved for later`}
            >
              <div className="saved-item__image-wrapper">
                <Link to={`/product/${item._id}/${formatPermalink(itemName)}`}>
                  <img
                    src={
                      item.featureImage?.filename
                        ? `${import.meta.env.VITE_API_URL}/uploads/${
                            item.featureImage.filename
                          }`
                        : item.snapshot?.featureImage || "/default-image.jpg"
                    }
                    alt={itemName}
                    className="saved-item__image"
                    loading="lazy"
                  />
                </Link>
              </div>

              <div className="saved-item__content">
                <Link
                  to={`/product/${item._id}/${formatPermalink(itemName)}`}
                  className="saved-item__title-link"
                >
                  <h3 className="saved-item__title">{itemName}</h3>
                </Link>

                <p className="saved-item__price">
                  <PriceDisplay
                    price={item.price || item.unitPrice || 0}
                    currency={selectedCurrency}
                    conversionRate={conversionRate}
                  />
                </p>

                <p className="saved-item__stock">
                  {item.numberInStock > 0 ? (
                    <span className="saved-item__in-stock">In Stock</span>
                  ) : (
                    <span className="saved-item__out-of-stock">
                      Out of Stock
                    </span>
                  )}
                </p>

                <div className="saved-item__actions">
                  <button
                    className="saved-item__button saved-item__button--primary"
                    onClick={() => handleMoveToCart(item._id, itemName)}
                    disabled={isLoading || !item.numberInStock}
                    aria-label={`Move ${itemName} to cart`}
                  >
                    {isLoading ? "Moving..." : "Move to Cart"}
                  </button>
                  <button
                    className="saved-item__button saved-item__button--secondary"
                    onClick={() => handleRemove(item._id, itemName)}
                    disabled={isLoading}
                    aria-label={`Remove ${itemName} from saved items`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

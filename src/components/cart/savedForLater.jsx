import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import config from "../../config.json";
import "./styles/saveForLater.css";

export default function SavedForLater({
  savedItems,
  conversionRate,
  selectedCurrency,
  formatPermalink,
}) {
  const { moveToCart, removeFromSaved } = useCartStore();
  const [loadingItems, setLoadingItems] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);

  const handleMoveToCart = useCallback(
    async (itemId) => {
      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        moveToCart(itemId);
        setSuccessMessage("Item moved to cart");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error("Failed to move item to cart:", err);
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [moveToCart]
  );

  const handleRemove = useCallback(
    async (itemId) => {
      if (!window.confirm("Are you sure you want to remove this item?")) {
        return;
      }

      try {
        setLoadingItems((prev) => ({ ...prev, [itemId]: true }));
        removeFromSaved(itemId);
        setSuccessMessage("Item removed");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        console.error("Failed to remove item:", err);
      } finally {
        setLoadingItems((prev) => ({ ...prev, [itemId]: false }));
      }
    },
    [removeFromSaved]
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
          const convertedPrice = (item.price * conversionRate).toFixed(2);

          return (
            <article
              key={item._id}
              className={`saved-item ${isLoading ? "saved-item--loading" : ""}`}
              aria-label={`${item.name} saved for later`}
            >
              <div className="saved-item__image-wrapper">
                <img
                  src={
                    item.featureImage && item.featureImage.filename
                      ? `${config.mediaUrl}/uploads/${item.featureImage.filename}`
                      : "/default-image.jpg"
                  }
                  alt={item.name}
                  className="saved-item__image"
                  loading="lazy"
                />
              </div>

              <div className="saved-item__content">
                <Link
                  to={`/${formatPermalink(item.name)}`}
                  className="saved-item__title-link"
                >
                  <h3 className="saved-item__title">{item.name}</h3>
                </Link>

                <p className="saved-item__price">
                  {selectedCurrency} {convertedPrice}
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
                    onClick={() => handleMoveToCart(item._id)}
                    disabled={isLoading || !item.numberInStock}
                    aria-label={`Move ${item.name} to cart`}
                  >
                    {isLoading ? "Moving..." : "Move to Cart"}
                  </button>
                  <button
                    className="saved-item__button saved-item__button--secondary"
                    onClick={() => handleRemove(item._id)}
                    disabled={isLoading}
                    aria-label={`Remove ${item.name} from saved items`}
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

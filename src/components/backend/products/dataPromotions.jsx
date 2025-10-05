import React, { useState, useMemo } from "react";
import "./styles/dataPromotions.css";

export default function DataPromotions({
  isPromotionsVisible,
  selectedPromotions,
  setSelectedPromotions,
  dataPromotions = [], // Default to empty array
}) {
  const [promotion, setPromotion] = useState("");

  // Use useMemo to compute filtered promotions without useEffect
  const filteredPromotions = useMemo(() => {
    if (!dataPromotions || dataPromotions.length === 0) return [];

    const lowerCasedInput = promotion.toLowerCase();
    return dataPromotions.filter(
      (promo) =>
        promo.name.toLowerCase().includes(lowerCasedInput) ||
        promo.promotionType.toLowerCase().includes(lowerCasedInput)
    );
  }, [promotion, dataPromotions]);

  // Early return with friendly message if no promotions exist
  if (isPromotionsVisible && (!dataPromotions || dataPromotions.length === 0)) {
    return (
      <section className="product__promotions">
        <div className="promotion__item--empty">
          No promotions available. Please create promotions first.
        </div>
      </section>
    );
  }

  return (
    <>
      {isPromotionsVisible && (
        <section className="product__promotions">
          <div className="promotion__search-container">
            <input
              type="text"
              placeholder="Search promotions by name or type..."
              value={promotion}
              onChange={(e) => setPromotion(e.target.value)}
              className="promotion__search-input"
              aria-label="Search promotions"
            />
          </div>

          {/* Scrollable Promotion List */}
          <ul className="promotion__list">
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map((promo) => (
                <li key={promo._id} className="promotion__item">
                  <label className="promotion__label">
                    <input
                      type="checkbox"
                      checked={selectedPromotions.some(
                        (p) => p._id === promo._id
                      )}
                      onChange={() => {
                        setSelectedPromotions((prev) =>
                          prev.some((p) => p._id === promo._id)
                            ? prev.filter((p) => p._id !== promo._id)
                            : [...prev, promo]
                        );
                      }}
                      className="promotion__checkbox"
                    />
                    {promo.name} ({promo.promotionType})
                  </label>
                </li>
              ))
            ) : (
              <li className="promotion__item--empty">No promotions found</li>
            )}
          </ul>
        </section>
      )}
    </>
  );
}

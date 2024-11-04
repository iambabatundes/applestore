import React, { useState, useEffect } from "react";
import "./styles/dataPromotions.css";

export default function DataPromotions({
  isPromotionsVisible,
  selectedPromotions,
  setSelectedPromotions,
  dataPromotions,
}) {
  const [promotion, setPromotion] = useState("");
  const [filteredPromotions, setFilteredPromotions] = useState([]);

  // Filter promotions in real-time
  useEffect(() => {
    const lowerCasedInput = promotion.toLowerCase();
    setFilteredPromotions(
      dataPromotions.filter(
        (promo) =>
          promo.promotionName.toLowerCase().includes(lowerCasedInput) ||
          promo.promotionType.toLowerCase().includes(lowerCasedInput)
      )
    );
  }, [promotion, dataPromotions]);

  return (
    <>
      {isPromotionsVisible && (
        <section className="product__promotions">
          {/* Search Input */}
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
                      checked={selectedPromotions.includes(promo.promotionName)}
                      onChange={() => {
                        setSelectedPromotions((prev) =>
                          prev.includes(promo.promotionName)
                            ? prev.filter((p) => p !== promo.promotionName)
                            : [...prev, promo.promotionName]
                        );
                      }}
                      className="promotion__checkbox"
                    />
                    {promo.promotionName} ({promo.promotionType})
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

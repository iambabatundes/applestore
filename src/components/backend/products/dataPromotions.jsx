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

  useEffect(() => {
    const lowerCasedInput = promotion.toLowerCase();
    setFilteredPromotions(
      dataPromotions.filter(
        (promo) =>
          promo.name.toLowerCase().includes(lowerCasedInput) ||
          promo.promotionType.toLowerCase().includes(lowerCasedInput)
      )
    );
  }, [promotion, dataPromotions]);

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

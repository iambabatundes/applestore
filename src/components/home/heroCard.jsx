import React from "react";
import { formatPrice } from "./common/utils";

export default function HeroCard({
  index,
  card,
  backgroundColor,
  textColor,
  selectedCurrency = "NGN",
  conversionRate = 1,
}) {
  return (
    <div key={index} className="promo-card" style={{ backgroundColor }}>
      <h3 style={{ color: textColor }}>{card.title}</h3>
      <section className="card-content">
        {card.items.map((item, idx) => {
          const {
            currency: saleCurrency,
            whole: saleWhole,
            fraction: saleFraction,
          } = formatPrice(item.price, selectedCurrency, conversionRate);
          const {
            currency: originalCurrency,
            whole: originalWhole,
            fraction: originalFraction,
          } = item.oldPrice
            ? formatPrice(item.oldPrice, selectedCurrency, conversionRate)
            : {};

          return (
            <div className="promoContent" key={idx}>
              <img src={item.imgSrc} alt="" className="promo-card__image" />
              <article>
                <p>
                  <span className="currency">{saleCurrency}</span>
                  <span className="whole">{saleWhole}</span>
                  <span className="fraction">.{saleFraction}</span>
                </p>
                {item.oldPrice && (
                  <p className="old-price">
                    <span className="currency">{originalCurrency}</span>
                    <span className="whole">{originalWhole}</span>
                    <span className="fraction">.{originalFraction}</span>
                  </p>
                )}
              </article>
            </div>
          );
        })}
      </section>
    </div>
  );
}

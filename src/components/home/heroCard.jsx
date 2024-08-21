import React from "react";

export default function HeroCard({ index, card }) {
  return (
    <div key={index} className="promo-card">
      <h3>{card.title}</h3>
      <section className="card-content">
        {card.items.map((item, idx) => (
          <div className="promoContent" key={idx}>
            <img src={item.imgSrc} alt="" className="promo-card__image" />
            <article>
              <p>{item.price}</p>
              <p className="old-price">{item.oldPrice}</p>
            </article>
          </div>
        ))}
      </section>
    </div>
  );
}

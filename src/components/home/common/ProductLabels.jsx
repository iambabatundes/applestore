import React from "react";

export default function ProductLabels({
  superDeal,
  shipping,
  choice,
  discount,
}) {
  return (
    <>
      {superDeal && (
        <div className="productCard__superDeal-main">
          <article className="productCard__superDeal">
            <span className="productCard__super">Super</span>
            <span className="productCard__deal">Deals</span>
          </article>
          <span className="productCard__superDeal-text">{superDeal}</span>
        </div>
      )}

      {shipping && (
        <div className="productCard__shipping">
          <span className="productCard__shipping-badge">Shipping</span>
          <span className="productCard__shipping-text">{superDeal}</span>
        </div>
      )}

      {choice && (
        <article className="productCard__choice">
          <span className="productCard__choice-badge">Choice</span>
          <span className="productCard__choice-text">{choice}</span>
        </article>
      )}

      {discount && (
        <article className="productCard__discount">
          <span className="productCard__discount-text">- {discount}</span>
        </article>
      )}
    </>
  );
}

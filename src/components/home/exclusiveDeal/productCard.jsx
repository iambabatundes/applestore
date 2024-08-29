import React from "react";

export default function productCard({ image, price, oldPrice, discount }) {
  return (
    <article className="productCard">
      <img src={image} alt="Product" className="productCard__image" />
      <div className="productCard__priceInfo">
        <h1 className="productCard__price">{price}</h1>
        {oldPrice && <span className="productCard__oldPrice">{oldPrice}</span>}
        {discount && <span className="productCard__discount">{discount}</span>}
      </div>
    </article>
  );
}

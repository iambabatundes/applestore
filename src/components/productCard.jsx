import React, { useState } from "react";
import "../components/styles/productCard.css";

export default function ProductCard({ image, title, rating, price }) {
  return (
    <section>
      <div className="product-card">
        <img src={image} alt="Product" className="product-card__image" />
        <h3 className="product-card__title">{title}</h3>
        <div className="product-card__group">
          <span className="product-card__rating">{rating} stars</span>
          <span className="product-card__price">${price}</span>
        </div>
        <button className="product-card__button">
          <i className="fa fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </section>
  );
}

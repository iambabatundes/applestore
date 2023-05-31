import React from "react";
import "../components/styles/productCard.css";

export default function ProductCard({
  image,
  title,
  //   description,
  rating,
  price,
  Userimage,
}) {
  return (
    <section>
      <div className="product-card">
        <img src={image} alt="Product" className="product-card__image" />
        <h3 className="product-card__title">{title}</h3>
        {/* <p className="product-card__description">{description}</p> */}
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

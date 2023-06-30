import React from "react";
import "./styles/productCards.css";

export default function ProductCards({ item, className, addToCart }) {
  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <section className={`${className} productCards`}>
      <img
        className="productCards__image"
        src={item.image}
        alt="Product image"
      />
      <div className="productCards__content">
        <h1 className={`${className} productCards__title`}>{item.title}</h1>
        <h2 className={`${className} productCards__title header`}>
          {item.header}
        </h2>
        <h4 className={`${className} productCards__subtitle`}>
          {item.subtitle}
        </h4>

        <div className="productCard-container">
          <div className="products-card__group">
            <span className="products-card__rating">{item.rating} stars</span>
            <span className="products-card__price">${item.price}</span>
          </div>
          <button className="products-card__button" onClick={handleAddToCart}>
            <i className="fa fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

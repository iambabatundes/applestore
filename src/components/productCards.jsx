import React, { useState } from "react";
import "./styles/productCards.css";
import { Link } from "react-router-dom";

export default function ProductCards({ item, className, addToCart, product }) {
  const [added, setAdded] = useState(false);
  const handleAddToCart = () => {
    addToCart(item);
    setAdded(true);
  };

  function formatPermalink(title) {
    return title.toLowerCase().replaceAll(" ", "-");
  }

  return (
    <section className={`productCards`}>
      <img
        className="productCards__image"
        src={item.image}
        alt="This is a Product"
      />
      <div className={`productCards__content`}>
        <Link
          to={`/${formatPermalink(product.title)}`}
          className="productCards__links"
        >
          <h1 className={`${className} productCards__title`}>{item.title}</h1>
        </Link>
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
          {added && (
            <div className="product-card__added">
              <i className="fa fa-check-circle"></i>
              <span>Added to cart</span>
            </div>
          )}
          <button className="products-card__button" onClick={handleAddToCart}>
            <i className="fa fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
}

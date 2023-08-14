import React, { useState, useEffect } from "react";
import "./styles/productCards.css";
import { Link } from "react-router-dom";

export default function ProductCards({
  item,
  className,
  addToCart,
  product,
  cartItems,
}) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    // Load added status from localStorage
    const addedStatus = localStorage.getItem(`added_${item.id}`);
    if (addedStatus === "true") {
      setAdded(true);
    }
  }, [item.id]);

  useEffect(() => {
    if (cartItems && cartItems.some((cartItem) => cartItem.id === item.id)) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [cartItems, item.id]);

  const handleAddToCart = () => {
    addToCart(item);
    setAdded(true);

    // Save the added status to localStorage
    localStorage.setItem(`added_${item.id}`, "true");
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
          {!added && (
            <button className="products-card__button" onClick={handleAddToCart}>
              <i className="fa fa-shopping-cart"></i> Add to Cart
            </button>
          )}
          {added && cartItems.some((cartItem) => cartItem.id === item.id) && (
            <div>
              <Link to="/cart" className="products-card__button">
                <i className="fa fa-shopping-cart"></i> Go to Cart
              </Link>
              <Link to="/checkout">
                <button className="products-card__button">
                  <i className="fa fa-shopping-cart"></i> Proceed to checkout
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

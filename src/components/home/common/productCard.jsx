import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StarRating from "./starRating";
import CartIcon from "./cartIcon";
import "../styles/bigSave.css";

export default function ProductCard({
  item,
  addToCart,
  handleRatingChange,
  cartItems,
  productName,
  //   itemAdded,
  //   setItemAdded,
}) {
  const [added, setIAdded] = useState(false);

  const formatPrice = (price) => {
    const [currency, amount] = price.match(/([^\d]+)([\d,.]+)/).slice(1, 3);
    const [whole, fraction] = amount.split(".");
    return { currency, whole, fraction };
  };

  const { currency, whole, fraction } = formatPrice(item.price);

  useEffect(() => {
    // Load added status from localStorage
    const addedStatus = localStorage.getItem(`added_${item.id}`);
    if (addedStatus === "true") {
      setIAdded(true);
    }
  }, [item.id]);

  useEffect(() => {
    if (cartItems && cartItems.some((cartItem) => cartItem.id === item.id)) {
      setIAdded(true);
    } else {
      setIAdded(false);
    }
  }, [cartItems, item.id]);

  const handleAddToCart = () => {
    addToCart(item);
    setIAdded(true);

    // Save the added status to localStorage
    localStorage.setItem(`added_${item.id}`, "true");
  };

  function formatPermalink(name) {
    return name.toLowerCase().replaceAll(" ", "-");
  }

  return (
    <div className="product-card">
      <img src={item.image} alt={item.name} className="bigSave__productImage" />

      <article className="bigSave__content">
        <Link to={`/${formatPermalink(productName.name)}`}>
          <h1 className="bigSave__product-name">{item.name}</h1>
        </Link>
        <div className="bigSave__rating">
          <StarRating
            rating={item.rating}
            totalStars={5}
            size={15}
            onRatingChange={handleRatingChange}
            initialRating={item.rating}
            readOnly={true}
          />
          {item.sold && (
            <span className="bigSave__product-sold">{item.sold}</span>
          )}
        </div>
        <div className="bigSave__price">
          <span className="bigSave__salePrice">
            <span className="currency">{currency}</span>
            <span className="whole">{whole}</span>
            <span className="fraction">.{fraction}</span>
          </span>
          <span className="bigSave__originalPrice">{item.originalPrice}</span>
        </div>

        {added && (
          <div className="product-card__added">
            <i className="fa fa-check-circle"></i>
            <span>Added to cart</span>
          </div>
        )}
        {!added && (
          <CartIcon
            className="bigSave__cartIconProduct"
            onClick={handleAddToCart}
          />
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
      </article>
    </div>
  );
}

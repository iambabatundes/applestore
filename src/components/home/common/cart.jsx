import React from "react";
import { Link } from "react-router-dom";
import cart from "../images/cartItem.png";

export default function Cart({ cartItemCount }) {
  return (
    <div className="navbar-cart">
      <Link to="/cart" className="navbar-cart-link">
        <img src={cart} alt="Cart" className="navbar-cart-icon" />
        <h2 className="navbar-cart-text">Cart</h2>
        <div className="cart-item-count">{cartItemCount}</div>
      </Link>
    </div>
  );
}

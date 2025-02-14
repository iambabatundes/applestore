import React from "react";
import CartIcon from "./cartIcon";
import { Link } from "react-router-dom";

export default function ProductActions({ item, addToCart, cartItems }) {
  const isAdded = cartItems.some((cartItem) => cartItem._id === item._id);

  const handleAddToCart = () => {
    addToCart(item);
    localStorage.setItem(`added_${item._id}`, "true");
  };

  return isAdded ? (
    <div className="productCard__cartBtn">
      <Link to="/cart" className="gotoCartBtn productCart__gotoCartBtn">
        <i className="fa fa-shopping-cart"></i> Go to Cart
      </Link>
      <Link to="/checkout" className="productCart__proceedCheckoutBtn">
        Proceed to Checkout
      </Link>
    </div>
  ) : (
    <CartIcon onClick={handleAddToCart} />
  );
}

// CartStatus.js
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import CartIcon from "./cartIcon";

function CartStatus({ added, handleAddToCart, cartItems, item }) {
  return (
    <>
      {added ? (
        <div className="productCard__added">
          <i className="fa fa-check-circle productCard-check"></i>
          <article className="productCard__addedtoCart-main">
            <span className="productCard__adding">Added</span>
            <span className="productCard__toCart">to cart</span>
          </article>
        </div>
      ) : (
        <CartIcon
          className="productCard__cartIconProduct"
          onClick={handleAddToCart}
        />
      )}

      {added && cartItems.some((cartItem) => cartItem.id === item.id) && (
        <div className="productCard__cartBtn">
          <Link to="/cart" className="gotoCartBtn productCart__gotoCartBtn">
            <i className="fa fa-shopping-cart"></i> Go to Cart
          </Link>
          <Link to="/checkout" className="productCart__proceedCheckoutBtn">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </>
  );
}

CartStatus.propTypes = {
  added: PropTypes.bool.isRequired,
  handleAddToCart: PropTypes.func.isRequired,
  cartItems: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
};

export default React.memo(CartStatus);

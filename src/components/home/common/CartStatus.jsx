// components/CartStatus.jsx
import React, { Link } from "react-router-dom";
import "../styles/cartStatus.css";
import CartIcon from "./cartIcon";

function CartStatus({
  added,
  handleAddToCart,
  cartItems,
  item,
  isAdding,
  isPending,
}) {
  // Show loading state while adding
  const showLoading = isAdding || isPending;

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
        <div className="cart-icon-wrapper">
          {showLoading ? (
            <div className="cart-icon-loading">
              <i className="fa fa-spinner fa-spin"></i>
            </div>
          ) : (
            <CartIcon
              className="productCard__cartIconProduct"
              onClick={handleAddToCart}
            />
          )}
        </div>
      )}

      {added &&
        cartItems.some(
          (cartItem) =>
            (cartItem._id || cartItem.product?._id) === (item._id || item.id)
        ) && (
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

export default React.memo(CartStatus);

import React from "react";
import { Link } from "react-router-dom";

export default function CartSummary({ totalItem, price, selectedCurrency }) {
  return (
    <section className="cart-right">
      <div className="cart-subtotal">
        <h2>Your AppleStore Cart</h2>
        <h3>
          Subtotal ({totalItem} {totalItem === 1 ? "item" : "items"}):{" "}
          {selectedCurrency}
          {price}
        </h3>
        <Link to="/checkout">
          <button>Proceed to checkout</button>
        </Link>
      </div>
      <section className="cart-product">
        <h1>Cart Product</h1>
      </section>
    </section>
  );
}

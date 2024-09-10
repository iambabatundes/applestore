import React from "react";
import { Link } from "react-router-dom";

export default function NotLoginCart() {
  return (
    <section className="cart cart-main">
      <section className="cart-right">
        <img src="../apple.png" alt="Apple" width={50} />
        <h2>Your AppleStore Cart is empty</h2>
        <h3>Shop today's deals</h3>

        <Link to="/login">
          <button>Login to your account</button>
        </Link>

        <Link to="/register">
          <button>Sign up</button>
        </Link>
      </section>

      <section className="cart-left">
        <section className="cart-product">
          <h1>Cart Product</h1>
        </section>
      </section>
    </section>
  );
}

import React from "react";

export default function EmptyCart() {
  return (
    <section className="cart cart-main">
      <section className="cart-right">
        <img src="/apple.png" alt="Apple" width={50} />
        <h2>Your AppleStore Cart is empty</h2>
        <h3>Shop today's deals</h3>
      </section>

      <section className="cart-left">
        <section className="cart-product">
          <h1>Cart Product</h1>
        </section>
      </section>
    </section>
  );
}

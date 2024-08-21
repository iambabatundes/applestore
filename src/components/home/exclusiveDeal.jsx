import React from "react";
import productImage from "./images/produ1.avif";
import productImage1 from "./images/produ2.avif";
import "./styles/exclusiveDeal.css";

export default function ExclusiveDeal() {
  return (
    <section className="exclusiveDeal-main">
      <div className="exclusiveDeal welcomeDeal">
        <header className="welcomeDeal__header-container">
          <h1 className="welcomeDeal__header">Welcome Deal</h1>
          <h4 className="welcomeDeal__subHeader">Your Exclusive Price</h4>
        </header>

        <article className="welcomeDeal__productImage-container">
          <img
            src={productImage}
            alt="Exclusive Product"
            className="welcomeDeal__productImage"
          />
          <div className="welcomeDeal__price-main">
            <h1 className="welcomeDeal__price">NGN23,000.00</h1>
            <span className="welcomeDeal__oldprice">NGN80,000.00</span>
          </div>
        </article>
      </div>

      <div className="exclusiveDeal firstComers">
        <section className="firstComers__action">
          <button className="firstComers__btn firstComers__register">
            Register
          </button>
          <button className="firstComers__btn firstComers__signIn">
            Sign In
          </button>
        </section>

        <section className="firstComers__offer">
          <h1 className="firstComers__offer-title">First come, 50% off</h1>
          <button className="firstComers__offer-label">Shipping</button>
          <span className="firstComers__offer-subtitle">Free Shipping</span>
          <div className="firstComers__products">
            <div className="firstComers__product">
              <img
                src={productImage1}
                alt="Product 1"
                className="firstComers__productImage"
              />
              <p className="firstComers__productPrice">NGN45,000</p>
              <span className="firstComers__discount">-60%</span>
            </div>

            <div className="firstComers__product">
              <img
                src={productImage}
                alt="Product 2"
                className="firstComers__productImage"
              />
              <p className="firstComers__productPrice">NGN45,000</p>
              <span className="firstComers__discount">-60%</span>
            </div>
          </div>

          <div className="firstComers__products">
            <div className="firstComers__product">
              <img
                src={productImage1}
                alt="Product 1"
                className="firstComers__productImage"
              />
              <p className="firstComers__productPrice">NGN45,000</p>
              <span className="firstComers__discount">-60%</span>
            </div>

            <div className="firstComers__product">
              <img
                src={productImage}
                alt="Product 2"
                className="firstComers__productImage"
              />
              <p className="firstComers__productPrice">NGN45,000</p>
              <span className="firstComers__discount">-60%</span>
            </div>
          </div>
        </section>
      </div>

      <div className="exclusiveDeal buyFrom10k">
        <h1 className="buyFrom10k__title">Buy from 10k</h1>
      </div>
    </section>
  );
}

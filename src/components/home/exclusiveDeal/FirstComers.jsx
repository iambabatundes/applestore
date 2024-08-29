import React from "react";
import "../styles/exclusiveDeal.css";
import { Link } from "react-router-dom";
import ProductList from "./ProductList";

// Function to group products into chunks
const groupProducts = (products, chunkSize) => {
  const groups = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    groups.push(products.slice(i, i + chunkSize));
  }
  return groups;
};

export default function FirstComers({ productImage1, productImage, user }) {
  const products = [
    { image: productImage1, price: "NGN45,000", discount: "-60%" },
    { image: productImage, price: "NGN55,000", discount: "-60%" },
    { image: productImage, price: "NGN85,000", discount: "-70%" },
    { image: productImage1, price: "NGN95,000", discount: "-50%" },
  ];

  // Group products into pairs
  const productGroups = groupProducts(products, 2);

  return (
    <div className="firstComers">
      {!user && (
        <section className="firstComers__action">
          <button className="firstComers__btn firstComers__register">
            <Link to="/register">Register</Link>
          </button>

          <button className="firstComers__btn firstComers__signIn">
            <Link to="/login">Sign in</Link>
          </button>
        </section>
      )}

      <section className="firstComers__offer">
        <h1 className="firstComers__offer-title">
          First<span className="firstComers__come">Come, </span>
          <span className="firstComers__50off">50% off</span>
        </h1>
        <button className="firstComers__offer-label">Shipping</button>
        <span className="firstComers__offer-subtitle">Free Shipping</span>

        {productGroups.map((group, index) => (
          <ProductList
            key={index}
            products={group}
            containerClassName="firstComers__products"
            productClassName="firstComers__product"
            imageClassName="firstComers__productImage"
            priceClassName="firstComers__productPrice"
            priceContainer="firstComers__priceContainer"
            discountClassName="firstComers__discount"
          />
        ))}
      </section>

      {user && (
        <div className="firstComers-user__product">
          <img
            src={productImage1}
            alt="Product 1"
            className="firstComers-user__productImage"
          />
          <article>
            <p className="firstComers-user__productPrice">NGN45,000</p>
            <span className="firstComers-user__oldPrice">N100, 000.89</span>
          </article>
        </div>
      )}
    </div>
  );
}

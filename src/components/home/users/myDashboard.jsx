import React from "react";
import image from "../images/bac1.jpg";
import FetchOrders from "./common/FetchOrders";

export default function MyDashboard({ userId }) {
  return (
    <div>
      <h1>My Dashboard</h1>
      <div className="stats">
        <div className="stat stat-background">
          <h2>$ 500</h2>
          <p>spent</p>
        </div>
        <div className="stat stat-background1">
          <h2>21</h2>
          <p>Order Completed</p>
        </div>
        <div className="stat stat-background2">
          <h2>43</h2>
          <p>Total Order</p>
        </div>
      </div>
      <div className="yourOrders">
        <h2>My Orders</h2>
        <FetchOrders userId={userId} />
      </div>
      <section className="userProduct-pick">
        <h2>Top Product for you</h2>
        <div className="top-productMain">
          <div className="top-product">
            <img className="top-product__image" src={image} alt="" />
            <h1 className="product-title">Apple 2354 for sell</h1>
            <div className="Userprice__section">
              <span>
                <h2 className="price">$3,000</h2>
                <h2 className="discount__price">$2,800</h2>
              </span>
              <span>Add to cart</span>
            </div>
          </div>
          <div className="top-product">
            <img className="top-product__image" src={image} alt="" />
            <h1 className="product-title">Mongo 2354 for sell</h1>
            <div className="Userprice__section">
              <span>
                <h2 className="price">$3,000</h2>
                <h2 className="discount__price">$2,800</h2>
              </span>
              <span>Add to cart</span>
            </div>
          </div>
          <div className="top-product">
            <img className="top-product__image" src={image} alt="" />
            <h1 className="product-title">Orange 2354 for sell</h1>
            <div className="Userprice__section">
              <span>
                <h2 className="price">$3,000</h2>
                <h2 className="discount__price">$2,800</h2>
              </span>
              <span>Add to cart</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

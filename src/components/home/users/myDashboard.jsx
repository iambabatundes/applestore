import React, { useEffect, useState } from "react";
import FetchOrders from "./common/FetchOrders";
import TopProduct from "../topProduct";
import { getUserOrders } from "../../../services/orderService";
import "./style/myDashboard.css";

export default function MyDashboard({ user, addToCart, cartItems }) {
  const [stats, setStats] = useState({
    totalSpent: 0,
    completedOrders: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getUserOrders();
        const { totalSpent, completedOrders, totalOrders } = response;
        setStats({ totalSpent, completedOrders, totalOrders });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="dashboard-main">
      <h1 className="dashboard-header">My Dashboard</h1>
      <div className="stats">
        <div className="stat stat-background">
          <h2>${stats.totalSpent}</h2>
          <p>Spent</p>
        </div>
        <div className="stat stat-background1">
          <h2>{stats.completedOrders}</h2>
          <p>Order Completed</p>
        </div>
        <div className="stat stat-background2">
          <h2>{stats.totalOrders}</h2>
          <p>Total Orders</p>
        </div>
      </div>
      <div className="yourOrders">
        <h2>My Orders</h2>
        <FetchOrders user={user} />
      </div>

      <TopProduct cartItems={cartItems} addToCart={addToCart} />
    </section>
  );
}

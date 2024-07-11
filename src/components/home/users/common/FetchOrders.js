import React, { useEffect, useState } from "react";
import { getUserOrders } from "../../../../services/orderService";
import "../../styles/userProfile.css";

const FetchOrders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getUserOrders();
        const latestOrders = response.data.slice(0, 5); // Get the latest 5 orders
        setOrders(latestOrders);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading orders.</p>;
  }

  if (orders.length === 0) {
    return null; // Do not render if there are no orders
  }

  return (
    <div className="orders-container">
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <h3>Order ID: {order._id}</h3>
            <span className={`order-status ${order.orderStatus.toLowerCase()}`}>
              {order.orderStatus}
            </span>
          </div>
          {order.items.map((item) => (
            <div key={item._id} className="order-item">
              <img src={item.product.featureImage} alt={item.product.name} />
              <div className="item-details">
                <p>{item.product.name}</p>
                <p>Price: ${item.product.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total: ${item.quantity * item.product.price}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FetchOrders;

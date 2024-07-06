import React, { useEffect, useState } from "react";
import { fetchUsersOrder } from "../../../../services/orderService";
import "../../styles/userProfile.css";

const FetchOrders = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("User ID: ", userId); // Check if userId is defined
    if (!userId) {
      setError(new Error("User ID is undefined"));
      setLoading(false);
      return;
    }

    // if (!userId) return;

    const fetchOrders = async () => {
      try {
        const response = await fetchUsersOrder(userId);
        setOrders(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (orders.length === 0) return <div>No orders made for your goods.</div>;

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

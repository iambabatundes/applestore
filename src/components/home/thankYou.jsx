import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./styles/thankYou.css";

export default function ThankYou() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderNumber}`);
        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order:", error);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) return <div>Loading...</div>;

  if (!order) return <div>Order not found</div>;

  return (
    <div className="thank-you-container">
      <div className="thank-you-content">
        <h1>Thank You for Your Purchase!</h1>
        <p>Your order has been successfully placed.</p>
        <div className="order-summary">
          <h2>Order Summary</h2>
          <p>Order Number: {order.orderNumber}</p>
          <p>Total: ${order.total.toFixed(2)}</p>
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <img
                  src={`/uploads/${item.product.featureImage.filename}`}
                  alt={item.product.name}
                />
                <div className="order-item-details">
                  <h3>{item.product.name}</h3>
                  <p>Price: ${item.product.price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Subtotal: ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="thank-you-actions">
          <Link to="/shop" className="button">
            Continue Shopping
          </Link>
          <Link to="/orders" className="button secondary">
            View Your Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

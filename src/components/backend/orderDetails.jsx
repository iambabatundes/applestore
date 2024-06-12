import React from "react";
import Modal from "react-modal";
import "./styles/order.css";
import "../../components/backend/";
import config from "../../config.json";

// Define modal styles
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "600px",
    maxWidth: "80%",
    maxHeight: "80%",
    overflow: "auto",
  },
};

export default function OrderDetails({ onClose, getOrderData }) {
  if (!getOrderData) {
    return null;
  }

  return (
    <Modal
      isOpen={getOrderData !== null}
      onRequestClose={onClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <section className="order-details">
        <h2>Order Details</h2>

        <div className="order-details__content">
          <p>
            <strong>Order Number:</strong> {getOrderData.orderNumber}
          </p>
          <p>
            <strong>User:</strong> {getOrderData.user.username}
          </p>
          <p>
            <strong>Phone Number:</strong> {getOrderData.user.phoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {getOrderData.user.address}
          </p>
          <div className="order-details__items">
            <h3>Items:</h3>
            {getOrderData.items.map((item, index) => (
              <div key={index} className="order-details__item">
                <img
                  src={`${config.mediaUrl}/uploads/${item.product.featureImage.filename}`}
                  alt={item.product.featureImage.originalName || "Item Image"}
                  className="order-details__item-image"
                />
                <div className="order-details__item-info">
                  <p>
                    <strong>Product:</strong> {item.product.name}
                  </p>
                  <p>
                    <strong>Price:</strong> ${item.product.price}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p>
            <strong>Total Price:</strong> ${getOrderData.total}
          </p>
          <p>
            <strong>Order Date:</strong> {getOrderData.orderDate}
          </p>
          <p>
            <strong>Status:</strong> {getOrderData.status}
          </p>
          <button onClick={onClose}>Close</button>
        </div>
      </section>
    </Modal>
  );
}

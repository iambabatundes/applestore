import React from "react";
import Modal from "react-modal";
import "../backend/orders/styles/order.css";
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
    width: "950px",
    maxWidth: "100%",
    maxHeight: "85%",
    overflow: "auto",
    zIndex: 1001,
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
        <div className="order-details-header">
          <h2>Order Details</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>

        <div className="order-details-content">
          <p>
            <strong>Order Number:</strong> {getOrderData.orderNumber}
          </p>

          <table className="order-details-user-table">
            <tbody>
              {getOrderData.user.profileImage && (
                <tr>
                  <td colSpan="2" style={{ textAlign: "center" }}>
                    <img
                      src={`${config.mediaUrl}/uploads/${getOrderData.user.profileImage.filename}`}
                      alt={getOrderData.user.username}
                      className="order-details-user-image"
                    />
                  </td>
                </tr>
              )}
              <tr>
                <th>First Name</th>
                <td>{getOrderData.user.firstName}</td>
              </tr>
              <tr>
                <th>Last Name</th>
                <td>{getOrderData.user.lastName}</td>
              </tr>
              <tr>
                <th>User</th>
                <td>{getOrderData.user.username}</td>
              </tr>
              <tr>
                <th>Phone Number</th>
                <td>{getOrderData.user.phoneNumber}</td>
              </tr>
              <tr>
                <th>Email Address</th>
                <td>{getOrderData.user.email}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{getOrderData.user.address}</td>
              </tr>
            </tbody>
          </table>

          <h3>Items:</h3>
          <table className="order-details-items-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {getOrderData.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={`${config.mediaUrl}/uploads/${item.product.featureImage.filename}`}
                      alt={
                        item.product.featureImage.originalName || "Item Image"
                      }
                      className="order-details-item-image"
                    />
                  </td>
                  <td>{item.product.name}</td>
                  <td>${item.product.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>
            <strong>Total Price:</strong> ${getOrderData.total}
          </p>
          <p>
            <strong>Order Date:</strong> {getOrderData.createdAt}
          </p>
          <p>
            <strong>Status:</strong> {getOrderData.orderStatus}
          </p>
        </div>
      </section>
    </Modal>
  );
}

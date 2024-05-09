import React from "react";
import Modal from "react-modal";

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
    width: "600px", // corrected typo
    maxWidth: "80%",
    maxHeight: "80%",
    overflow: "auto",
  },
};

export default function OrderDetails({ onClose, getOrderData }) {
  return (
    <Modal
      isOpen={getOrderData !== null}
      onRequestClose={onClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <section>
        <h2>Order Details</h2>

        <div>
          <p>
            <strong>Order Number:</strong> {getOrderData.orderNumber}
          </p>
          <p>
            <strong>User:</strong> {getOrderData.user}
          </p>
          {/* <p>
              <strong>Items:</strong>
              {getOrderData.items.map((item, index) => (
                <span key={index}>
                  {item}
                  {index !== getOrderData.items.length - 1 && ", "}
                </span>
              ))}
            </p> */}
          <p>
            <strong>Price:</strong> ${getOrderData.price}
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

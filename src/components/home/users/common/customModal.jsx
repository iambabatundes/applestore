import React from "react";
import "../../styles/customModal.css";

export default function CustomModal({ isOpen, onRequestClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onRequestClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this address?</p>
        <button className="modal-button" onClick={onConfirm}>
          Yes, Delete
        </button>
        <button className="modal-button" onClick={onRequestClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

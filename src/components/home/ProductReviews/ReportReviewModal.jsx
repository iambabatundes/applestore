import React, { useState, useEffect } from "react";
import "./styles/reportModal.css";

export default function ReportReviewModal({ isOpen, onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="drawer__overlay" onClick={onClose}>
      <div
        className="drawer__modal"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="drawer__header">
          <h3>Report Review</h3>
          <button className="drawer__close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="drawer__body">
          <textarea
            className="drawer__textarea"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please enter the reason"
          ></textarea>
        </div>
        <div className="drawer__footer">
          <button className="drawer__btn primary" onClick={handleSubmit}>
            Submit
          </button>
          <button className="drawer__btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useEffect } from "react";
import { FaTimes, FaTruck, FaUndo, FaShieldAlt } from "react-icons/fa";
import "../styles/CommitmentModal.css";

const contentMap = {
  shipping: {
    title: "Free Shipping",
    icon: <FaTruck />,
    description: (
      <>
        <p>
          We offer free shipping on most products. Your delivery will be made
          between <strong>Jun 19 - 29</strong> by various courier companies.
        </p>
        <p>Check the product page for more details.</p>
      </>
    ),
  },
  refund: {
    title: "Return & Refund Policy",
    icon: <FaUndo />,
    description: (
      <>
        <p>
          Eligible for returns and refunds within the designated protection
          period.
        </p>
        <p>Make sure to review our terms before initiating a return.</p>
      </>
    ),
  },
  security: {
    title: "Security & Privacy",
    icon: <FaShieldAlt />,
    description: (
      <>
        <p>
          We prioritize your data protection and do not share your personal
          details with third parties.
        </p>
        <p>All payments are processed through secure gateways.</p>
      </>
    ),
  },
};

export default function CommitmentModal({ type, onClose }) {
  const { title, icon, description } = contentMap[type] || {};

  const modalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Swipe detection for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const delta = touchStartX.current - touchEndX.current;
    if (delta > 100) onClose(); // Swipe left to close
  };

  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="commitment-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="commitment-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="commitment-modal-title"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="close-button"
          aria-label="Close modal"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <div className="modal-header">
          <div className="modal-icon">{icon}</div>
          <h2>{title}</h2>
        </div>
        <div className="modal-body">{description}</div>
        <button
          className="commitment__modal-button"
          aria-label="Learn more"
          onClick={onClose}
        >
          Learn more
        </button>
      </div>
    </div>
  );
}

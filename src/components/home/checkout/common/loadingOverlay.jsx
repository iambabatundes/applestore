// LoadingOverlay.js
import React from "react";

export default function LoadingOverlay({ message = "Processing..." }) {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
}

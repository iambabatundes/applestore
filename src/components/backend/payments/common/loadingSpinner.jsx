// LoadingSpinner.jsx
import React from "react";
import PropTypes from "prop-types";
import "../styles/loadingSpinner.css";

export const LoadingSpinner = ({ size = "medium", message }) => (
  <div className={`loading-spinner loading-spinner--${size}`}>
    <div className="spinner" />
    {message && <p className="loading-spinner__message">{message}</p>}
  </div>
);

export default LoadingSpinner;

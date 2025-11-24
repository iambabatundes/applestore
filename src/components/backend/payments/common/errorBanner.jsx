// ErrorBanner.jsx
import React from "react";
import PropTypes from "prop-types";
import "../styles/errorBanner.css";

export const ErrorBanner = ({ message, onDismiss, type = "error" }) => (
  <div className={`error-banner error-banner--${type}`} role="alert">
    <span className="error-banner__icon">
      {type === "error" ? "⚠️" : type === "warning" ? "⚡" : "ℹ️"}
    </span>
    <span className="error-banner__message">{message}</span>
    {onDismiss && (
      <button
        className="error-banner__close"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
    )}
  </div>
);

ErrorBanner.propTypes = {
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func,
  type: PropTypes.oneOf(["error", "warning", "info"]),
};

export default ErrorBanner;

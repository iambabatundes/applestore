// components/common/ConfirmationModal.jsx
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "../styles/confirmationModal.css";

export const ConfirmationModal = ({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handleEsc);
    confirmRef.current?.focus();
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onCancel, loading]);

  return (
    <div className="confirm-overlay" onClick={loading ? undefined : onCancel}>
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className={`confirm-modal__icon confirm-modal__icon--${variant}`}>
          {variant === "danger" ? "⚠️" : variant === "warning" ? "❓" : "ℹ️"}
        </div>

        <h3 id="confirm-title" className="confirm-modal__title">
          {title}
        </h3>

        <p id="confirm-message" className="confirm-modal__message">
          {message}
        </p>

        <div className="confirm-modal__actions">
          <button
            className="btn btn--secondary"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            className={`btn btn--${variant}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  variant: PropTypes.oneOf(["danger", "warning", "info"]),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ConfirmationModal;

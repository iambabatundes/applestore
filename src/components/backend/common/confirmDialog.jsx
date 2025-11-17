import React, { useEffect, useRef } from "react";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import "./styles/confirmDialog.css";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, danger, success, info
  confirmButtonClass = "",
  cancelButtonClass = "",
  isLoading = false,
  showCloseButton = true,
}) {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      } else if (e.key === "Enter" && !isLoading) {
        onConfirm();
      }
    };

    // Focus the confirm button when dialog opens
    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Prevent body scroll when dialog is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, onConfirm, isLoading]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current && !isLoading) {
      onClose();
    }
  };

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case "danger":
        return (
          <FaExclamationTriangle className="confirm-dialog__icon confirm-dialog__icon--danger" />
        );
      case "success":
        return (
          <FaCheckCircle className="confirm-dialog__icon confirm-dialog__icon--success" />
        );
      case "info":
        return (
          <FaInfoCircle className="confirm-dialog__icon confirm-dialog__icon--info" />
        );
      case "warning":
      default:
        return (
          <FaExclamationTriangle className="confirm-dialog__icon confirm-dialog__icon--warning" />
        );
    }
  };

  // Get default button classes based on type
  const getConfirmButtonClass = () => {
    if (confirmButtonClass) return confirmButtonClass;

    switch (type) {
      case "danger":
        return "confirm-dialog__button--danger";
      case "success":
        return "confirm-dialog__button--success";
      case "info":
        return "confirm-dialog__button--info";
      case "warning":
      default:
        return "confirm-dialog__button--warning";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="confirm-dialog__overlay"
      ref={dialogRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      <div
        className={`confirm-dialog__container confirm-dialog__container--${type}`}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            className="confirm-dialog__close"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
            type="button"
          >
            <FaTimes />
          </button>
        )}

        {/* Icon */}
        <div className="confirm-dialog__icon-wrapper">{getIcon()}</div>

        {/* Content */}
        <div className="confirm-dialog__content">
          <h2 id="confirm-dialog-title" className="confirm-dialog__title">
            {title}
          </h2>
          <p id="confirm-dialog-message" className="confirm-dialog__message">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="confirm-dialog__actions">
          <button
            ref={confirmButtonRef}
            className={`confirm-dialog__button confirm-dialog__button--primary ${getConfirmButtonClass()}`}
            onClick={onConfirm}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? (
              <>
                <span className="confirm-dialog__spinner"></span>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
          <button
            className={`confirm-dialog__button confirm-dialog__button--secondary ${cancelButtonClass}`}
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

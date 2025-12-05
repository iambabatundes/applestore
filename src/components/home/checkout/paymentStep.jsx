// PaymentStep.js
import React, { useState, useEffect } from "react";
import checkoutService from "../../../services/checkoutService";
import PaymentMethodForm from "./paymentMethodForm";
import Modal from "./common/modal";
import ThreeDSModal from "./common/ThreeDSModal";

export default function PaymentStep({
  paymentMethods,
  selectedPaymentMethod,
  onPaymentSelect,
  onAddPaymentMethod,
  onUpdatePaymentMethod,
  onDeletePaymentMethod,
  user,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [threeDSData, setThreeDSData] = useState(null);
  const [show3DSModal, setShow3DSModal] = useState(false);

  const handleAddPaymentMethod = async (paymentData) => {
    setLoading(true);
    setError("");

    try {
      // Save payment method to backend
      const result = await checkoutService.savePaymentMethod({
        ...paymentData,
        userId: user.id,
      });

      if (result.success) {
        onAddPaymentMethod(result.data);
        setShowAddModal(false);

        // Auto-select the new payment method
        onPaymentSelect(result.data);
      } else {
        setError(result.message || "Failed to add payment method");
      }
    } catch (err) {
      setError(err.message || "Failed to add payment method");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (methodId) => {
    if (
      !window.confirm("Are you sure you want to remove this payment method?")
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await checkoutService.deletePaymentMethod(methodId);

      if (result.success) {
        onDeletePaymentMethod(methodId);

        // If we deleted the selected method, clear selection
        if (selectedPaymentMethod?._id === methodId) {
          onPaymentSelect(null);
        }
      } else {
        setError(result.message || "Failed to delete payment method");
      }
    } catch (err) {
      setError(err.message || "Failed to delete payment method");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultPaymentMethod = async (methodId) => {
    try {
      const result = await checkoutService.setDefaultPaymentMethod(methodId);

      if (result.success) {
        // Update local state
        onUpdatePaymentMethod(result.data);
      }
    } catch (err) {
      console.error("Failed to set default payment method:", err);
    }
  };

  const handlePaymentAction = async (paymentMethod, requiresAction = false) => {
    if (requiresAction) {
      // Show 3DS modal for authentication
      setThreeDSData({
        paymentMethodId: paymentMethod._id,
        clientSecret: paymentMethod.metadata?.clientSecret,
      });
      setShow3DSModal(true);
    } else {
      onPaymentSelect(paymentMethod);
    }
  };

  const handle3DSComplete = async (result) => {
    setShow3DSModal(false);

    if (result.status === "succeeded") {
      setError("");
      // Payment method is now ready for use
    } else {
      setError("Payment authentication failed. Please try another method.");
    }
  };

  const handle3DSCancel = () => {
    setShow3DSModal(false);
    setError("Payment authentication was cancelled.");
  };

  return (
    <div className="payment-step">
      <div className="step-header">
        <h2 className="step-title">
          <span className="step-number">2</span>
          Payment Method
        </h2>
        <p className="step-description">
          Choose how you'd like to pay for your order
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <i className="fa fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      <div className="payment-methods-list">
        {paymentMethods.length === 0 ? (
          <div className="empty-state">
            <i className="fa fa-credit-card"></i>
            <p>No saved payment methods yet</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fa fa-plus"></i> Add Payment Method
            </button>
          </div>
        ) : (
          <>
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method._id}
                method={method}
                isSelected={selectedPaymentMethod?._id === method._id}
                onSelect={handlePaymentAction}
                onDelete={onDeletePaymentMethod}
              />
            ))}

            <button
              className="btn btn-outline add-payment-btn"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fa fa-plus"></i> Add Payment Method
            </button>
          </>
        )}
      </div>

      <div className="payment-security-info">
        <i className="fa fa-lock"></i>
        <p>Your payment information is encrypted and secure</p>
        <div className="security-badges-small">
          <span>PCI DSS Compliant</span>
          <span>•</span>
          <span>256-bit SSL</span>
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Payment Method"
        size="large"
      >
        <PaymentMethodForm
          onSubmit={handleAddPaymentMethod}
          onCancel={() => setShowAddModal(false)}
          loading={loading}
          userId={user}
        />
      </Modal>

      <ThreeDSModal
        isOpen={show3DSModal}
        onSuccess={handle3DSComplete}
        onCancel={handle3DSCancel}
        threeDSData={threeDSData}
      />
    </div>
  );
}

// Separate component for payment method card
const PaymentMethodCard = ({ method, isSelected, onSelect, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();

    if (
      !window.confirm("Are you sure you want to remove this payment method?")
    ) {
      return;
    }

    setDeleting(true);
    try {
      await onDelete(method._id);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={`payment-card ${isSelected ? "selected" : ""} ${
        !method.isValid ? "invalid" : ""
      }`}
      onClick={() => method.isValid && onSelect(method)}
    >
      <div className="payment-card-header">
        <label className="payment-radio">
          <input
            type="radio"
            name="payment"
            checked={isSelected}
            onChange={() => onSelect(method)}
            disabled={!method.isValid}
          />
          <span className="radio-checkmark"></span>
        </label>

        <i
          className={`fa ${getPaymentIcon(
            method.type,
            method.card?.brand
          )} payment-icon`}
        ></i>

        {method.isDefault && (
          <span className="badge badge-primary">Default</span>
        )}

        {!method.isValid && <span className="badge badge-danger">Expired</span>}
      </div>

      <div className="payment-content">
        <h3 className="payment-name">{method.displayName}</h3>
        {method.type === "card" && method.card && (
          <>
            <p className="payment-details">
              <span className="card-brand">{method.card.brand}</span>
              {" •••• "}
              {method.card.last4}
            </p>
            <p className="payment-expiry">
              Expires {method.card.expiryMonth}/{method.card.expiryYear}
            </p>
          </>
        )}
      </div>

      <div className="payment-actions">
        <button
          className="btn-link text-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <i className="fa fa-spinner fa-spin"></i>
          ) : (
            <i className="fa fa-trash"></i>
          )}
          {deleting ? " Removing..." : " Remove"}
        </button>
      </div>
    </div>
  );
};

// Helper function remains the same
const getPaymentIcon = (type, brand) => {
  if (type === "card") {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "fa-cc-visa";
      case "mastercard":
        return "fa-cc-mastercard";
      case "amex":
        return "fa-cc-amex";
      case "discover":
        return "fa-cc-discover";
      default:
        return "fa-credit-card";
    }
  }
  switch (type) {
    case "paypal":
      return "fa-cc-paypal";
    case "bank_account":
      return "fa-university";
    default:
      return "fa-credit-card";
  }
};

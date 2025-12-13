import React, { useState, useEffect } from "react";
import {
  createCustomer,
  getAvailableProviders,
  getUserSubscriptions,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
} from "../../../services/paymentService";

export default function PaymentSettings({ user, onBack }) {
  const [activeSection, setActiveSection] = useState("payment-methods");
  const [providers, setProviders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [newMethodData, setNewMethodData] = useState({
    type: "card",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [providersData, subscriptionsData] = await Promise.all([
        getAvailableProviders(),
        getUserSubscriptions().catch(() => ({ data: [] })),
      ]);

      setProviders(providersData || []);
      setSubscriptions(subscriptionsData?.data || subscriptionsData || []);
    } catch (err) {
      console.error("Failed to load payment settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();

    try {
      setActionLoading("add-method");

      // Create customer if needed
      await createCustomer({
        email: user.email,
        name: newMethodData.cardholderName,
        paymentMethod: {
          type: newMethodData.type,
          card: {
            number: newMethodData.cardNumber,
            exp_month: newMethodData.expiryMonth,
            exp_year: newMethodData.expiryYear,
            cvc: newMethodData.cvv,
          },
        },
      });

      alert("Payment method added successfully!");
      setShowAddMethodModal(false);
      resetNewMethodData();
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to add payment method");
    } finally {
      setActionLoading(null);
    }
  };

  const resetNewMethodData = () => {
    setNewMethodData({
      type: "card",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardholderName: "",
      billingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    });
  };

  const handleSubscriptionAction = async (subscriptionId, action) => {
    const confirmMessages = {
      cancel: "Are you sure you want to cancel this subscription?",
      pause: "Are you sure you want to pause this subscription?",
      resume: "Are you sure you want to resume this subscription?",
    };

    if (!confirm(confirmMessages[action])) return;

    try {
      setActionLoading(subscriptionId);

      switch (action) {
        case "cancel":
          await cancelSubscription(subscriptionId);
          break;
        case "pause":
          await pauseSubscription(subscriptionId);
          break;
        case "resume":
          await resumeSubscription(subscriptionId);
          break;
      }

      alert(`Subscription ${action}ed successfully!`);
      fetchData();
    } catch (err) {
      alert(err.message || `Failed to ${action} subscription`);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const getSubscriptionStatusClass = (status) => {
    const statusMap = {
      active: "status-active",
      paused: "status-paused",
      cancelled: "status-cancelled",
      expired: "status-expired",
    };
    return statusMap[status?.toLowerCase()] || "status-default";
  };

  const renderPaymentMethods = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Payment Methods</h2>
        <button className="btn-add" onClick={() => setShowAddMethodModal(true)}>
          + Add Payment Method
        </button>
      </div>

      <div className="payment-methods-list">
        {paymentMethods.length === 0 ? (
          <div className="empty-section">
            <div className="empty-icon">💳</div>
            <h3>No Payment Methods</h3>
            <p>Add a payment method to make faster checkouts</p>
            <button
              className="btn-primary"
              onClick={() => setShowAddMethodModal(true)}
            >
              Add Your First Payment Method
            </button>
          </div>
        ) : (
          paymentMethods.map((method) => (
            <div key={method.id} className="payment-method-card">
              <div className="method-icon">
                {method.type === "card" ? "💳" : "🏦"}
              </div>
              <div className="method-details">
                <h4>{method.type === "card" ? "Card" : "Bank Account"}</h4>
                <p>•••• •••• •••• {method.last4}</p>
                <p className="method-meta">
                  {method.brand && <span>{method.brand}</span>}
                  {method.expiryDate && (
                    <span>Expires {method.expiryDate}</span>
                  )}
                </p>
              </div>
              <div className="method-actions">
                {method.isDefault && (
                  <span className="badge-default">Default</span>
                )}
                <button className="btn-action-text">Edit</button>
                <button className="btn-action-text danger">Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Active Subscriptions</h2>
      </div>

      <div className="subscriptions-list">
        {subscriptions.length === 0 ? (
          <div className="empty-section">
            <div className="empty-icon">📋</div>
            <h3>No Active Subscriptions</h3>
            <p>You don't have any active subscriptions at the moment</p>
          </div>
        ) : (
          subscriptions.map((subscription) => (
            <div
              key={subscription._id || subscription.id}
              className="subscription-card"
            >
              <div className="subscription-header">
                <div>
                  <h4>{subscription.planName || "Subscription Plan"}</h4>
                  <p className="subscription-id">
                    ID: {subscription._id?.slice(-8) || subscription.id}
                  </p>
                </div>
                <span
                  className={`status-badge ${getSubscriptionStatusClass(
                    subscription.status
                  )}`}
                >
                  {subscription.status}
                </span>
              </div>

              <div className="subscription-details">
                <div className="detail-row">
                  <span className="label">Amount:</span>
                  <span className="value">
                    ${subscription.amount} / {subscription.interval}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Next Billing:</span>
                  <span className="value">
                    {formatDate(subscription.nextBillingDate)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Started:</span>
                  <span className="value">
                    {formatDate(subscription.startDate)}
                  </span>
                </div>
              </div>

              <div className="subscription-actions">
                {subscription.status === "active" && (
                  <>
                    <button
                      className="btn-action-sub"
                      onClick={() =>
                        handleSubscriptionAction(
                          subscription._id || subscription.id,
                          "pause"
                        )
                      }
                      disabled={
                        actionLoading === (subscription._id || subscription.id)
                      }
                    >
                      {actionLoading === (subscription._id || subscription.id)
                        ? "..."
                        : "Pause"}
                    </button>
                    <button
                      className="btn-action-sub danger"
                      onClick={() =>
                        handleSubscriptionAction(
                          subscription._id || subscription.id,
                          "cancel"
                        )
                      }
                      disabled={
                        actionLoading === (subscription._id || subscription.id)
                      }
                    >
                      {actionLoading === (subscription._id || subscription.id)
                        ? "..."
                        : "Cancel"}
                    </button>
                  </>
                )}
                {subscription.status === "paused" && (
                  <button
                    className="btn-action-sub"
                    onClick={() =>
                      handleSubscriptionAction(
                        subscription._id || subscription.id,
                        "resume"
                      )
                    }
                    disabled={
                      actionLoading === (subscription._id || subscription.id)
                    }
                  >
                    {actionLoading === (subscription._id || subscription.id)
                      ? "..."
                      : "Resume"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderProviders = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Available Payment Providers</h2>
      </div>

      <div className="providers-grid">
        {providers.length === 0 ? (
          <p>No payment providers available</p>
        ) : (
          providers.map((provider) => (
            <div key={provider} className="provider-card">
              <div className="provider-icon">
                {provider === "stripe" && "💳"}
                {provider === "paypal" && "🅿️"}
                {provider === "paystack" && "📱"}
                {provider === "flutterwave" && "🦋"}
              </div>
              <h4>{provider.charAt(0).toUpperCase() + provider.slice(1)}</h4>
              <span className="provider-status active">Active</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <section className="payment-settings">
      <div className="settings-header">
        <button className="btn-back" onClick={onBack}>
          ← Back to Payments
        </button>
        <h1>Payment Settings</h1>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab ${
            activeSection === "payment-methods" ? "active" : ""
          }`}
          onClick={() => setActiveSection("payment-methods")}
        >
          Payment Methods
        </button>
        <button
          className={`tab ${activeSection === "subscriptions" ? "active" : ""}`}
          onClick={() => setActiveSection("subscriptions")}
        >
          Subscriptions
        </button>
        <button
          className={`tab ${activeSection === "providers" ? "active" : ""}`}
          onClick={() => setActiveSection("providers")}
        >
          Providers
        </button>
      </div>

      <div className="settings-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading settings...</p>
          </div>
        ) : (
          <>
            {activeSection === "payment-methods" && renderPaymentMethods()}
            {activeSection === "subscriptions" && renderSubscriptions()}
            {activeSection === "providers" && renderProviders()}
          </>
        )}
      </div>

      {/* Add Payment Method Modal */}
      {showAddMethodModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddMethodModal(false)}
        >
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Add Payment Method</h2>
              <button
                className="btn-close"
                onClick={() => setShowAddMethodModal(false)}
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={handleAddPaymentMethod}
              className="modal-body"
              autoComplete="on"
            >
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  value={newMethodData.cardholderName}
                  onChange={(e) =>
                    setNewMethodData({
                      ...newMethodData,
                      cardholderName: e.target.value,
                    })
                  }
                  required
                  placeholder="Emmanuel Babatunde"
                  autoComplete="cc-name"
                />
              </div>

              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  pattern="[0-9\s]{13,19}"
                  inputMode="numeric"
                  value={newMethodData.cardNumber}
                  onChange={(e) =>
                    setNewMethodData({
                      ...newMethodData,
                      cardNumber: e.target.value,
                    })
                  }
                  required
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  autoComplete="cc-number"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Month</label>
                  <input
                    type="text"
                    value={newMethodData.expiryMonth}
                    onChange={(e) =>
                      setNewMethodData({
                        ...newMethodData,
                        expiryMonth: e.target.value,
                      })
                    }
                    required
                    placeholder="MM"
                    maxLength="2"
                    autoComplete="cc-exp-month"
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Year</label>
                  <input
                    type="text"
                    value={newMethodData.expiryYear}
                    onChange={(e) =>
                      setNewMethodData({
                        ...newMethodData,
                        expiryYear: e.target.value,
                      })
                    }
                    required
                    placeholder="YYYY"
                    maxLength="4"
                    autoComplete="cc-exp-year"
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    value={newMethodData.cvv}
                    onChange={(e) =>
                      setNewMethodData({
                        ...newMethodData,
                        cvv: e.target.value,
                      })
                    }
                    required
                    placeholder="123"
                    maxLength="4"
                    autoComplete="cc-csc"
                  />
                </div>
              </div>

              <div className="billing-address-section">
                <h3>Billing Address</h3>
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={newMethodData.billingAddress.street}
                    onChange={(e) =>
                      setNewMethodData({
                        ...newMethodData,
                        billingAddress: {
                          ...newMethodData.billingAddress,
                          street: e.target.value,
                        },
                      })
                    }
                    placeholder="123 Main St"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={newMethodData.billingAddress.city}
                      onChange={(e) =>
                        setNewMethodData({
                          ...newMethodData,
                          billingAddress: {
                            ...newMethodData.billingAddress,
                            city: e.target.value,
                          },
                        })
                      }
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={newMethodData.billingAddress.state}
                      onChange={(e) =>
                        setNewMethodData({
                          ...newMethodData,
                          billingAddress: {
                            ...newMethodData.billingAddress,
                            state: e.target.value,
                          },
                        })
                      }
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      value={newMethodData.billingAddress.zipCode}
                      onChange={(e) =>
                        setNewMethodData({
                          ...newMethodData,
                          billingAddress: {
                            ...newMethodData.billingAddress,
                            zipCode: e.target.value,
                          },
                        })
                      }
                      placeholder="12345"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={newMethodData.billingAddress.country}
                      onChange={(e) =>
                        setNewMethodData({
                          ...newMethodData,
                          billingAddress: {
                            ...newMethodData.billingAddress,
                            country: e.target.value,
                          },
                        })
                      }
                      placeholder="USA"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddMethodModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={actionLoading === "add-method"}
                >
                  {actionLoading === "add-method"
                    ? "Adding..."
                    : "Add Payment Method"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// SubscriptionPlansManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  getSubscriptionPlans,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  getPlanStatistics,
} from "../../../services/paymentService";
import LoadingSpinner from "./common/loadingSpinner";
import ErrorBanner from "./common/errorBanner";
import ConfirmationModal from "./common/confirmationModal";
import "./styles/subscriptionPlans.css";

const INTERVALS = [
  { value: "day", label: "Daily" },
  { value: "week", label: "Weekly" },
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "NGN"];

// Plan Card Component
const PlanCard = ({ plan, onEdit, onDelete, onToggle, onViewStats }) => {
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const formatPrice = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount || 0);
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const res = await getPlanStatistics(plan.planId || plan._id);
      setStats(res.data || res);
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (plan.active) loadStats();
  }, [plan.planId]);

  return (
    <div className={`plan-card ${!plan.active ? "plan-card--inactive" : ""}`}>
      {/* Card Header */}
      <div className="plan-card__header">
        <div className="plan-card__title-section">
          <h3 className="plan-card__name">{plan.name}</h3>
          {plan.popular && <span className="plan-card__badge">Popular</span>}
        </div>
        <label className="toggle-switch toggle-switch--sm">
          <input
            type="checkbox"
            checked={plan.active}
            onChange={() => onToggle(plan)}
          />
          <span className="toggle-switch__slider" />
        </label>
      </div>

      {/* Pricing */}
      <div className="plan-card__pricing">
        <span className="plan-card__price">
          {formatPrice(plan.amount, plan.currency)}
        </span>
        <span className="plan-card__interval">
          / {plan.interval || "month"}
        </span>
      </div>

      {/* Description */}
      {plan.description && (
        <p className="plan-card__description">{plan.description}</p>
      )}

      {/* Features */}
      {plan.features && plan.features.length > 0 && (
        <ul className="plan-card__features">
          {plan.features.slice(0, 5).map((feature, idx) => (
            <li key={idx} className="feature-item">
              <span className="feature-icon">✓</span>
              <span className="feature-text">{feature}</span>
            </li>
          ))}
          {plan.features.length > 5 && (
            <li className="feature-item feature-item--more">
              +{plan.features.length - 5} more features
            </li>
          )}
        </ul>
      )}

      {/* Stats */}
      {stats && (
        <div className="plan-card__stats">
          <div className="plan-stat">
            <span className="plan-stat__value">
              {stats.activeSubscribers || 0}
            </span>
            <span className="plan-stat__label">Subscribers</span>
          </div>
          <div className="plan-stat">
            <span className="plan-stat__value">
              {formatPrice(stats.monthlyRevenue || 0, plan.currency)}
            </span>
            <span className="plan-stat__label">MRR</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="plan-card__actions">
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => onEdit(plan)}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn--secondary btn--sm"
          onClick={() => onViewStats(plan)}
        >
          📊 Stats
        </button>
        <button
          className="btn btn--danger btn--sm"
          onClick={() => onDelete(plan)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

// Plan Form Modal
const PlanFormModal = ({ plan, onSave, onClose, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    currency: "USD",
    interval: "month",
    intervalCount: 1,
    trialDays: 0,
    features: [],
    metadata: {},
    active: true,
    popular: false,
    ...plan,
  });
  const [featureInput, setFeatureInput] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Valid amount required";
    if (!formData.currency) newErrors.currency = "Currency is required";
    if (!formData.interval) newErrors.interval = "Interval is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        amount: parseFloat(formData.amount),
        intervalCount: parseInt(formData.intervalCount) || 1,
        trialDays: parseInt(formData.trialDays) || 0,
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal plan-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h2 className="modal__title">
            {plan?.planId ? "Edit Plan" : "Create New Plan"}
          </h2>
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal__content">
          <div className="form-grid">
            {/* Basic Info */}
            <div className="form-group form-group--full">
              <label>Plan Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Pro Plan"
                className={`form-input ${
                  errors.name ? "form-input--error" : ""
                }`}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group form-group--full">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the plan..."
                rows={2}
                className="form-textarea"
              />
            </div>

            {/* Pricing */}
            <div className="form-group">
              <label>Amount *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={`form-input ${
                  errors.amount ? "form-input--error" : ""
                }`}
              />
              {errors.amount && (
                <span className="form-error">{errors.amount}</span>
              )}
            </div>

            <div className="form-group">
              <label>Currency *</label>
              <select
                value={formData.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="form-select"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Billing Interval *</label>
              <select
                value={formData.interval}
                onChange={(e) => handleChange("interval", e.target.value)}
                className="form-select"
              >
                {INTERVALS.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Trial Days</label>
              <input
                type="number"
                value={formData.trialDays}
                onChange={(e) => handleChange("trialDays", e.target.value)}
                placeholder="0"
                min="0"
                className="form-input"
              />
            </div>

            {/* Features */}
            <div className="form-group form-group--full">
              <label>Features</label>
              <div className="feature-input-group">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                  placeholder="Add a feature..."
                  className="form-input"
                />
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={addFeature}
                >
                  Add
                </button>
              </div>
              {formData.features.length > 0 && (
                <ul className="feature-list">
                  {formData.features.map((f, idx) => (
                    <li key={idx} className="feature-tag">
                      <span>{f}</span>
                      <button
                        type="button"
                        className="feature-remove"
                        onClick={() => removeFeature(idx)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Options */}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleChange("active", e.target.checked)}
                />
                <span>Active</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => handleChange("popular", e.target.checked)}
                />
                <span>Mark as Popular</span>
              </label>
            </div>
          </div>
        </form>

        <footer className="modal__footer">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : plan?.planId
              ? "Update Plan"
              : "Create Plan"}
          </button>
        </footer>
      </div>
    </div>
  );
};

// Main Component
const SubscriptionPlansManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Load plans
  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSubscriptionPlans();
      setPlans(res.data?.plans || res.data || res || []);
    } catch (err) {
      setError(err.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // Handle save (create/update)
  const handleSave = async (planData) => {
    try {
      setSaving(true);
      setError(null);

      if (editingPlan?.planId || editingPlan?._id) {
        await updatePlan(editingPlan.planId || editingPlan._id, planData);
        setSuccess("Plan updated successfully");
      } else {
        await createPlan(planData);
        setSuccess("Plan created successfully");
      }

      setShowForm(false);
      setEditingPlan(null);
      loadPlans();
    } catch (err) {
      setError(err.message || "Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      setSaving(true);
      await deletePlan(confirmDelete.planId || confirmDelete._id);
      setSuccess("Plan deleted successfully");
      setConfirmDelete(null);
      loadPlans();
    } catch (err) {
      setError(err.message || "Failed to delete plan");
    } finally {
      setSaving(false);
    }
  };

  // Handle toggle
  const handleToggle = async (plan) => {
    try {
      await togglePlanStatus(plan.planId || plan._id);
      setPlans((prev) =>
        prev.map((p) =>
          (p.planId || p._id) === (plan.planId || plan._id)
            ? { ...p, active: !p.active }
            : p
        )
      );
      setSuccess(`Plan ${plan.active ? "disabled" : "enabled"} successfully`);
    } catch (err) {
      setError(err.message || "Failed to toggle plan");
    }
  };

  // Handle edit
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  // Handle view stats
  const handleViewStats = (plan) => {
    // Could open a stats modal or navigate to stats page
    console.log("View stats for:", plan);
  };

  if (loading) {
    return (
      <div className="plans-mgmt plans-mgmt--loading">
        <LoadingSpinner size="large" message="Loading subscription plans..." />
      </div>
    );
  }

  return (
    <div className="plans-mgmt">
      {/* Header */}
      <header className="plans-mgmt__header">
        <div className="plans-mgmt__title-section">
          <h1 className="plans-mgmt__title">📦 Subscription Plans</h1>
          <p className="plans-mgmt__subtitle">
            Manage your subscription plans and pricing
          </p>
        </div>
        <div className="plans-mgmt__actions">
          <button className="btn btn--secondary" onClick={loadPlans}>
            ↻ Refresh
          </button>
          <button
            className="btn btn--primary"
            onClick={() => {
              setEditingPlan(null);
              setShowForm(true);
            }}
          >
            + Create Plan
          </button>
        </div>
      </header>

      {/* Notifications */}
      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}
      {success && (
        <div className="success-banner">
          ✓ {success}
          <button onClick={() => setSuccess(null)} className="banner__close">
            ×
          </button>
        </div>
      )}

      {/* Plans Grid */}
      <div className="plans-mgmt__content">
        {plans.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">📦</span>
            <h3>No subscription plans</h3>
            <p>Create your first plan to start accepting subscriptions</p>
            <button
              className="btn btn--primary"
              onClick={() => setShowForm(true)}
            >
              + Create Plan
            </button>
          </div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => (
              <PlanCard
                key={plan.planId || plan._id}
                plan={plan}
                onEdit={handleEdit}
                onDelete={setConfirmDelete}
                onToggle={handleToggle}
                onViewStats={handleViewStats}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <PlanFormModal
          plan={editingPlan}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditingPlan(null);
          }}
          loading={saving}
        />
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <ConfirmationModal
          title="Delete Plan"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={saving}
        />
      )}
    </div>
  );
};

export default SubscriptionPlansManagement;

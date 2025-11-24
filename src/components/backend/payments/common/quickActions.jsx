// components/admin/payments/common/QuickActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/quickActions.css";

const QUICK_ACTIONS = [
  {
    id: "view-all",
    label: "View All Payments",
    description: "See complete transaction history",
    icon: "💳",
    path: "/admin/payments/all",
    color: "#4f46e5",
  },
  {
    id: "export",
    label: "Export Data",
    description: "Download transactions as CSV",
    icon: "📥",
    path: "/admin/payments/reports",
    color: "#059669",
  },
  {
    id: "subscriptions",
    label: "Subscriptions",
    description: "Manage active subscriptions",
    icon: "🔄",
    path: "/admin/payments/subscriptions",
    color: "#7c3aed",
  },
  {
    id: "configuration",
    label: "Configure Gateways",
    description: "Payment provider settings",
    icon: "⚙️",
    path: "/admin/payments/configuration",
    color: "#6b7280",
  },
  {
    id: "fraud",
    label: "Fraud Detection",
    description: "Review flagged transactions",
    icon: "🛡️",
    path: "/admin/payments/fraud",
    color: "#dc2626",
  },
  {
    id: "webhooks",
    label: "Webhook Logs",
    description: "Monitor webhook events",
    icon: "🔗",
    path: "/admin/payments/webhooks",
    color: "#2563eb",
  },
  {
    id: "reports",
    label: "Generate Report",
    description: "Create custom reports",
    icon: "📊",
    path: "/admin/payments/reports",
    color: "#d97706",
  },
  {
    id: "plans",
    label: "Subscription Plans",
    description: "Manage pricing plans",
    icon: "📦",
    path: "/admin/payments/plans",
    color: "#0891b2",
  },
];

const QuickActionCard = ({ action, onClick }) => {
  return (
    <button
      className="quick-action-card"
      onClick={() => onClick(action)}
      style={{ "--action-color": action.color }}
    >
      <div className="quick-action-card__icon-wrapper">
        <span className="quick-action-card__icon">{action.icon}</span>
      </div>
      <div className="quick-action-card__content">
        <h3 className="quick-action-card__label">{action.label}</h3>
        <p className="quick-action-card__description">{action.description}</p>
      </div>
      <span className="quick-action-card__arrow">→</span>
    </button>
  );
};

const QuickActions = () => {
  const navigate = useNavigate();

  const handleAction = (action) => {
    if (action.path) {
      navigate(action.path);
    }
  };

  return (
    <div className="quick-actions">
      <div className="quick-actions__header">
        <h3 className="quick-actions__title">Quick Actions</h3>
        <p className="quick-actions__subtitle">Common tasks and shortcuts</p>
      </div>

      <div className="quick-actions__grid">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionCard
            key={action.id}
            action={action}
            onClick={handleAction}
          />
        ))}
      </div>

      <div className="quick-actions__footer">
        <a
          href="https://docs.example.com/payments"
          target="_blank"
          rel="noopener noreferrer"
          className="help-link"
        >
          <span className="help-link__icon">📖</span>
          <span className="help-link__text">View Payment Documentation</span>
          <span className="help-link__arrow">↗</span>
        </a>
      </div>
    </div>
  );
};

export default QuickActions;

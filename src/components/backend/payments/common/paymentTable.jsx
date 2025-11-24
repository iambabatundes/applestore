// components/admin/payments/common/PaymentTable.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../../../../services/paymentService";
import "../styles/paymentTable.css";

const STATUS_CONFIG = {
  succeeded: { label: "Succeeded", className: "success" },
  pending: { label: "Pending", className: "warning" },
  processing: { label: "Processing", className: "info" },
  failed: { label: "Failed", className: "danger" },
  canceled: { label: "Canceled", className: "muted" },
  refunded: { label: "Refunded", className: "refund" },
  requires_action: { label: "Action Required", className: "warning" },
  requires_capture: { label: "Needs Capture", className: "info" },
};

const PaymentTable = ({ payments, onRowClick, onAction }) => {
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Sort payments
  const sortedPayments = [...payments].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "createdAt") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  // Handle selection
  const toggleSelectAll = () => {
    if (selectedIds.size === payments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(payments.map((p) => p.transactionId || p._id)));
    }
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get sortable header
  const SortHeader = ({ field, children }) => (
    <th
      className={`sortable ${sortField === field ? "sorted" : ""}`}
      onClick={() => handleSort(field)}
      role="columnheader"
      aria-sort={sortField === field ? sortDirection : "none"}
    >
      <span className="sort-content">
        {children}
        <span className="sort-icon">
          {sortField === field ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </span>
    </th>
  );

  // Get action menu
  const ActionMenu = ({ payment }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { status, transactionId, amount } = payment;

    const actions = [];
    if (status === "succeeded") {
      actions.push({ key: "refund", label: "Refund", icon: "↩" });
    }
    if (status === "requires_capture") {
      actions.push({ key: "capture", label: "Capture", icon: "✓" });
    }
    if (["pending", "processing"].includes(status)) {
      actions.push({ key: "cancel", label: "Cancel", icon: "✕" });
    }
    actions.push({ key: "view", label: "View Details", icon: "👁" });

    if (actions.length === 0) return null;

    return (
      <div className="action-menu">
        <button
          className="action-menu__trigger"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          aria-expanded={isOpen}
          aria-label="Actions"
        >
          ⋮
        </button>
        {isOpen && (
          <>
            <div
              className="action-menu__backdrop"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />
            <div className="action-menu__dropdown">
              {actions.map((action) => (
                <button
                  key={action.key}
                  className={`action-menu__item action-menu__item--${action.key}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    if (action.key === "view") {
                      onRowClick(payment);
                    } else {
                      onAction(action.key, transactionId, { amount });
                    }
                  }}
                >
                  <span className="action-icon">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="payment-table-wrapper">
      {selectedIds.size > 0 && (
        <div className="bulk-actions">
          <span className="bulk-actions__count">
            {selectedIds.size} selected
          </span>
          <button
            className="bulk-actions__btn"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear Selection
          </button>
        </div>
      )}

      <table className="payment-table" role="grid">
        <thead>
          <tr>
            <th className="checkbox-cell">
              <input
                type="checkbox"
                checked={
                  selectedIds.size === payments.length && payments.length > 0
                }
                onChange={toggleSelectAll}
                aria-label="Select all payments"
              />
            </th>
            <SortHeader field="paymentId">Transaction</SortHeader>
            <th>Customer</th>
            <SortHeader field="amount">Amount</SortHeader>
            <th>Provider</th>
            <SortHeader field="status">Status</SortHeader>
            <SortHeader field="createdAt">Date</SortHeader>
            <th className="actions-cell" aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {sortedPayments.map((payment) => {
            const id = payment.transactionId || payment._id;
            const statusConfig = STATUS_CONFIG[payment.status] || {
              label: payment.status,
              className: "default",
            };

            return (
              <tr
                key={id}
                className={`payment-row ${
                  selectedIds.has(id) ? "selected" : ""
                }`}
                onClick={() => onRowClick(payment)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onRowClick(payment)}
              >
                <td
                  className="checkbox-cell"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(id)}
                    onChange={(e) => toggleSelect(id, e)}
                    aria-label={`Select payment ${payment.paymentId}`}
                  />
                </td>
                <td className="transaction-cell">
                  <span className="transaction-id">
                    {payment.paymentId?.slice(-12) || id?.slice(-12) || "N/A"}
                  </span>
                  {payment.metadata?.fraudScore > 0.5 && (
                    <span className="fraud-flag" title="High fraud risk">
                      ⚠️
                    </span>
                  )}
                </td>
                <td className="customer-cell">
                  <span className="customer-email">
                    {payment.email || "N/A"}
                  </span>
                </td>
                <td className="amount-cell">
                  <span className="amount">
                    {formatCurrency(payment.amount, payment.currency)}
                  </span>
                </td>
                <td className="provider-cell">
                  <span className="provider-name">
                    {payment.provider || "N/A"}
                  </span>
                </td>
                <td className="status-cell">
                  <span
                    className={`status-badge status-badge--${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </span>
                </td>
                <td className="date-cell">
                  <span className="date">{formatDate(payment.createdAt)}</span>
                </td>
                <td className="actions-cell">
                  <ActionMenu payment={payment} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

PaymentTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      transactionId: PropTypes.string,
      paymentId: PropTypes.string,
      email: PropTypes.string,
      amount: PropTypes.number,
      currency: PropTypes.string,
      status: PropTypes.string,
      provider: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ).isRequired,
  onRowClick: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default PaymentTable;

// allPayments.jsx
import React, { useState, useEffect, useCallback, useReducer } from "react";
import {
  adminGetTransactions,
  adminRefundPayment,
  adminCapturePayment,
  adminCancelPayment,
  exportTransactionsCSV,
  downloadFile,
} from "../../../services/paymentService";
import PaymentFilters from "./common/paymentFilters";
import PaymentTable from "./common/paymentTable";
import PaymentDetailsModal from "./common/paymentDetailsModal";
import ConfirmationModal from "./common/confirmationModal";
import LoadingSpinner from "./common/loadingSpinner";
import ErrorBanner from "./common/errorBanner";
import Pagination from "./common/pagination";
import "./styles/allPayments.css";

// Filter state reducer
const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.field]: action.value };
    case "SET_FILTERS":
      return { ...state, ...action.filters };
    case "CLEAR":
      return {
        status: "",
        provider: "",
        search: "",
        dateFrom: "",
        dateTo: "",
        minAmount: "",
        maxAmount: "",
        currency: "",
      };
    default:
      return state;
  }
};

const AllPayments = () => {
  // Data state
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });

  // Filter state
  const [filters, dispatchFilters] = useReducer(filterReducer, {
    status: "",
    provider: "",
    search: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    currency: "",
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal state
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load payments
  const loadPayments = useCallback(
    async (page = 1, showLoading = true) => {
      try {
        if (showLoading) setLoading(true);
        setError(null);

        // Clean empty filter values
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        );

        const response = await adminGetTransactions({
          ...cleanFilters,
          page,
          limit: pagination.limit,
        });

        const data = response.data || response;
        setPayments(data.transactions || data || []);
        setPagination((prev) => ({
          ...prev,
          page,
          total: data.pagination?.total || 0,
          pages:
            data.pagination?.pages ||
            Math.ceil((data.pagination?.total || 0) / prev.limit),
        }));
      } catch (err) {
        console.error("Failed to load payments:", err);
        setError(err.message || "Failed to load payments");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  // Initial load
  useEffect(() => {
    loadPayments(1);
  }, []); // eslint-disable-line

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        loadPayments(1, false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]); // eslint-disable-line

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    dispatchFilters({ type: "SET_FILTER", field, value });
  };

  const handleApplyFilters = () => {
    loadPayments(1);
  };

  const handleClearFilters = () => {
    dispatchFilters({ type: "CLEAR" });
    setTimeout(() => loadPayments(1), 0);
  };

  // Handle payment actions
  const handlePaymentAction = async (action, paymentId, data = {}) => {
    // For destructive actions, show confirmation
    if (["refund", "cancel"].includes(action)) {
      setConfirmAction({ action, paymentId, data });
      return;
    }

    await executeAction(action, paymentId, data);
  };

  const executeAction = async (action, paymentId, data) => {
    try {
      setActionLoading(true);
      setError(null);

      switch (action) {
        case "refund":
          await adminRefundPayment(paymentId, {
            amount: data.amount,
            reason: data.reason,
          });
          setSuccess("Payment refunded successfully");
          break;
        case "capture":
          await adminCapturePayment(paymentId, data.amount);
          setSuccess("Payment captured successfully");
          break;
        case "cancel":
          await adminCancelPayment(paymentId, data.reason);
          setSuccess("Payment canceled successfully");
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      // Refresh data
      loadPayments(pagination.page, false);

      // Close modals
      setShowDetailsModal(false);
      setConfirmAction(null);
    } catch (err) {
      setError(`Failed to ${action} payment: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      setExporting(true);
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );

      const blob = await exportTransactionsCSV(cleanFilters);
      downloadFile(blob, `payments_export_${Date.now()}.csv`);
      setSuccess("Export downloaded successfully");
    } catch (err) {
      setError(`Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  // Handle row click
  const handleRowClick = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="all-payments">
      {/* Header */}
      <header className="all-payments__header">
        <div className="all-payments__title-section">
          <h1 className="all-payments__title">All Payments</h1>
          <p className="all-payments__subtitle">
            {pagination.total.toLocaleString()} total transactions
          </p>
        </div>

        <div className="all-payments__actions">
          <button
            className="btn btn--secondary"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
          >
            Clear Filters
          </button>
          <button
            className="btn btn--primary"
            onClick={handleExport}
            disabled={exporting || !payments.length}
          >
            {exporting ? "Exporting..." : "📥 Export CSV"}
          </button>
        </div>
      </header>

      {/* Notifications */}
      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}
      {success && (
        <div className="success-banner">
          {success}
          <button onClick={() => setSuccess(null)} className="banner__close">
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <PaymentFilters
        filters={filters}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Table */}
      <div className="all-payments__content">
        {loading ? (
          <div className="all-payments__loading">
            <LoadingSpinner message="Loading payments..." />
          </div>
        ) : payments.length === 0 ? (
          <div className="all-payments__empty">
            <span className="empty-icon">📭</span>
            <h3>No payments found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <>
            <PaymentTable
              payments={payments}
              onRowClick={handleRowClick}
              onAction={handlePaymentAction}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={(page) => loadPayments(page)}
              onLimitChange={(limit) => {
                setPagination((prev) => ({ ...prev, limit }));
                loadPayments(1);
              }}
            />
          </>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPayment(null);
          }}
          onAction={handlePaymentAction}
          loading={actionLoading}
        />
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <ConfirmationModal
          title={`Confirm ${confirmAction.action}`}
          message={`Are you sure you want to ${confirmAction.action} this payment?`}
          confirmLabel={confirmAction.action}
          variant={confirmAction.action === "refund" ? "warning" : "danger"}
          onConfirm={() =>
            executeAction(
              confirmAction.action,
              confirmAction.paymentId,
              confirmAction.data
            )
          }
          onCancel={() => setConfirmAction(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default AllPayments;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/orderHeader.css";
import { getExportURL } from "../../../services/orderService";
import { toast } from "react-toastify";

export default function OrderHeader({ showStats = true, stats = null }) {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

  const validateExportFilters = () => {
    if (exportFilters.startDate && exportFilters.endDate) {
      const start = new Date(exportFilters.startDate);
      const end = new Date(exportFilters.endDate);

      if (start > end) {
        toast.error("Start date cannot be after end date");
        return false;
      }
    }
    return true;
  };

  /**
   * Initiates export download using service-generated URL
   */
  const initiateExport = (filters = {}) => {
    try {
      const exportURL = getExportURL(filters);

      // Create a hidden link and trigger download
      const link = document.createElement("a");
      link.href = exportURL;
      link.download = `orders-export-${Date.now()}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      return true;
    } catch (error) {
      console.error("Export initiation failed:", error);
      return false;
    }
  };

  /**
   * Handle quick export (all orders)
   */
  const handleQuickExport = async () => {
    setIsExporting(true);

    try {
      const success = initiateExport();

      if (success) {
        toast.success("Export started - your download will begin shortly");
      } else {
        toast.error("Failed to initiate export");
      }
    } catch (error) {
      console.error("Quick export failed:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Handle custom export with filters
   */
  const handleCustomExport = async () => {
    if (!validateExportFilters()) {
      return;
    }

    setIsExporting(true);

    try {
      // Build clean filter object (remove empty values)
      const filters = Object.entries(exportFilters).reduce(
        (acc, [key, value]) => {
          if (value) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      const success = initiateExport(filters);

      if (success) {
        toast.success("Custom export started successfully");
        setShowExportModal(false);
        resetExportFilters();
      } else {
        toast.error("Failed to initiate custom export");
      }
    } catch (error) {
      console.error("Custom export failed:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Reset export filters to initial state
   */
  const resetExportFilters = () => {
    setExportFilters({
      startDate: "",
      endDate: "",
      status: "",
    });
  };

  /**
   * Handle modal close with cleanup
   */
  const handleCloseModal = () => {
    setShowExportModal(false);
    resetExportFilters();
  };

  return (
    <>
      <header className="order-header">
        <div className="order-header-left">
          <h1 className="order-header-title">Orders Management</h1>
          <p className="order-header-subtitle">
            Manage and track all customer orders
          </p>
        </div>

        {showStats && stats && (
          <div className="order-header-stats">
            <div className="stat-card">
              <div className="stat-icon pending">
                <i className="fa fa-clock"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.pending || 0}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon processing">
                <i className="fa fa-cog"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.processing || 0}</span>
                <span className="stat-label">Processing</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon shipped">
                <i className="fa fa-truck"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.shipped || 0}</span>
                <span className="stat-label">Shipped</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon delivered">
                <i className="fa fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <span className="stat-value">{stats.delivered || 0}</span>
                <span className="stat-label">Delivered</span>
              </div>
            </div>
          </div>
        )}

        <div className="order-header-actions">
          <button
            className="order-action-btn btn-export"
            onClick={handleQuickExport}
            disabled={isExporting}
            title="Export all orders to CSV"
          >
            {isExporting && !showExportModal ? (
              <>
                <i className="fa fa-spinner fa-spin"></i>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <i className="fa fa-download"></i>
                <span>Export</span>
              </>
            )}
          </button>

          <button
            className="order-action-btn btn-export-custom"
            onClick={() => setShowExportModal(true)}
            disabled={isExporting}
            title="Custom export with filters"
          >
            <i className="fa fa-filter"></i>
            <span>Custom Export</span>
          </button>

          <Link
            to="/admin/orders/analytics"
            className="order-action-btn btn-analytics"
          >
            <i className="fa fa-chart-line"></i>
            <span>Analytics</span>
          </Link>

          <Link
            to="/admin/orders/settings"
            className="order-action-btn btn-settings"
          >
            <i className="fa fa-cog"></i>
            <span>Settings</span>
          </Link>
        </div>
      </header>

      {/* Custom Export Modal */}
      {showExportModal && (
        <div
          className="export-modal-overlay"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-modal-title"
        >
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <div className="export-modal-header">
              <h3 id="export-modal-title">Custom Export</h3>
              <button
                className="close-modal-btn"
                onClick={handleCloseModal}
                aria-label="Close modal"
                disabled={isExporting}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <div className="export-modal-body">
              <div className="export-form-group">
                <label htmlFor="start-date">Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  value={exportFilters.startDate}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      startDate: e.target.value,
                    })
                  }
                  className="export-input"
                  disabled={isExporting}
                />
              </div>

              <div className="export-form-group">
                <label htmlFor="end-date">End Date</label>
                <input
                  id="end-date"
                  type="date"
                  value={exportFilters.endDate}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      endDate: e.target.value,
                    })
                  }
                  className="export-input"
                  disabled={isExporting}
                  min={exportFilters.startDate || undefined}
                />
              </div>

              <div className="export-form-group">
                <label htmlFor="order-status">Order Status</label>
                <select
                  id="order-status"
                  value={exportFilters.status}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      status: e.target.value,
                    })
                  }
                  className="export-select"
                  disabled={isExporting}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                  <option value="partially_refunded">Partially Refunded</option>
                </select>
              </div>

              <div className="export-info">
                <i className="fa fa-info-circle"></i>
                <span>
                  Export will include all orders matching your selected
                  criteria. Leave fields empty to export all orders.
                </span>
              </div>
            </div>

            <div className="export-modal-footer">
              <button
                className="btn-cancel"
                onClick={handleCloseModal}
                disabled={isExporting}
              >
                Cancel
              </button>
              <button
                className="btn-export-confirm"
                onClick={handleCustomExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    Exporting...
                  </>
                ) : (
                  <>
                    <i className="fa fa-download"></i>
                    Export CSV
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

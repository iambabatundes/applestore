import React from "react";

export default function ExportModal({
  show,
  onClose,
  exportFilters,
  setExportFilters,
  onExport,
  isExporting,
}) {
  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h3>Custom Export</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="export-modal-body">
          <div className="export-form-group">
            <label>Start Date</label>
            <input
              type="date"
              value={exportFilters.startDate}
              onChange={(e) =>
                setExportFilters({
                  ...exportFilters,
                  startDate: e.target.value,
                })
              }
              className="export-input"
            />
          </div>

          <div className="export-form-group">
            <label>End Date</label>
            <input
              type="date"
              value={exportFilters.endDate}
              onChange={(e) =>
                setExportFilters({ ...exportFilters, endDate: e.target.value })
              }
              className="export-input"
            />
          </div>

          <div className="export-form-group">
            <label>Order Status</label>
            <select
              value={exportFilters.status}
              onChange={(e) =>
                setExportFilters({ ...exportFilters, status: e.target.value })
              }
              className="export-select"
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
              Export will include all orders matching your selected criteria.
              Leave fields empty to export all orders.
            </span>
          </div>
        </div>

        <div className="export-modal-footer">
          <button
            className="btn-cancel"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            className="btn-export-confirm"
            onClick={onExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> Exporting...
              </>
            ) : (
              <>
                <i className="fa fa-download"></i> Export CSV
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

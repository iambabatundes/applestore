// components/admin/tax/common/BulkOperations.jsx
import React, { useState } from "react";
import { FaTrash, FaEyeSlash, FaDownload, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/bulkOperations.css";

export function BulkOperations({
  selectedCount,
  onDeactivate,
  onDelete,
  onExport,
  onClearSelection,
  availableActions = ["deactivate", "delete", "export"], // Default available actions
}) {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeactivate = async () => {
    if (!deactivateReason.trim()) {
      toast.error("Please provide a reason for deactivation");
      return;
    }

    setIsProcessing(true);
    try {
      await onDeactivate?.(deactivateReason);
      setShowDeactivateModal(false);
      setDeactivateReason("");
      toast.success(`${selectedCount} tax rate(s) deactivated successfully`);
    } catch (error) {
      toast.error("Failed to deactivate tax rates");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await onDelete?.();
      setShowDeleteModal(false);
      toast.success(`${selectedCount} tax rate(s) deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete tax rates");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    onExport?.();
    toast.info(`Preparing export for ${selectedCount} tax rate(s)`);
  };

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="bulkOperations">
        <div className="bulkOperations__header">
          <div className="bulkOperations__info">
            <span className="bulkOperations__count">
              {selectedCount} tax rate(s) selected
            </span>
          </div>

          <div className="bulkOperations__actions">
            {availableActions.includes("deactivate") && (
              <button
                className="bulkOperations__btn bulkOperations__btn--deactivate"
                onClick={() => setShowDeactivateModal(true)}
                disabled={isProcessing}
                title="Deactivate selected tax rates"
              >
                <FaEyeSlash />
                Deactivate
              </button>
            )}

            {availableActions.includes("export") && (
              <button
                className="bulkOperations__btn bulkOperations__btn--export"
                onClick={handleExport}
                disabled={isProcessing}
                title="Export selected tax rates"
              >
                <FaDownload />
                Export
              </button>
            )}

            {availableActions.includes("delete") && (
              <button
                className="bulkOperations__btn bulkOperations__btn--delete"
                onClick={() => setShowDeleteModal(true)}
                disabled={isProcessing}
                title="Delete selected tax rates"
              >
                <FaTrash />
                Delete
              </button>
            )}

            <button
              className="bulkOperations__btn bulkOperations__btn--clear"
              onClick={onClearSelection}
              disabled={isProcessing}
              title="Clear selection"
            >
              <FaTimes />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="bulkOperations__modal-overlay">
          <div className="bulkOperations__modal">
            <div className="bulkOperations__modal-header">
              <h3>Deactivate Tax Rates</h3>
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="bulkOperations__modal-close"
                disabled={isProcessing}
              >
                <FaTimes />
              </button>
            </div>

            <div className="bulkOperations__modal-content">
              <p>
                You are about to deactivate{" "}
                <strong>{selectedCount} tax rate(s)</strong>. This will make
                them unavailable for new transactions.
              </p>

              <div className="bulkOperations__reason-input">
                <label
                  htmlFor="deactivate-reason"
                  className="bulkOperations__reason-label"
                >
                  Reason for deactivation *
                </label>
                <textarea
                  id="deactivate-reason"
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  placeholder="Please provide a reason for deactivating these tax rates..."
                  className="bulkOperations__reason-textarea"
                  rows="3"
                />
              </div>
            </div>

            <div className="bulkOperations__modal-actions">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="bulkOperations__modal-btn bulkOperations__modal-btn--cancel"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className="bulkOperations__modal-btn bulkOperations__modal-btn--confirm"
                disabled={isProcessing || !deactivateReason.trim()}
              >
                {isProcessing
                  ? "Deactivating..."
                  : `Deactivate ${selectedCount} Rate(s)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="bulkOperations__modal-overlay">
          <div className="bulkOperations__modal">
            <div className="bulkOperations__modal-header">
              <h3>Delete Tax Rates</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bulkOperations__modal-close"
                disabled={isProcessing}
              >
                <FaTimes />
              </button>
            </div>

            <div className="bulkOperations__modal-content">
              <div className="bulkOperations__warning">
                <div className="bulkOperations__warning-icon">⚠️</div>
                <div className="bulkOperations__warning-content">
                  <h4>This action cannot be undone</h4>
                  <p>
                    You are about to permanently delete{" "}
                    <strong>{selectedCount} tax rate(s)</strong>. This will
                    remove them from the system completely.
                  </p>
                  <ul className="bulkOperations__warning-list">
                    <li>Tax rates cannot be recovered once deleted</li>
                    <li>
                      Historical transactions using these rates will retain
                      their tax information
                    </li>
                    <li>This may affect reporting and analytics</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bulkOperations__modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bulkOperations__modal-btn bulkOperations__modal-btn--cancel"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bulkOperations__modal-btn bulkOperations__modal-btn--delete"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Deleting..."
                  : `Permanently Delete ${selectedCount} Rate(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

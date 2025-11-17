import { useState, useCallback } from "react";

export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "warning",
    onConfirm: null,
    isLoading: false,
  });

  const openDialog = useCallback((options = {}) => {
    setDialogState({
      isOpen: true,
      title: options.title || "Confirm Action",
      message: options.message || "Are you sure you want to proceed?",
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
      type: options.type || "warning",
      onConfirm: options.onConfirm || null,
      isLoading: false,
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState((prev) => ({
      ...prev,
      isOpen: false,
      isLoading: false,
    }));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!dialogState.onConfirm) {
      closeDialog();
      return;
    }

    try {
      // Set loading state
      setDialogState((prev) => ({ ...prev, isLoading: true }));

      // Execute the confirmation callback
      await dialogState.onConfirm();

      // Close dialog after successful confirmation
      closeDialog();
    } catch (error) {
      console.error("Confirmation action failed:", error);
      // Keep dialog open on error so user can retry or cancel
      setDialogState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [dialogState.onConfirm, closeDialog]);

  const presets = {
    deleteConfirmation: (itemName, onConfirm) => ({
      title: "Delete Confirmation",
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm,
    }),

    deactivateConfirmation: (itemName, onConfirm) => ({
      title: "Deactivate Confirmation",
      message: `Are you sure you want to deactivate "${itemName}"? You can reactivate it later.`,
      confirmText: "Deactivate",
      cancelText: "Cancel",
      type: "warning",
      onConfirm,
    }),

    activateConfirmation: (itemName, onConfirm) => ({
      title: "Activate Confirmation",
      message: `Are you sure you want to activate "${itemName}"?`,
      confirmText: "Activate",
      cancelText: "Cancel",
      type: "success",
      onConfirm,
    }),

    saveConfirmation: (onConfirm) => ({
      title: "Save Changes",
      message: "Are you sure you want to save these changes?",
      confirmText: "Save",
      cancelText: "Cancel",
      type: "info",
      onConfirm,
    }),

    discardConfirmation: (onConfirm) => ({
      title: "Discard Changes",
      message:
        "You have unsaved changes. Are you sure you want to discard them?",
      confirmText: "Discard",
      cancelText: "Keep Editing",
      type: "warning",
      onConfirm,
    }),
  };

  return {
    dialogState,
    openDialog,
    closeDialog,
    handleConfirm,
    presets,
  };
}

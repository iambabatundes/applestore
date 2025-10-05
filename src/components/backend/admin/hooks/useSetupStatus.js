import { useState, useEffect } from "react";
import { AdminService } from "../../../../services/adminService";

export const useSetupStatus = () => {
  const [setupStatus, setSetupStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkSetupStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await AdminService.getSetupStatus();
      const statusData = response.data || response;

      // CONSISTENT processing with backend - single source of truth
      const processedStatus = {
        // Primary flags from backend (consistent naming)
        needsSetup: statusData.needsSetup === true,
        setupCompleted: statusData.setupCompleted === true,
        setupLocked: statusData.setupLocked === true,

        // Counts
        adminCount: statusData.adminCount || 0,
        superAdminCount: statusData.superAdminCount || 0,

        // Status indicators
        setupStatus: statusData.setupStatus || "unknown",
        systemInitialized: statusData.systemInitialized === true,

        // Legacy compatibility
        hasInitialAdmin: statusData.hasInitialAdmin === true,
        hasAdmins: statusData.hasAdmins === true,
        hasSuperAdmin: statusData.hasSuperAdmin === true,

        // Additional fields
        setupStep: statusData.setupStep || "initial",
        requiresSetup: statusData.requiresSetup === true,
        lastSetupAt: statusData.lastSetupAt || null,
        setupCompletedAt: statusData.setupCompletedAt || null,
      };

      setSetupStatus(processedStatus);
      return processedStatus;
    } catch (err) {
      // Enhanced error handling with safe defaults
      if (err.response?.status === 404) {
        const fallbackStatus = {
          needsSetup: true,
          setupCompleted: false,
          setupLocked: false,
          adminCount: 0,
          superAdminCount: 0,
          setupStatus: "required",
          systemInitialized: false,
          hasInitialAdmin: false,
          hasAdmins: false,
          hasSuperAdmin: false,
          setupStep: "initial",
          requiresSetup: true,
        };
        setSetupStatus(fallbackStatus);
        return fallbackStatus;
      }

      if (err.response?.status === 503) {
        const fallbackStatus = {
          needsSetup: true,
          setupCompleted: false,
          setupLocked: false,
          adminCount: 0,
          superAdminCount: 0,
          setupStatus: "required",
          systemInitialized: false,
          hasInitialAdmin: false,
          hasAdmins: false,
          hasSuperAdmin: false,
          setupStep: "initial",
          requiresSetup: true,
        };
        setSetupStatus(fallbackStatus);
        return fallbackStatus;
      }

      // For critical errors, don't make assumptions
      const errorMessage = err.message || "Failed to check setup status";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const refreshStatus = async () => {
    return checkSetupStatus();
  };

  // CONSISTENT derived values based on processed status
  const needsSetup = setupStatus?.needsSetup ?? true; // Safe default
  const isSetupComplete = setupStatus?.setupCompleted ?? false; // Safe default

  // console.log("[useSetupStatus] Derived values:", {
  //   needsSetup,
  //   isSetupComplete,
  //   rawSetupStatus: setupStatus,
  // });

  return {
    setupStatus,
    isLoading,
    error,
    refreshStatus,

    // Primary flags - CONSISTENT with backend
    needsSetup,
    isSetupComplete,

    // Additional computed properties
    adminCount: setupStatus?.adminCount ?? 0,
    superAdminCount: setupStatus?.superAdminCount ?? 0,
    setupStep: setupStatus?.setupStep ?? "initial",
    systemInitialized: setupStatus?.systemInitialized ?? false,
    hasInitialAdmin: setupStatus?.hasInitialAdmin ?? false,
    setupLocked: setupStatus?.setupLocked ?? false,
  };
};

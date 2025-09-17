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

      console.log("[useSetupStatus] Checking setup status...");

      const response = await AdminService.getSetupStatus();
      const statusData = response.data || response;

      console.log("[useSetupStatus] Raw response:", statusData);

      // Enhanced status processing with better defaults
      const processedStatus = {
        needsSetup: statusData.needsSetup !== false, // Default to true if undefined
        setupCompleted: statusData.setupCompleted === true, // Default to false
        adminCount: statusData.adminCount || 0,
        setupStep: statusData.setupStep || "initial",
        systemInitialized: statusData.systemInitialized === true,
        hasInitialAdmin: statusData.hasInitialAdmin === true,
        requiresSetup: statusData.requiresSetup !== false, // Alternative field name
      };

      // Logic: If adminCount is 0, definitely need setup
      if (processedStatus.adminCount === 0) {
        processedStatus.needsSetup = true;
        processedStatus.setupCompleted = false;
      }

      // Logic: If setup is not completed, need setup
      if (!processedStatus.setupCompleted) {
        processedStatus.needsSetup = true;
      }

      // Logic: If no initial admin, need setup
      if (!processedStatus.hasInitialAdmin) {
        processedStatus.needsSetup = true;
      }

      console.log("[useSetupStatus] Processed status:", processedStatus);

      setSetupStatus(processedStatus);
      return processedStatus;
    } catch (err) {
      console.error("[useSetupStatus] Setup status check failed:", err);

      // Enhanced error handling based on error type
      if (err.response?.status === 404) {
        console.log(
          "[useSetupStatus] Setup endpoint not found - assuming setup needed"
        );
        const fallbackStatus = {
          needsSetup: true,
          setupCompleted: false,
          adminCount: 0,
          setupStep: "initial",
          systemInitialized: false,
          hasInitialAdmin: false,
          requiresSetup: true,
        };
        setSetupStatus(fallbackStatus);
        return fallbackStatus;
      }

      if (err.response?.status === 503) {
        console.log(
          "[useSetupStatus] Service unavailable - assuming setup needed"
        );
        const fallbackStatus = {
          needsSetup: true,
          setupCompleted: false,
          adminCount: 0,
          setupStep: "initial",
          systemInitialized: false,
          hasInitialAdmin: false,
          requiresSetup: true,
        };
        setSetupStatus(fallbackStatus);
        return fallbackStatus;
      }

      // For other errors, don't assume - let the error bubble up
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

  const refreshStatus = () => {
    console.log("[useSetupStatus] Refreshing setup status...");
    return checkSetupStatus();
  };

  // More robust derived values with logging
  const needsSetup = (() => {
    const needs = setupStatus?.needsSetup ?? true; // Default to true if unknown
    console.log(
      "[useSetupStatus] needsSetup:",
      needs,
      "from setupStatus:",
      setupStatus
    );
    return needs;
  })();

  const isSetupComplete = (() => {
    const complete = setupStatus?.setupCompleted ?? false; // Default to false if unknown
    console.log(
      "[useSetupStatus] isSetupComplete:",
      complete,
      "from setupStatus:",
      setupStatus
    );
    return complete;
  })();

  return {
    setupStatus,
    isLoading,
    error,
    refreshStatus,
    needsSetup,
    isSetupComplete,
    // Additional helpful properties
    adminCount: setupStatus?.adminCount ?? 0,
    setupStep: setupStatus?.setupStep ?? "initial",
    systemInitialized: setupStatus?.systemInitialized ?? false,
    hasInitialAdmin: setupStatus?.hasInitialAdmin ?? false,
  };
};

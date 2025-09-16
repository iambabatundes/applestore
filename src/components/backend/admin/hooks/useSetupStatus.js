import { useState, useEffect } from "react";
import { AdminService } from "../services/adminService";

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

      setSetupStatus({
        needsSetup: statusData.needsSetup || false,
        setupCompleted: statusData.setupCompleted || false,
        adminCount: statusData.adminCount || 0,
        setupStep: statusData.setupStep || "complete",
        systemInitialized: statusData.systemInitialized || false,
      });

      return statusData;
    } catch (err) {
      console.error("[useSetupStatus] Setup status check failed:", err);

      // If API returns 404 or setup endpoints don't exist, assume setup is needed
      if (err.response?.status === 404 || err.response?.status === 503) {
        setSetupStatus({
          needsSetup: true,
          setupCompleted: false,
          adminCount: 0,
          setupStep: "initial",
          systemInitialized: false,
        });
        return null;
      }

      setError(err.message || "Failed to check setup status");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const refreshStatus = () => {
    return checkSetupStatus();
  };

  return {
    setupStatus,
    isLoading,
    error,
    refreshStatus,
    needsSetup: setupStatus?.needsSetup || false,
    isSetupComplete: setupStatus?.setupCompleted || false,
  };
};

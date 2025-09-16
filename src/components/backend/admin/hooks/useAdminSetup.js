import { useState, useCallback } from "react";
import adminService from "../services/adminService";

export const useAdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const executeWithErrorHandling = useCallback(async (operation) => {
    try {
      setLoading(true);
      setError(null);
      return await operation();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.message ||
        "An unexpected error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSetupStatus = useCallback(
    () => executeWithErrorHandling(() => adminService.getSetupStatus()),
    [executeWithErrorHandling]
  );

  const createInitialAdmin = useCallback(
    (data) =>
      executeWithErrorHandling(() => adminService.createInitialAdmin(data)),
    [executeWithErrorHandling]
  );

  const verifyEmail = useCallback(
    (data) => executeWithErrorHandling(() => adminService.verifyEmail(data)),
    [executeWithErrorHandling]
  );

  const complete2FA = useCallback(
    (data) => executeWithErrorHandling(() => adminService.complete2FA(data)),
    [executeWithErrorHandling]
  );

  const resendCode = useCallback(
    (data) =>
      executeWithErrorHandling(() => adminService.resendVerificationCode(data)),
    [executeWithErrorHandling]
  );

  return {
    loading,
    error,
    clearError,
    getSetupStatus,
    createInitialAdmin,
    verifyEmail,
    complete2FA,
    resendCode,
  };
};

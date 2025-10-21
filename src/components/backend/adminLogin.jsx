import React, { useState, useEffect, useCallback } from "react";
import { useLocation, Navigate, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./styles/adminLogin.css";
import "./modals/styles/lockoutModal.css";
import { useAdminAuthStore } from "./store/useAdminAuthStore";

import {
  getUserFriendlyErrorMessage,
  isLockoutError,
  getLockoutData,
} from "./utils/errorMessages";
import { LockoutModal } from "./modals/lockoutModal";

export default function AdminLogin() {
  const [data, setData] = useState({
    email: "",
    password: "",
    totpCode: "",
    backupCode: "",
    rememberMe: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoutMessage, setLogoutMessage] = useState(null);
  const [logoutType, setLogoutType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const [showLockoutModal, setShowLockoutModal] = useState(false);
  const [lockoutData, setLockoutData] = useState(null);

  const {
    adminUser,
    isAuthenticated,
    loading,
    login,
    initialize,
    initialized,
    checkTokenExpiry,
  } = useAdminAuthStore();

  const navigate = useNavigate();
  const { state } = useLocation();

  const initializeAuthStore = useCallback(async () => {
    if (!initialized) {
      try {
        console.log("🔐 Initializing admin auth store from login page");
        await initialize();
        console.log("✅ Admin auth store initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize admin auth store:", error);
      }
    }
  }, [initialize, initialized]);

  useEffect(() => {
    initializeAuthStore();
  }, [initializeAuthStore]);

  useEffect(() => {
    if (initialized && isAuthenticated && adminUser) {
      console.log("✅ Valid admin session found, checking token expiry");
      const tokenValid = checkTokenExpiry();
      if (tokenValid) {
        console.log("🔄 Redirecting authenticated admin to dashboard");
        const redirectTo = state?.from?.pathname || "/admin/home";
        navigate(redirectTo, { replace: true });
      }
    }
  }, [
    initialized,
    isAuthenticated,
    adminUser,
    checkTokenExpiry,
    navigate,
    state,
  ]);

  useEffect(() => {
    const message = localStorage.getItem("adminLogoutMessage");
    const type = localStorage.getItem("adminLogoutType");

    if (message) {
      setLogoutMessage(message);
      setLogoutType(type);

      localStorage.removeItem("adminLogoutMessage");
      localStorage.removeItem("adminLogoutType");

      const timer = setTimeout(() => {
        setLogoutMessage(null);
        setLogoutType(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [data.email, data.password, data.totpCode, data.backupCode]);

  const validateForm = () => {
    const newErrors = {};

    if (!data.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.password?.trim()) {
      newErrors.password = "Password is required";
    }

    if (twoFactorStep && !data.totpCode && !data.backupCode) {
      newErrors.twoFactor = "Please enter either a TOTP code or backup code";
    }

    if (data.totpCode && data.totpCode.length !== 6) {
      newErrors.totpCode = "TOTP code must be 6 digits";
    }

    return newErrors;
  };

  // Enhanced lockout detection and handling
  const handleLockoutError = (error) => {
    console.log("🔒 Processing potential lockout error:", error);

    // Multiple ways to extract lockout data based on different response structures
    let lockoutInfo = null;

    // Method 1: Direct response data (from your backend)
    if (error.response?.data) {
      const data = error.response.data;
      if (
        data.remainingMinutes ||
        data.lockUntil ||
        error.response.status === 423
      ) {
        lockoutInfo = {
          remainingMinutes:
            data.remainingMinutes ||
            data.data?.remainingMinutes ||
            (data.lockUntil
              ? Math.ceil((new Date(data.lockUntil) - new Date()) / (60 * 1000))
              : null),
          message:
            data.message ||
            data.error?.message ||
            "Account temporarily locked due to failed login attempts",
          lockUntil: data.lockUntil || data.data?.lockUntil,
        };
      }
    }

    // Method 2: Use utility function
    if (!lockoutInfo) {
      lockoutInfo = getLockoutData(error);
    }

    // Method 3: Check if getUserFriendlyErrorMessage returned structured data
    if (!lockoutInfo) {
      const errorResult = getUserFriendlyErrorMessage(error, {
        isTwoFactorStep: twoFactorStep,
        operation: "admin login",
      });

      if (typeof errorResult === "object" && errorResult.isLockout) {
        lockoutInfo = {
          remainingMinutes: errorResult.remainingMinutes,
          message: errorResult.message,
          lockUntil: errorResult.lockUntil,
        };
      }
    }

    // Method 4: Fallback for 423 status
    if (!lockoutInfo && error.response?.status === 423) {
      lockoutInfo = {
        remainingMinutes: 15, // Default fallback
        message:
          "Account temporarily locked due to multiple failed login attempts",
        lockUntil: null,
      };
    }

    if (lockoutInfo) {
      console.log("🔒 Lockout detected, showing modal:", lockoutInfo);
      setLockoutData(lockoutInfo);
      setShowLockoutModal(true);
      resetForm();
      return true; // Indicates lockout was handled
    }

    return false; // No lockout detected
  };

  // Enhanced handleSubmit with better lockout handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      console.log("🔐 Attempting admin login...", {
        email: data.email,
        rememberMe: data.rememberMe,
        has2FA: !!(data.totpCode || data.backupCode),
      });

      const result = await login(
        data.email.trim(),
        data.password,
        navigate,
        data.totpCode || null,
        data.backupCode || null,
        data.rememberMe
      );

      if (result?.requires2FA) {
        console.log("🔐 2FA required, showing 2FA form");
        setRequires2FA(true);
        setTwoFactorStep(true);
        setErrors({
          general: result.message || "Two-factor authentication code required",
        });
        return;
      }

      if (!result?.success) {
        throw new Error(result?.error || "Login failed");
      }

      console.log("✅ Admin login successful");
    } catch (error) {
      console.error("❌ Admin login error:", error);

      // First, try to handle as lockout error
      const wasLockout = handleLockoutError(error);
      if (wasLockout) {
        return; // Lockout modal is shown, exit early
      }

      // Handle non-lockout errors
      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      // Get user-friendly error message
      const errorResult = getUserFriendlyErrorMessage(error, {
        isTwoFactorStep: twoFactorStep,
        operation: "admin login",
      });

      // Handle the result from getUserFriendlyErrorMessage
      if (typeof errorResult === "string") {
        errorMessage = errorResult;
      } else if (typeof errorResult === "object") {
        if (errorResult.isLockout) {
          // This should have been caught above, but handle it again just in case
          console.log("🔒 Late lockout detection from error utility");
          setLockoutData({
            remainingMinutes: errorResult.remainingMinutes,
            message: errorResult.message,
            lockUntil: errorResult.lockUntil,
          });
          setShowLockoutModal(true);
          resetForm();
          return;
        }
        errorMessage = errorResult.message || errorMessage;
      }

      // Set the error for display
      setErrors({ general: errorMessage });

      // Special handling for certain error types
      if (error.response?.status === 401 && twoFactorStep) {
        // Invalid 2FA code
        console.log("❌ Invalid 2FA code");
      } else if (error.response?.status === 400 && !twoFactorStep) {
        // Invalid credentials
        console.log("❌ Invalid login credentials");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackupCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, "");
    setData((prevState) => ({
      ...prevState,
      backupCode: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const closeLogoutMessage = () => {
    setLogoutMessage(null);
    setLogoutType(null);
  };

  const resetForm = () => {
    setData({
      email: "",
      password: "",
      totpCode: "",
      backupCode: "",
      rememberMe: false,
    });
    setRequires2FA(false);
    setTwoFactorStep(false);
    setErrors({});
  };

  const handleLockoutRetry = () => {
    console.log("🔄 User requested retry after lockout");
    setShowLockoutModal(false);
    setLockoutData(null);
    // Form is already cleared by resetForm() called during lockout
  };

  const handleLockoutClose = () => {
    console.log("👋 User closed lockout modal");
    setShowLockoutModal(false);
    // Keep lockout data in case they want to see it again
  };

  // Enhanced loading state
  if (!initialized || loading) {
    return (
      <div className="admin-login-background">
        <div className="admin-login-container">
          <div className="adminLogin__loading">
            <div className="spinner"></div>
            <p>{!initialized ? "Initializing..." : "Loading..."}</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced redirect check
  if (initialized && isAuthenticated && adminUser) {
    const redirectTo = state?.from?.pathname || "/admin/home";
    return <Navigate to={redirectTo} replace />;
  }

  const messageClass =
    logoutType === "manual"
      ? "adminLogin__message--manual"
      : "adminLogin__message--automatic";

  return (
    <div className="admin-login-background">
      <div className="admin-login-container">
        {/* Account Lockout Modal - Show when visible and has data */}
        {showLockoutModal && lockoutData && (
          <LockoutModal
            lockoutData={lockoutData}
            onRetry={handleLockoutRetry}
            onClose={handleLockoutClose}
            isVisible={showLockoutModal}
          />
        )}

        {logoutMessage && (
          <div className={`adminLogin__message ${messageClass}`}>
            {logoutMessage}
            <button
              className="adminLogin__close"
              onClick={closeLogoutMessage}
              type="button"
              aria-label="Close message"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="adminLogin__form" noValidate>
          <h1 className="adminLogin__heading">
            {twoFactorStep ? "Two-Factor Authentication" : "Admin Login"}
          </h1>

          {/* Only show non-lockout errors and when modal is not visible */}
          {Object.keys(errors).length > 0 && !showLockoutModal && (
            <div className="adminLogin__errors">
              {Object.values(errors).map((error, index) => (
                <p key={index} className="adminLogin__error">
                  {error}
                </p>
              ))}
            </div>
          )}

          {!twoFactorStep ? (
            <>
              <div className="adminLogin__input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={data.email}
                  onChange={handleInputChange}
                  required
                  className={`adminLogin__input ${
                    errors.email ? "adminLogin__input--error" : ""
                  }`}
                  autoFocus
                  name="email"
                  autoComplete="email"
                  disabled={isSubmitting || showLockoutModal}
                />
              </div>

              <div className="adminLogin__input-group">
                <div className="adminLogin__password-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Password"
                    value={data.password}
                    onChange={handleInputChange}
                    required
                    className={`adminLogin__input ${
                      errors.password ? "adminLogin__input--error" : ""
                    }`}
                    name="password"
                    autoComplete="current-password"
                    disabled={isSubmitting || showLockoutModal}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="adminLogin__password-toggle"
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                    disabled={isSubmitting || showLockoutModal}
                  >
                    <FontAwesomeIcon
                      icon={passwordVisible ? faEyeSlash : faEye}
                      className="adminLogin__password-icon"
                    />
                  </button>
                </div>
              </div>

              <div className="adminLogin__checkbox-group">
                <label className="adminLogin__checkbox">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={data.rememberMe}
                    onChange={handleInputChange}
                    disabled={isSubmitting || showLockoutModal}
                  />
                  <span className="adminLogin__checkmark"></span>
                  Remember me for 30 days
                </label>
              </div>

              {/* Forgot Password Link */}
              <div className="adminLogin__forgot-password">
                <Link to="/admin/password-reset">Forgot your password?</Link>
              </div>
            </>
          ) : (
            <>
              <div className="adminLogin__2fa-info">
                <p>Enter your authentication code below</p>
              </div>
              <div className="adminLogin__input-group">
                <input
                  type="text"
                  placeholder="6-digit authentication code"
                  value={data.totpCode}
                  onChange={handleInputChange}
                  className={`adminLogin__input ${
                    errors.totpCode ? "adminLogin__input--error" : ""
                  }`}
                  autoFocus
                  name="totpCode"
                  maxLength="6"
                  autoComplete="one-time-code"
                  disabled={isSubmitting || showLockoutModal}
                />
              </div>
              <div className="adminLogin__divider">
                <span>OR</span>
              </div>

              <div className="adminLogin__input-group">
                <input
                  type="text"
                  placeholder="Backup code (e.g., A1B2C3D4)"
                  value={data.backupCode}
                  onChange={handleBackupCodeChange}
                  className="adminLogin__input"
                  name="backupCode"
                  maxLength="8"
                  disabled={isSubmitting || showLockoutModal}
                  style={{
                    textTransform: "uppercase",
                    fontFamily: "monospace",
                  }}
                />
                <small className="adminLogin__help-text">
                  Enter your 8-character backup code (letters and numbers only)
                </small>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="adminLogin__back-btn"
                disabled={isSubmitting || showLockoutModal}
              >
                ← Back to login
              </button>
            </>
          )}

          <button
            type="submit"
            className={`adminLogin__btn ${
              isSubmitting ? "adminLogin__btn--loading" : ""
            } ${showLockoutModal ? "adminLogin__btn--disabled" : ""}`}
            disabled={isSubmitting || showLockoutModal}
          >
            {isSubmitting ? (
              <>
                <span className="adminLogin__btn-spinner"></span>
                {twoFactorStep ? "Verifying..." : "Signing in..."}
              </>
            ) : twoFactorStep ? (
              "Verify Code"
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

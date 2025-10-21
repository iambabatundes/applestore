import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faArrowLeft,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import {
  requestAdminPasswordReset,
  verifyAdminResetCode,
  verify2FAForAdminReset,
  completeAdminPasswordReset,
  resendAdminResetCode,
  validatePasswordStrength,
  passwordsMatch,
} from "../../services/adminPasswordResetService";

requestAdminPasswordReset;

const STEPS = {
  REQUEST: "request",
  VERIFY_CODE: "verify_code",
  VERIFY_2FA: "verify_2fa",
  NEW_PASSWORD: "new_password",
  SUCCESS: "success",
};

export default function AdminPasswordReset() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State management
  const [currentStep, setCurrentStep] = useState(STEPS.REQUEST);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(null);

  // Check for email in URL params
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Clear errors when input changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [email, resetCode, totpCode, backupCode, newPassword, confirmPassword]);

  // Validate password strength in real-time
  useEffect(() => {
    if (newPassword) {
      const validation = validatePasswordStrength(newPassword);
      setPasswordStrength(validation);
    } else {
      setPasswordStrength(null);
    }
  }, [newPassword]);

  // Step 1: Request Password Reset
  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await requestAdminPasswordReset(email);
      setSuccessMessage(response.message || "Reset code sent to your email");
      setCurrentStep(STEPS.VERIFY_CODE);
      setCountdown(60); // 60 seconds before can resend
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset code. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify Reset Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!resetCode.trim()) {
      setErrors({ resetCode: "Reset code is required" });
      return;
    }

    if (!/^[0-9]{6}$/.test(resetCode)) {
      setErrors({ resetCode: "Reset code must be 6 digits" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await verifyAdminResetCode(email, resetCode);
      setResetToken(response.resetToken);
      setRequires2FA(response.requires2FA);

      if (response.requires2FA) {
        setCurrentStep(STEPS.VERIFY_2FA);
      } else {
        setCurrentStep(STEPS.NEW_PASSWORD);
      }

      setSuccessMessage("Code verified successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Invalid or expired code. Please try again.";
      setErrors({ resetCode: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Verify 2FA (if required)
  const handleVerify2FA = async (e) => {
    e.preventDefault();

    if (!totpCode && !backupCode) {
      setErrors({
        twoFactor: "Please enter either a TOTP code or backup code",
      });
      return;
    }

    if (totpCode && !/^[0-9]{6}$/.test(totpCode)) {
      setErrors({ totpCode: "TOTP code must be 6 digits" });
      return;
    }

    if (backupCode && !/^[A-F0-9]{8}$/i.test(backupCode)) {
      setErrors({ backupCode: "Invalid backup code format" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await verify2FAForAdminReset(
        resetToken,
        totpCode,
        backupCode
      );
      setResetToken(response.resetToken);
      setCurrentStep(STEPS.NEW_PASSWORD);
      setSuccessMessage("2FA verified successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid 2FA code. Please try again.";
      setErrors({ twoFactor: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 4: Set New Password
  const handleSetNewPassword = async (e) => {
    e.preventDefault();

    const validation = validatePasswordStrength(newPassword);

    if (!validation.isValid) {
      setErrors({ newPassword: validation.errors[0] });
      return;
    }

    if (!passwordsMatch(newPassword, confirmPassword)) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await completeAdminPasswordReset(
        resetToken,
        newPassword,
        confirmPassword
      );
      setSuccessMessage(response.message || "Password reset successfully");
      setCurrentStep(STEPS.SUCCESS);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/admin/login");
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend reset code
  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await resendAdminResetCode(email);
      setSuccessMessage("A new reset code has been sent to your email");
      setCountdown(60);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to resend code. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Go back to previous step
  const handleBack = () => {
    setErrors({});
    setSuccessMessage("");

    if (currentStep === STEPS.VERIFY_CODE) {
      setCurrentStep(STEPS.REQUEST);
      setResetCode("");
    } else if (currentStep === STEPS.VERIFY_2FA) {
      setCurrentStep(STEPS.VERIFY_CODE);
      setTotpCode("");
      setBackupCode("");
    } else if (currentStep === STEPS.NEW_PASSWORD) {
      if (requires2FA) {
        setCurrentStep(STEPS.VERIFY_2FA);
      } else {
        setCurrentStep(STEPS.VERIFY_CODE);
      }
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // Handle backup code input formatting
  const handleBackupCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, "");
    setBackupCode(value);
  };

  // Render step indicator
  const renderStepIndicator = () => {
    const steps = [
      { key: STEPS.REQUEST, label: "Email" },
      { key: STEPS.VERIFY_CODE, label: "Verify" },
    ];

    if (requires2FA) {
      steps.push({ key: STEPS.VERIFY_2FA, label: "2FA" });
    }

    steps.push({ key: STEPS.NEW_PASSWORD, label: "Password" });

    const currentIndex = steps.findIndex((s) => s.key === currentStep);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
          gap: "10px",
        }}
      >
        {steps.map((step, index) => (
          <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: index <= currentIndex ? "#4CAF50" : "#ddd",
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {index < currentIndex ? "✓" : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                style={{
                  width: "50px",
                  height: "2px",
                  backgroundColor: index < currentIndex ? "#4CAF50" : "#ddd",
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render current step form
  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.REQUEST:
        return (
          <form onSubmit={handleRequestReset}>
            <h2 style={{ marginBottom: "10px", color: "#333" }}>
              Reset Your Password
            </h2>
            <p
              style={{ marginBottom: "25px", color: "#666", fontSize: "14px" }}
            >
              Enter your email address and we'll send you a reset code
            </p>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              autoFocus
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                border: `1px solid ${errors.email ? "#f44336" : "#ddd"}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: isSubmitting ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
              {isSubmitting ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        );

      case STEPS.VERIFY_CODE:
        return (
          <form onSubmit={handleVerifyCode}>
            <h2 style={{ marginBottom: "10px", color: "#333" }}>
              Verify Reset Code
            </h2>
            <p
              style={{ marginBottom: "25px", color: "#666", fontSize: "14px" }}
            >
              Enter the 6-digit code sent to {email}
            </p>

            <input
              type="text"
              placeholder="000000"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ""))}
              maxLength="6"
              disabled={isSubmitting}
              autoFocus
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                border: `1px solid ${errors.resetCode ? "#f44336" : "#ddd"}`,
                borderRadius: "6px",
                fontSize: "20px",
                letterSpacing: "8px",
                textAlign: "center",
                fontFamily: "monospace",
              }}
            />

            <div style={{ marginBottom: "15px", textAlign: "center" }}>
              {countdown > 0 ? (
                <p style={{ color: "#666", fontSize: "14px" }}>
                  Resend code in {countdown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2196F3",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Resend Code
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: isSubmitting ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        );

      case STEPS.VERIFY_2FA:
        return (
          <form onSubmit={handleVerify2FA}>
            <h2 style={{ marginBottom: "10px", color: "#333" }}>
              Two-Factor Authentication
            </h2>
            <p
              style={{ marginBottom: "25px", color: "#666", fontSize: "14px" }}
            >
              Enter your authentication code
            </p>

            <input
              type="text"
              placeholder="6-digit TOTP code"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
              maxLength="6"
              disabled={isSubmitting}
              autoFocus
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                border: `1px solid ${errors.totpCode ? "#f44336" : "#ddd"}`,
                borderRadius: "6px",
                fontSize: "16px",
              }}
            />

            <div
              style={{ margin: "20px 0", textAlign: "center", color: "#999" }}
            >
              OR
            </div>

            <input
              type="text"
              placeholder="Backup code (e.g., A1B2C3D4)"
              value={backupCode}
              onChange={handleBackupCodeChange}
              maxLength="8"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                border: `1px solid ${errors.backupCode ? "#f44336" : "#ddd"}`,
                borderRadius: "6px",
                fontSize: "16px",
                textTransform: "uppercase",
                fontFamily: "monospace",
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: isSubmitting ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
              {isSubmitting ? "Verifying..." : "Verify 2FA"}
            </button>
          </form>
        );

      case STEPS.NEW_PASSWORD:
        return (
          <form onSubmit={handleSetNewPassword}>
            <h2 style={{ marginBottom: "10px", color: "#333" }}>
              Set New Password
            </h2>
            <p
              style={{ marginBottom: "25px", color: "#666", fontSize: "14px" }}
            >
              Create a strong password for your account
            </p>

            <div style={{ position: "relative", marginBottom: "15px" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isSubmitting}
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px",
                  paddingRight: "45px",
                  border: `1px solid ${
                    errors.newPassword ? "#f44336" : "#ddd"
                  }`,
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {passwordStrength && !passwordStrength.isValid && (
              <div
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#fff3cd",
                  borderRadius: "6px",
                }}
              >
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "20px",
                    fontSize: "12px",
                    color: "#856404",
                  }}
                >
                  {passwordStrength.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ position: "relative", marginBottom: "15px" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "12px",
                  paddingRight: "45px",
                  border: `1px solid ${
                    errors.confirmPassword ? "#f44336" : "#ddd"
                  }`,
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: isSubmitting ? "#ccc" : "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        );

      case STEPS.SUCCESS:
        return (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{
                fontSize: "64px",
                color: "#4CAF50",
                marginBottom: "20px",
              }}
            />
            <h2 style={{ marginBottom: "10px", color: "#333" }}>
              Password Reset Successful!
            </h2>
            <p
              style={{ marginBottom: "25px", color: "#666", fontSize: "14px" }}
            >
              Your password has been reset successfully. You will be redirected
              to the login page...
            </p>
            <Link
              to="/admin/login"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#2196F3",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Go to Login
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          padding: "40px",
          width: "100%",
          maxWidth: "480px",
        }}
      >
        {/* Back button */}
        {currentStep !== STEPS.REQUEST && currentStep !== STEPS.SUCCESS && (
          <button
            onClick={handleBack}
            disabled={isSubmitting}
            style={{
              background: "none",
              border: "none",
              color: "#2196F3",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
        )}

        {/* Step Indicator */}
        {currentStep !== STEPS.SUCCESS && renderStepIndicator()}

        {/* Success Message */}
        {successMessage && currentStep !== STEPS.SUCCESS && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#d4edda",
              color: "#155724",
              borderRadius: "6px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
            {successMessage}
          </div>
        )}

        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              borderRadius: "6px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ marginRight: "8px" }}
            />
            {Object.values(errors)[0]}
          </div>
        )}

        {/* Current Step Form */}
        {renderCurrentStep()}

        {/* Login Link */}
        {currentStep !== STEPS.SUCCESS && (
          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
              fontSize: "14px",
              color: "#666",
            }}
          >
            Remember your password?{" "}
            <Link
              to="/admin/login"
              style={{
                color: "#2196F3",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

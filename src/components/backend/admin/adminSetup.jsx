import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronRight,
  Shield,
  Mail,
  Smartphone,
  Key,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Download,
  RefreshCw,
  Lock,
  Users,
} from "lucide-react";
import "./styles/adminSetup.css";
import AdminService, { ERROR_TYPES } from "../../../services/adminService";

const useAdminSetupService = () => {
  return {
    getSetupStatus: () => AdminService.getSetupStatus(),
    createInitialAdmin: (data) => AdminService.createInitialAdmin(data),
    verifyEmail: (data) => AdminService.verifyEmail(data),
    complete2FA: (data) => AdminService.complete2FA(data),
    resendVerificationCode: (data) => AdminService.resendVerificationCode(data),
  };
};

const PasswordStrength = ({ password, id }) => {
  const getStrength = (pass) => {
    // Add null/undefined check at the start
    if (!pass || typeof pass !== "string") {
      return { score: 0, label: "Enter password", color: "", checks: [] };
    }

    let score = 0;
    const checks = [
      { test: /.{12,}/, label: "12+ characters" },
      { test: /[A-Z]/, label: "Uppercase" },
      { test: /[a-z]/, label: "Lowercase" },
      { test: /[0-9]/, label: "Number" },
      { test: /[^A-Za-z0-9]/, label: "Special character" },
    ];

    const passedChecks = checks.filter((check) => check.test.test(pass));
    score = passedChecks.length;

    if (score < 2)
      return {
        score,
        label: "Weak",
        color: "password-strength__fill--weak",
        checks: passedChecks.map((c) => c.label),
      };
    if (score < 4)
      return {
        score,
        label: "Fair",
        color: "password-strength__fill--fair",
        checks: passedChecks.map((c) => c.label),
      };
    if (score < 5)
      return {
        score,
        label: "Good",
        color: "password-strength__fill--good",
        checks: passedChecks.map((c) => c.label),
      };
    return {
      score,
      label: "Strong",
      color: "password-strength__fill--strong",
      checks: passedChecks.map((c) => c.label),
    };
  };

  const strength = getStrength(password);

  return (
    <div className="password-strength" role="status" aria-live="polite">
      <div className="password-strength__header">
        <span className="password-strength__label">Password strength</span>
        <span className="password-strength__score" id={`${id}-strength-label`}>
          {strength.label}
        </span>
      </div>
      <div
        className="password-strength__bar"
        role="progressbar"
        aria-valuenow={strength.score}
        aria-valuemax={5}
        aria-labelledby={`${id}-strength-label`}
      >
        <div
          className={`password-strength__fill ${strength.color}`}
          style={{ width: `${(strength.score / 5) * 100}%` }}
        />
      </div>
      {strength.checks && strength.checks.length > 0 && (
        <div
          className="password-strength__checks"
          aria-label="Password requirements met"
        >
          <small>Requirements met: {strength.checks.join(", ")}</small>
        </div>
      )}
    </div>
  );
};

// Enhanced Toast with better error handling
const Toast = ({ message, type = "info", onClose, error }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, type === "error" ? 8000 : 5000);
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const getErrorDetails = () => {
    if (!error || type !== "error") return null;

    return (
      <div className="toast__error-details">
        {error.suggestions && error.suggestions.length > 0 && (
          <div className="toast__suggestions">
            <strong>Suggestions:</strong>
            <ul>
              {error.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="assertive">
      <div className="toast__content">
        <span className="toast__message">{message}</span>
        {getErrorDetails()}
        <button
          onClick={onClose}
          className="toast__close"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Enhanced QR Code Display with security improvements
const QRCodeDisplay = ({ qrCodeUrl, secret, onContinue }) => {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = secret;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="qr-code-container">
      <div className="qr-code-image">
        <img
          src={qrCodeUrl}
          alt="Two-factor authentication QR code"
          onError={(e) => {
            e.target.style.display = "none";
            console.error("Failed to load QR code");
          }}
        />
      </div>

      <div className="qr-code-manual">
        <p className="qr-code-manual__label">
          Scan this QR code with your authenticator app (Google Authenticator,
          Authy, etc.)
        </p>

        <div>
          <label htmlFor="manual-key" className="qr-code-manual__label">
            Manual entry key:
          </label>
          <div className="qr-code-manual__controls">
            <code
              className="qr-code-manual__key"
              id="manual-key"
              aria-label={
                showSecret ? "Secret key visible" : "Secret key hidden"
              }
            >
              {showSecret ? secret : "••••••••••••••••"}
            </code>
            <button
              onClick={() => setShowSecret(!showSecret)}
              className="qr-code-manual__button"
              aria-label={showSecret ? "Hide secret key" : "Show secret key"}
            >
              {showSecret ? (
                <EyeOff className="icon--small" />
              ) : (
                <Eye className="icon--small" />
              )}
            </button>
            <button
              onClick={copySecret}
              className="qr-code-manual__button"
              aria-label="Copy secret key to clipboard"
            >
              <Copy className="icon--small" />
            </button>
          </div>
          {copied && (
            <p className="qr-code-manual__feedback" role="status">
              Copied to clipboard!
            </p>
          )}
        </div>
      </div>

      <div className="qr-code-confirmation">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            aria-describedby="confirmation-help"
          />
          <span>
            I have successfully added this account to my authenticator app
          </span>
        </label>
        <small id="confirmation-help" className="form-help">
          Please confirm before continuing to ensure you can generate codes
        </small>
      </div>

      <button
        onClick={onContinue}
        disabled={!confirmed}
        className="btn btn--primary btn--full-width mt-6"
      >
        Continue to Verification
      </button>
    </div>
  );
};

// Enhanced Backup Codes with better security
const BackupCodes = ({ codes, onDownload, onContinue }) => {
  const [downloaded, setDownloaded] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const downloadCodes = () => {
    const content = `Admin Panel - Backup Codes
Generated: ${new Date().toLocaleString()}
IMPORTANT: Keep these codes safe and secure. Each can only be used once.

${codes.join("\n")}

Security Guidelines:
- Store these codes in a secure location
- Do not share these codes with anyone
- Each code can only be used once
- Generate new codes if these are compromised`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-backup-codes-${Date.now()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    setDownloaded(true);
    onDownload?.();
  };

  return (
    <div className="text-center">
      <div className="info-box info-box--warning mb-6">
        <div className="info-box__header">
          <AlertCircle className="icon--small info-box__icon" />
          <span className="info-box__title">
            Critical: Save Your Backup Codes
          </span>
        </div>
        <p className="info-box__content">
          These codes are your emergency access method. If you lose your phone
          or authenticator app, these codes are the only way to access your
          account.
        </p>
      </div>

      <div className="backup-codes-grid" role="list" aria-label="Backup codes">
        {codes.map((code, index) => (
          <div key={index} className="backup-code" role="listitem">
            <code>{code}</code>
          </div>
        ))}
      </div>

      <div className="backup-codes-actions">
        <button
          onClick={downloadCodes}
          className="btn btn--success btn--full-width"
          aria-describedby="download-help"
        >
          <Download className="icon--small" />
          Download Backup Codes
        </button>
        <small id="download-help" className="form-help">
          Download as secure text file for offline storage
        </small>

        <div className="backup-codes-confirmation">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              aria-describedby="backup-confirmation-help"
            />
            <span>I have securely saved my backup codes</span>
          </label>
          <small id="backup-confirmation-help" className="form-help">
            Confirm you have saved these codes in a secure location
          </small>
        </div>

        <button
          onClick={onContinue}
          disabled={!downloaded || !confirmed}
          className="btn btn--primary btn--full-width"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};

// Enhanced Progress Steps with accessibility
const ProgressSteps = ({ currentStep, steps }) => {
  return (
    <nav className="progress-steps" aria-label="Setup progress">
      <div className="progress-steps__container">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="progress-steps__step">
              <div
                className={`progress-steps__circle ${
                  index < currentStep
                    ? "progress-steps__circle--completed"
                    : index === currentStep
                    ? "progress-steps__circle--current"
                    : "progress-steps__circle--pending"
                }`}
                role="img"
                aria-label={`Step ${index + 1}: ${step.label} - ${
                  index < currentStep
                    ? "completed"
                    : index === currentStep
                    ? "current"
                    : "pending"
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="icon--small" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="progress-steps__label">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`progress-steps__connector ${
                  index < currentStep
                    ? "progress-steps__connector--completed"
                    : "progress-steps__connector--pending"
                }`}
                role="presentation"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

// Main Enhanced Admin Setup Component
const AdminSetup = ({ onSetupComplete, darkMode }) => {
  // ✅ Accept props
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [setupStatus, setSetupStatus] = useState(null);
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    emailCode: "",
    totpCode: "",
  });

  const adminSetupService = useAdminSetupService();

  const showToast = (message, type = "info", error = null) => {
    setToast({ message, type, error, id: Date.now() });
  };

  const steps = [
    { id: "status", label: "Check Status" },
    { id: "create", label: "Create Admin" },
    { id: "verify", label: "Verify Email" },
    { id: "setup-2fa", label: "Setup 2FA" },
    { id: "backup", label: "Backup Codes" },
    { id: "complete", label: "Complete" },
  ];

  // Enhanced error handling with better user feedback
  const handleError = (error, operation) => {
    console.error(`[AdminSetup] ${operation} failed:`, error);

    let message = error.message || "An unexpected error occurred";
    let suggestions = [];

    // Handle specific error types from service with suggestions
    switch (error.type) {
      case ERROR_TYPES.VALIDATION_ERROR:
        message = "Please check your input and try again";
        suggestions = [
          "Verify all required fields are filled",
          "Check password requirements",
        ];
        break;
      case ERROR_TYPES.AUTH_ERROR:
        message = "Authentication failed. Please check your credentials";
        suggestions = [
          "Double-check your email and password",
          "Try resetting if you forgot your password",
        ];
        break;
      case ERROR_TYPES.RATE_LIMIT_ERROR:
        message = "Too many requests. Please wait a moment before trying again";
        suggestions = [
          "Wait 1-2 minutes before retrying",
          "Check your internet connection",
        ];
        break;
      case ERROR_TYPES.NETWORK_ERROR:
        message = "Network error. Please check your connection";
        suggestions = [
          "Check your internet connection",
          "Try refreshing the page",
        ];
        break;
      default:
        // Provide helpful suggestions based on current step
        switch (currentStep) {
          case 1:
            suggestions = [
              "Check all form fields are valid",
              "Ensure password meets requirements",
            ];
            break;
          case 2:
            suggestions = [
              "Check your email for the verification code",
              "Try resending the code",
            ];
            break;
          case 3:
            suggestions = [
              "Wait for a new code from your authenticator app",
              "Ensure your device time is correct",
            ];
            break;
          default:
            suggestions = [
              "Try refreshing the page",
              "Contact support if the issue persists",
            ];
        }
        break;
    }

    setError(message);
    showToast(message, "error", { ...error, suggestions });
  };

  // Check setup status on mount
  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      setLoading(true);
      const status = await adminSetupService.getSetupStatus();

      // Handle different response structures
      const statusData = status.data || status;
      setSetupStatus(statusData);

      // ✅ Only jump to complete if setup is truly complete AND we have an admin
      if (statusData.setupCompleted && statusData.adminCount > 0) {
        setCurrentStep(5); // Jump to complete step
        showToast("System setup already completed", "info");
      } else {
        // Reset to beginning if setup is needed
        setCurrentStep(0);
      }
    } catch (err) {
      handleError(err, "checkSetupStatus");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const validateForm = (step) => {
    switch (step) {
      case 1: // Validate Step 1 data (Create admin form)
        if (!formData.firstName.trim()) return "First name is required";
        if (!formData.lastName.trim()) return "Last name is required";
        if (!formData.email.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format";
        if (!formData.password) return "Password is required";
        if (formData.password.length < 12)
          return "Password must be at least 12 characters";
        if (formData.password !== formData.confirmPassword)
          return "Passwords do not match";
        return null;
      case 2: // Validate Step 2 data (Email verification)
        if (!formData.emailCode.trim())
          return "Email verification code is required";
        if (formData.emailCode.length !== 6) return "Code must be 6 digits";
        return null;
      case 3: // Validate Step 3 data (2FA setup)
        if (!formData.totpCode.trim()) return "2FA code is required";
        if (formData.totpCode.length !== 6) return "Code must be 6 digits";
        return null;
      default:
        return null;
    }
  };

  const handleNext = async () => {
    if (currentStep > 0) {
      const validationError = validateForm(currentStep);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      switch (currentStep) {
        case 0:
          setCurrentStep(1);
          break;

        case 1:
          const adminResult = await adminSetupService.createInitialAdmin({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          });

          // Safely merge result data
          const adminData = adminResult.data || adminResult;
          setSetupData((prev) => ({ ...prev, ...adminData }));
          showToast("Admin account created successfully", "success");
          setCurrentStep(2);
          break;

        case 2:
          const verifyResult = await adminSetupService.verifyEmail({
            setupToken: setupData.setupToken,
            emailCode: formData.emailCode,
          });

          const verifyData = verifyResult.data || verifyResult;
          setSetupData((prev) => ({ ...prev, ...verifyData }));
          showToast("Email verified successfully", "success");
          setCurrentStep(3);
          break;

        case 3: // Complete 2FA setup
          const twoFAResult = await adminSetupService.complete2FA({
            setupToken: setupData.setupToken,
            totpCode: formData.totpCode,
          });

          const twoFAData = twoFAResult.data || twoFAResult;
          setSetupData((prev) => ({ ...prev, ...twoFAData }));
          showToast("2FA setup completed", "success");
          setCurrentStep(4);
          break;

        case 4: // Backup codes saved
          setCurrentStep(5);
          showToast("Setup completed successfully!", "success");

          // Call the completion callback after successful setup
          if (onSetupComplete) {
            await onSetupComplete();
          }
          break;

        default:
          break;
      }
    } catch (err) {
      handleError(err, `step${currentStep + 1}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) {
      showToast(
        `Please wait ${resendCooldown} seconds before resending`,
        "warning"
      );
      return;
    }

    try {
      setLoading(true);
      setCanResend(false);

      const tokenToSend = setupData.setupToken;

      if (!tokenToSend) {
        showToast("Setup session expired. Please restart setup.", "error");
        setCurrentStep(0);
        return;
      }

      await adminSetupService.resendVerificationCode({
        verificationToken: tokenToSend,
      });

      showToast("Verification code resent", "success");

      // Start 60-second cooldown
      let countdown = 60;
      setResendCooldown(countdown);

      const cooldownInterval = setInterval(() => {
        countdown--;
        setResendCooldown(countdown);

        if (countdown <= 0) {
          clearInterval(cooldownInterval);
          setCanResend(true);
          setResendCooldown(0);
        }
      }, 1000);
    } catch (err) {
      if (
        err.type === "RATE_LIMIT_ERROR" ||
        err.message.includes("rate limit")
      ) {
        // Extract wait time from error if available, otherwise default to 2 minutes
        const waitTime = 120; // 2 minutes in seconds
        setResendCooldown(waitTime);

        const cooldownInterval = setInterval(() => {
          setResendCooldown((prev) => {
            const newTime = prev - 1;
            if (newTime <= 0) {
              clearInterval(cooldownInterval);
              setCanResend(true);
              return 0;
            }
            return newTime;
          });
        }, 1000);

        showToast(
          `Rate limited. Please wait ${Math.ceil(
            waitTime / 60
          )} minutes before trying again.`,
          "warning"
        );
      } else {
        handleError(err, "resendCode");
        setCanResend(true); // Re-enable button on other errors
      }
    } finally {
      setLoading(false);
    }
  };

  // Session timeout handler
  useEffect(() => {
    let timeoutId;

    if (currentStep > 1 && currentStep < 5) {
      // 30 minute timeout for active setup
      timeoutId = setTimeout(() => {
        showToast(
          "Session expired. Please restart the setup process.",
          "error"
        );
        setCurrentStep(0);
        setSetupData({});
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          emailCode: "",
          totpCode: "",
        });
      }, 30 * 60 * 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentStep]);

  const renderStepContent = () => {
    if (loading && currentStep === 0) {
      return (
        <div className="loading-container">
          <RefreshCw className="icon--large icon--spin mx-auto mb-4" />
          <p className="loading-text">Checking setup status...</p>
        </div>
      );
    }

    switch (currentStep) {
      case 0: // Setup Status
        return (
          <div className="text-center">
            <Shield className="icon--large mx-auto mb-6" />
            <h2 className="step-title">Admin Panel Setup</h2>
            <p className="step-description">
              Set up your initial super administrator account to get started.
            </p>
            {setupStatus && (
              <div className="status-card">
                <p className="status-item">
                  Status:{" "}
                  <strong>
                    {setupStatus.setupStatus ||
                      (setupStatus.setupCompleted ? "Complete" : "Needs Setup")}
                  </strong>
                </p>
                <p className="status-item">
                  Admin Count: <strong>{setupStatus.adminCount}</strong>
                </p>
              </div>
            )}
            <button
              onClick={handleNext} // ✅ Use handleNext instead of directly setting step
              disabled={
                setupStatus?.setupCompleted && setupStatus?.adminCount > 0
              }
              className="btn btn--primary btn--large"
            >
              {setupStatus?.setupCompleted && setupStatus?.adminCount > 0
                ? "Setup Already Complete"
                : "Start Setup"}
            </button>
          </div>
        );

      case 1: // Create Super Admin
        return (
          <div>
            <div className="step-header">
              <Users className="icon--medium mx-auto mb-4" />
              <h2 className="step-title">Create Super Admin</h2>
              <p className="step-description">
                Set up the initial administrator account with full system
                access.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <div className="form-group">
                <div className="form-grid form-grid--cols-2">
                  <div>
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="form-input"
                      placeholder="Enter first name"
                      required
                      autoComplete="given-name"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="form-input"
                      placeholder="Enter last name"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="form-input"
                    placeholder="admin@company.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="form-input"
                    placeholder="Enter secure password"
                    required
                    autoComplete="new-password"
                    aria-describedby="password-strength password-requirements"
                  />
                  <PasswordStrength
                    password={formData.password}
                    id="password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="form-input"
                    placeholder="Confirm password"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div
                  className="info-box info-box--warning"
                  id="password-requirements"
                >
                  <div className="info-box__header">
                    <Lock className="info-box__icon icon--small" />
                    <span className="info-box__title">
                      Password Requirements
                    </span>
                  </div>
                  <ul className="info-box__list" role="list">
                    <li className="info-box__list-item">
                      At least 12 characters long
                    </li>
                    <li className="info-box__list-item">
                      Contains uppercase and lowercase letters
                    </li>
                    <li className="info-box__list-item">
                      Contains at least one number
                    </li>
                    <li className="info-box__list-item">
                      Contains at least one special character
                    </li>
                  </ul>
                </div>
              </div>
            </form>
          </div>
        );

      case 2: // Verify Email
        return (
          <div className="text-center">
            <Mail className="icon--large mx-auto mb-6" />
            <h2 className="step-title">Verify Your Email</h2>
            <p className="step-description">
              We've sent a 6-digit verification code to{" "}
              <strong>{formData.email}</strong>
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <div className="form-input--small">
                <label htmlFor="emailCode" className="form-label">
                  Enter verification code
                </label>
                <input
                  id="emailCode"
                  type="text"
                  value={formData.emailCode}
                  onChange={(e) =>
                    handleInputChange(
                      "emailCode",
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  className="form-input form-input--center form-input--code"
                  placeholder="000000"
                  maxLength="6"
                  required
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  title="Enter the 6-digit code sent to your email"
                />
              </div>
            </form>

            <button
              onClick={handleResendCode}
              disabled={loading || !canResend}
              className="btn btn--link mt-4"
              type="button"
            >
              {!canResend && resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Didn't receive the code? Resend"}
            </button>
          </div>
        );

      case 3: // Setup 2FA
        return (
          <div className="text-center">
            <Smartphone className="icon--large mx-auto mb-6" />
            <h2 className="step-title">Set Up Two-Factor Authentication</h2>
            <p className="step-description">
              Scan the QR code with your authenticator app and enter the 6-digit
              code.
            </p>

            {setupData.twoFactorSetup?.qrCode && (
              <div className="mb-8">
                <QRCodeDisplay
                  qrCodeUrl={setupData.twoFactorSetup.qrCode}
                  secret={setupData.twoFactorSetup.secret}
                  onContinue={() => {
                    // Focus on the code input after QR setup
                    const codeInput = document.getElementById("totpCode");
                    if (codeInput) codeInput.focus();
                  }}
                />
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
            >
              <div className="form-input--small">
                <label htmlFor="totpCode" className="form-label">
                  Enter 6-digit code from your app
                </label>
                <input
                  id="totpCode"
                  type="text"
                  value={formData.totpCode}
                  onChange={(e) =>
                    handleInputChange(
                      "totpCode",
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  className="form-input form-input--center form-input--code"
                  placeholder="000000"
                  maxLength="6"
                  required
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  title="Enter the 6-digit code from your authenticator app"
                />
              </div>
            </form>

            <div className="info-box info-box--info mt-4">
              <p className="info-box__content">
                The code changes every 30 seconds. If it doesn't work, wait for
                a new code.
              </p>
            </div>
          </div>
        );

      case 4: // Backup Codes
        return (
          <div>
            <div className="step-header">
              <Key className="icon--medium mx-auto mb-4" />
              <h2 className="step-title">Save Your Backup Codes</h2>
              <p className="step-description">
                Keep these codes safe. You'll need them if you lose access to
                your authenticator.
              </p>
            </div>

            {setupData.twoFactorSetup?.backupCodes && (
              <BackupCodes
                codes={setupData.twoFactorSetup.backupCodes}
                onDownload={() => {
                  console.info("[AdminSetup] Backup codes downloaded");
                }}
                onContinue={handleNext} // ✅ Use handleNext for proper flow
              />
            )}
          </div>
        );

      case 5: // Complete
        return (
          <div className="text-center">
            <CheckCircle className="icon--large mx-auto mb-6" />
            <h2 className="step-title">Setup Complete!</h2>
            <p className="step-description">
              Your admin panel is ready to use. You can now manage users,
              products, and system settings.
            </p>

            <div className="info-box info-box--success mb-8">
              <h3 className="info-box__title mb-4">Next Steps:</h3>
              <ul className="info-box__list" role="list">
                <li className="info-box__list-item">
                  Review and configure system settings
                </li>
                <li className="info-box__list-item">
                  Create additional admin accounts as needed
                </li>
                <li className="info-box__list-item">
                  Set up notification preferences
                </li>
                <li className="info-box__list-item">
                  Configure security policies
                </li>
              </ul>
            </div>

            <div className="setup-complete-actions">
              <button
                onClick={() => {
                  // ✅ Navigate to login instead of dashboard since user needs to login
                  window.location.href = "/admin/login";
                }}
                className="btn btn--success btn--large"
              >
                Go to Admin Login
              </button>

              <button
                onClick={() => {
                  // Log successful setup completion and download summary
                  const setupSummary = `Admin Panel Setup Summary
Generated: ${new Date().toLocaleString()}

Setup Details:
- Admin Email: ${formData.email}
- Admin Name: ${formData.firstName} ${formData.lastName}
- 2FA Enabled: Yes
- Backup Codes Generated: Yes
- Setup Completed: ${new Date().toLocaleString()}

Next Steps:
1. Log in to your admin account
2. Review system settings
3. Create additional admin accounts if needed
4. Configure security policies`;

                  const blob = new Blob([setupSummary], { type: "text/plain" });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `admin-setup-summary-${Date.now()}.txt`;
                  a.click();
                  window.URL.revokeObjectURL(url);

                  console.info("[AdminSetup] Setup completed successfully", {
                    timestamp: new Date().toISOString(),
                    adminEmail: formData.email,
                  });
                }}
                className="btn btn--link"
                type="button"
              >
                Download Setup Summary
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="error-state">
            <AlertCircle className="icon--large mx-auto mb-4" />
            <h2>Invalid Step</h2>
            <p>Something went wrong with the setup process.</p>
            <button
              onClick={() => setCurrentStep(0)}
              className="btn btn--secondary"
            >
              Restart Setup
            </button>
          </div>
        );
    }
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !loading && currentStep > 0 && currentStep < 5) {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName !== "BUTTON") {
          handleNext();
        }
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, [loading, currentStep]);

  return (
    <div className={`admin-setup ${darkMode ? "dark-mode" : ""}`}>
      <div className="admin-setup__container">
        <div className="admin-setup__card">
          {/* Skip to content link for screen readers */}
          <a href="#step-content" className="sr-only focus:not-sr-only">
            Skip to main content
          </a>

          {/* Progress Steps */}
          <ProgressSteps currentStep={currentStep} steps={steps} />

          {/* Error Display */}
          {error && (
            <div className="error-display" role="alert" aria-live="assertive">
              <AlertCircle className="error-display__icon icon--small" />
              <span className="error-display__text">{error}</span>
              <button
                onClick={() => setError(null)}
                className="error-display__close"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Step Content */}
          <main id="step-content" className="step-content">
            {renderStepContent()}
          </main>

          {/* Navigation */}
          {currentStep > 0 && currentStep < 5 && (
            <nav className="navigation" aria-label="Setup navigation">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={loading}
                className="btn btn--secondary"
                type="button"
              >
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={loading}
                className="btn btn--primary"
                type="button"
              >
                {loading ? (
                  <>
                    <RefreshCw className="icon--small icon--spin" />
                    <span>Processing...</span>
                    <span className="sr-only">
                      Please wait while we process your request
                    </span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ChevronRight className="icon--small" />
                  </>
                )}
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          error={toast.error}
          onClose={() => setToast(null)}
        />
      )}

      {/* Loading overlay for better UX during transitions */}
      {loading && currentStep > 0 && (
        <div className="loading-overlay" aria-hidden="true">
          <div className="loading-spinner">
            <RefreshCw className="icon--large icon--spin" />
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminSetup;

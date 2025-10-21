import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminService } from "../../services/adminService";
import { useAdminAuthStore } from "./store/useAdminAuthStore";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Smartphone,
  Download,
  Copy,
  Check,
  ArrowRight,
  Loader,
  HelpCircle,
} from "lucide-react";
import "../backend/styles/adminInviteRegistration.css";

const AdminInviteRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);

  // Token and invite data
  const [inviteToken, setInviteToken] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [inviteDetails, setInviteDetails] = useState(null);

  // Form data - FIXED: Added security questions
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    emailCode: "",
    totpCode: "",
    securityQuestions: [
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
  });

  // 2FA Setup data
  const [twoFactorData, setTwoFactorData] = useState({
    qrCode: "",
    secret: "",
    backupCodes: [],
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [downloadedCodes, setDownloadedCodes] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false);

  // Suggested security questions
  const suggestedQuestions = [
    "What was the name of your first pet?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What is your favorite book?",
    "What was your childhood nickname?",
  ];

  // Step 1: Validate invite token on mount
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setInviteToken(token);
      validateToken(token);
    } else {
      setMessage({
        text: "Invalid invite link. Please check your email for the correct link.",
        type: "error",
      });
      setValidating(false);
    }
  }, [searchParams]);

  // Password strength calculator
  useEffect(() => {
    if (formData.password) {
      calculatePasswordStrength(formData.password);
    }
  }, [formData.password]);

  const validateToken = async (token) => {
    try {
      setValidating(true);
      setErrors({});

      const response = await AdminService.validateInviteToken(token);

      // FIXED: Handle both nested and flat response structures
      const data = response?.data || response;

      if (
        response.success ||
        data.registrationToken ||
        response.registrationToken
      ) {
        setRegistrationToken(
          data.registrationToken || response.registrationToken
        );
        setInviteDetails(data.inviteDetails || response.inviteDetails);
        setCurrentStep(2);
        setMessage({
          text: "Invite validated successfully! Please complete your registration.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      setMessage({
        text: error.message || "Invalid or expired invite link",
        type: "error",
      });
    } finally {
      setValidating(false);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 12) strength += 25;
    if (password.length >= 16) strength += 10;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    setPasswordStrength(Math.min(strength, 100));
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 12) errors.push("At least 12 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("One special character");
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSecurityQuestionChange = (index, field, value) => {
    setFormData((prev) => {
      const newQuestions = [...prev.securityQuestions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return { ...prev, securityQuestions: newQuestions };
    });

    if (errors[`securityQuestion${index}`]) {
      setErrors((prev) => ({ ...prev, [`securityQuestion${index}`]: "" }));
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors.join(", ");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // FIXED: Validate security questions if provided
    if (showSecurityQuestions) {
      const filledQuestions = formData.securityQuestions.filter(
        (sq) => sq.question.trim() && sq.answer.trim()
      );

      filledQuestions.forEach((sq, index) => {
        if (sq.question.trim().length < 10) {
          newErrors[`securityQuestion${index}`] =
            "Question must be at least 10 characters";
        }
        if (sq.answer.trim().length < 2) {
          newErrors[`securityAnswer${index}`] =
            "Answer must be at least 2 characters";
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // FIXED: Prepare registration data with optional security questions
      const registrationData = {
        registrationToken,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        password: formData.password,
      };

      // Only include non-empty security questions
      if (showSecurityQuestions) {
        const validQuestions = formData.securityQuestions.filter(
          (sq) => sq.question.trim() && sq.answer.trim()
        );

        if (validQuestions.length > 0) {
          registrationData.securityQuestions = validQuestions.map((sq) => ({
            question: sq.question.trim(),
            answer: sq.answer.trim(),
          }));
        }
      }

      const response = await AdminService.completeRegistration(
        registrationData
      );

      // FIXED: Handle nested response structure
      const data = response?.data || response;

      if (
        response.success ||
        data.verificationToken ||
        response.verificationToken
      ) {
        setVerificationToken(
          data.verificationToken || response.verificationToken
        );
        setCurrentStep(3);
        setMessage({
          text: "Registration successful! Please verify your email.",
          type: "success",
        });
      } else {
        throw new Error(
          data.message || response.message || "Registration failed"
        );
      }
    } catch (error) {
      console.error("Registration failed:", error);

      // FIXED: Extract error details properly
      const errorData =
        error.responseData?.error || error.response?.data?.error || {};
      const errorMessage =
        errorData.message ||
        error.message ||
        "Registration failed. Please try again.";
      const errorDetails = errorData.details || [];

      setMessage({
        text: errorMessage,
        type: "error",
      });

      if (errorDetails.length > 0) {
        const fieldErrors = {};
        errorDetails.forEach((detail) => {
          if (typeof detail === "string") {
            if (detail.toLowerCase().includes("password")) {
              fieldErrors.password = detail;
            } else if (detail.toLowerCase().includes("email")) {
              fieldErrors.email = detail;
            }
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async (e) => {
    e.preventDefault();

    if (!formData.emailCode || formData.emailCode.length !== 6) {
      setErrors({ emailCode: "Please enter a valid 6-digit code" });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await AdminService.verifyRegistrationEmail({
        // Changed
        setupToken: verificationToken,
        emailCode: formData.emailCode,
      });

      const data = response?.data || response;

      if (response.success || data.setupToken) {
        setSetupToken(data.setupToken);
        setTwoFactorData({
          qrCode: data.twoFactorSetup?.qrCode || "",
          secret: data.twoFactorSetup?.secret || "",
          backupCodes: data.twoFactorSetup?.backupCodes || [],
        });
        setCurrentStep(4);
        setMessage({
          text: "Email verified! Please set up 2FA.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Email verification failed:", error);
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handle2FASetup = async (e) => {
    e.preventDefault();

    if (!formData.totpCode || formData.totpCode.length !== 6) {
      setErrors({ totpCode: "Please enter a valid 6-digit code" });
      return;
    }

    if (!copiedCodes && !downloadedCodes) {
      setMessage({
        text: "Please save your backup codes before continuing",
        type: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await AdminService.completeRegistration2FA({
        setupToken,
        totpCode: formData.totpCode,
      });

      const data = response?.data || response;

      if (response.success || data.accessToken) {
        setMessage({
          text: "Registration complete! Redirecting...",
          type: "success",
        });
        setTimeout(() => navigate("/admin/home", { replace: true }), 2000);
      }
    } catch (error) {
      console.error("2FA setup failed:", error);
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendingCode(true);

      await AdminService.resendVerificationCode({
        verificationToken,
      });

      setMessage({
        text: "Verification code resent to your email",
        type: "success",
      });
    } catch (error) {
      console.error("Resend failed:", error);
      setMessage({
        text: error.message || "Failed to resend code",
        type: "error",
      });
    } finally {
      setResendingCode(false);
    }
  };

  const copyBackupCodes = () => {
    const codesText = twoFactorData.backupCodes.join("\n");
    navigator.clipboard.writeText(codesText);
    setCopiedCodes(true);
    setMessage({ text: "Backup codes copied to clipboard", type: "success" });
  };

  const downloadBackupCodes = () => {
    const codesText = twoFactorData.backupCodes.join("\n");
    const blob = new Blob([codesText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "admin-backup-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedCodes(true);
    setMessage({ text: "Backup codes downloaded", type: "success" });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "#ef4444";
    if (passwordStrength < 70) return "#f59e0b";
    return "#10b981";
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  if (validating) {
    return (
      <div className="admin-invite-container">
        <div className="invite-card">
          <div className="loading-state">
            <Loader className="spinner" size={48} />
            <h2>Validating Invite...</h2>
            <p>Please wait while we verify your invitation</p>
          </div>
        </div>
      </div>
    );
  }

  if (message.type === "error" && currentStep === 1) {
    return (
      <div className="admin-invite-container">
        <div className="invite-card">
          <div className="error-state">
            <XCircle size={64} className="error-icon" />
            <h2>Invalid Invite</h2>
            <p>{message.text}</p>
            <button
              className="btn btn--primary"
              onClick={() => navigate("/admin/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-invite-container">
      <div className="invite-card">
        {/* Progress Steps */}
        <div className="progress-steps">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`progress-step ${
                currentStep >= step ? "active" : ""
              } ${currentStep > step ? "completed" : ""}`}
            >
              <div className="step-circle">
                {currentStep > step ? <Check size={16} /> : step}
              </div>
              <div className="step-label">
                {step === 1 && "Validate"}
                {step === 2 && "Register"}
                {step === 3 && "Verify"}
                {step === 4 && "2FA Setup"}
              </div>
            </div>
          ))}
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert--${message.type}`}>
            {message.type === "success" && <CheckCircle size={20} />}
            {message.type === "error" && <XCircle size={20} />}
            {message.type === "warning" && <AlertCircle size={20} />}
            <span>{message.text}</span>
            <button
              className="alert-close"
              onClick={() => setMessage({ text: "", type: "" })}
            >
              ×
            </button>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {currentStep === 2 && (
          <div className="step-content">
            <div className="step-header">
              <User className="step-icon" size={32} />
              <h2>Complete Your Registration</h2>
              <p>Create your admin account</p>
            </div>

            {inviteDetails && (
              <div className="invite-info">
                <div className="info-item">
                  <Mail size={16} />
                  <span>{inviteDetails.email}</span>
                </div>
                <div className="info-item">
                  <Shield size={16} />
                  <span className="role-badge">{inviteDetails.role}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleRegistration} className="registration-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    First Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? "error" : ""}
                    placeholder="Emmanuel"
                  />
                  {errors.firstName && (
                    <span className="error-text">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    Last Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? "error" : ""}
                    placeholder="Babatunde"
                  />
                  {errors.lastName && (
                    <span className="error-text">{errors.lastName}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password <span className="required">*</span>
                </label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? "error" : ""}
                    placeholder="Enter secure password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div
                        className="strength-fill"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor(),
                        }}
                      />
                    </div>
                    <span
                      className="strength-label"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                )}

                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}

                <div className="password-requirements">
                  <p>Password must contain:</p>
                  <ul>
                    <li className={formData.password.length >= 12 ? "met" : ""}>
                      At least 12 characters
                    </li>
                    <li
                      className={/[A-Z]/.test(formData.password) ? "met" : ""}
                    >
                      One uppercase letter
                    </li>
                    <li
                      className={/[a-z]/.test(formData.password) ? "met" : ""}
                    >
                      One lowercase letter
                    </li>
                    <li
                      className={/[0-9]/.test(formData.password) ? "met" : ""}
                    >
                      One number
                    </li>
                    <li
                      className={
                        /[^A-Za-z0-9]/.test(formData.password) ? "met" : ""
                      }
                    >
                      One special character
                    </li>
                  </ul>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password <span className="required">*</span>
                </label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? "error" : ""}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword}</span>
                )}
              </div>

              {/* FIXED: Security Questions Section */}
              <div
                className="form-group"
                style={{
                  background: "var(--bg-secondary)",
                  padding: "var(--spacing-lg)",
                  borderRadius: "var(--border-radius-md)",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowSecurityQuestions(!showSecurityQuestions)
                  }
                  className="btn btn--text"
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    marginBottom: showSecurityQuestions
                      ? "var(--spacing-md)"
                      : 0,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <HelpCircle size={16} />
                    Security Questions (Optional)
                  </span>
                  <span>{showSecurityQuestions ? "−" : "+"}</span>
                </button>

                {showSecurityQuestions && (
                  <div>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        marginBottom: "var(--spacing-md)",
                      }}
                    >
                      Add up to 3 security questions for account recovery
                    </p>
                    {formData.securityQuestions.map((sq, index) => (
                      <div
                        key={index}
                        style={{ marginBottom: "var(--spacing-md)" }}
                      >
                        <select
                          value={sq.question}
                          onChange={(e) =>
                            handleSecurityQuestionChange(
                              index,
                              "question",
                              e.target.value
                            )
                          }
                          style={{ marginBottom: "8px" }}
                        >
                          <option value="">Select a question...</option>
                          {suggestedQuestions.map((q, i) => (
                            <option key={i} value={q}>
                              {q}
                            </option>
                          ))}
                          <option value="custom">Custom question...</option>
                        </select>

                        {sq.question === "custom" && (
                          <input
                            type="text"
                            placeholder="Enter your custom question (min 10 characters)"
                            onChange={(e) =>
                              handleSecurityQuestionChange(
                                index,
                                "question",
                                e.target.value
                              )
                            }
                            style={{ marginBottom: "8px" }}
                          />
                        )}

                        {sq.question && sq.question !== "custom" && (
                          <input
                            type="text"
                            placeholder="Your answer"
                            value={sq.answer}
                            onChange={(e) =>
                              handleSecurityQuestionChange(
                                index,
                                "answer",
                                e.target.value
                              )
                            }
                          />
                        )}
                        {errors[`securityQuestion${index}`] && (
                          <span className="error-text">
                            {errors[`securityQuestion${index}`]}
                          </span>
                        )}
                        {errors[`securityAnswer${index}`] && (
                          <span className="error-text">
                            {errors[`securityAnswer${index}`]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--large"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="spinner" size={20} />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Email Verification */}
        {currentStep === 3 && (
          <div className="step-content">
            <div className="step-header">
              <Mail className="step-icon" size={32} />
              <h2>Verify Your Email</h2>
              <p>Enter the 6-digit code sent to your email</p>
            </div>

            <form
              onSubmit={handleEmailVerification}
              className="verification-form"
            >
              <div className="form-group">
                <label htmlFor="emailCode">Verification Code</label>
                <input
                  type="text"
                  id="emailCode"
                  name="emailCode"
                  value={formData.emailCode}
                  onChange={handleInputChange}
                  className={`code-input ${errors.emailCode ? "error" : ""}`}
                  placeholder="000000"
                  maxLength="6"
                />
                {errors.emailCode && (
                  <span className="error-text">{errors.emailCode}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--large"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="spinner" size={20} />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Email
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn--text"
                onClick={handleResendCode}
                disabled={resendingCode}
              >
                {resendingCode ? "Sending..." : "Resend Code"}
              </button>
            </form>
          </div>
        )}

        {/* Step 4: 2FA Setup */}
        {currentStep === 4 && (
          <div className="step-content">
            <div className="step-header">
              <Shield className="step-icon" size={32} />
              <h2>Set Up Two-Factor Authentication</h2>
              <p>Secure your account with 2FA</p>
            </div>

            <div className="twofa-setup">
              <div className="qr-section">
                <h3>
                  <Smartphone size={20} />
                  Scan QR Code
                </h3>
                <p>
                  Use an authenticator app like Google Authenticator or Authy
                </p>

                {twoFactorData.qrCode && (
                  <div className="qr-code-container">
                    <img
                      src={twoFactorData.qrCode}
                      alt="2FA QR Code"
                      className="qr-code"
                    />
                  </div>
                )}

                <div className="secret-key">
                  <p>Or enter this key manually:</p>
                  <code>{twoFactorData.secret}</code>
                </div>
              </div>

              <div className="backup-codes-section">
                <h3>
                  <Download size={20} />
                  Backup Codes
                </h3>
                <div className="backup-codes-warning">
                  <AlertCircle size={20} />
                  <p>
                    Save these codes in a secure location. You can use them to
                    access your account if you lose your device.
                  </p>
                </div>

                <div className="backup-codes-list">
                  {twoFactorData.backupCodes.map((code, index) => (
                    <div key={index} className="backup-code">
                      <span>{code}</span>
                    </div>
                  ))}
                </div>

                <div className="backup-codes-actions">
                  <button
                    type="button"
                    className={`btn btn--secondary ${
                      copiedCodes ? "success" : ""
                    }`}
                    onClick={copyBackupCodes}
                  >
                    {copiedCodes ? (
                      <>
                        <Check size={20} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={20} />
                        Copy Codes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`btn btn--secondary ${
                      downloadedCodes ? "success" : ""
                    }`}
                    onClick={downloadBackupCodes}
                  >
                    {downloadedCodes ? (
                      <>
                        <Check size={20} />
                        Downloaded
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>

              <form onSubmit={handle2FASetup} className="verification-form">
                <div className="form-group">
                  <label htmlFor="totpCode">Enter 6-Digit Code from App</label>
                  <input
                    type="text"
                    id="totpCode"
                    name="totpCode"
                    value={formData.totpCode}
                    onChange={handleInputChange}
                    className={`code-input ${errors.totpCode ? "error" : ""}`}
                    placeholder="000000"
                    maxLength="6"
                  />
                  {errors.totpCode && (
                    <span className="error-text">{errors.totpCode}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn--primary btn--large"
                  disabled={loading || (!copiedCodes && !downloadedCodes)}
                >
                  {loading ? (
                    <>
                      <Loader className="spinner" size={20} />
                      Completing Setup...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInviteRegistration;

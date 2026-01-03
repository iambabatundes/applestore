// Auth.jsx - Unified Login/Register Component
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  parsePhoneNumberFromString,
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";
import { useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CountdownTimer from "./common/countdownTimer";
import "./styles/auth.css";
import {
  discoverAccount,
  authenticateWithPassword,
  verifyRegistrationCode,
  completeProfile,
  resendCode,
} from "../../services/authService";
import { authStore, loginWithJwt } from "../../services/authService";
import { getErrorMessage } from "./utils/errorUtils";

const getCountryData = () => {
  const countries = getCountries();
  return countries
    .map((countryCode) => {
      try {
        const callingCode = getCountryCallingCode(countryCode);
        return {
          code: countryCode,
          callingCode: callingCode,
          name: new Intl.DisplayNames(["en"], { type: "region" }).of(
            countryCode
          ),
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Validation Schemas
const identifierSchema = Yup.object({
  identifier: Yup.string()
    .required("Email or phone number is required")
    .test(
      "email-or-phone",
      "Enter a valid email or phone number",
      function (value) {
        if (!value) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) return true;
        const parsed = parsePhoneNumberFromString(value, "NG");
        return parsed && parsed.isValid();
      }
    ),
});

const passwordSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: Yup.boolean(),
});

const verificationSchema = Yup.object({
  code: Yup.string()
    .required("Verification code is required")
    .matches(/^\d{6}$/, "Code must be exactly 6 digits"),
});

const profileSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(255, "First name is too long"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(255, "Last name is too long"),
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(255, "Username is too long")
    .matches(
      /^[a-z0-9_-]+$/,
      "Username can only contain lowercase letters, numbers, hyphens, and underscores"
    ),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
});

export default function Auth() {
  // State for flow control
  const [step, setStep] = useState("identifier"); // identifier, password, verify, complete
  const [sessionToken, setSessionToken] = useState(null);
  const [identifierType, setIdentifierType] = useState(null);
  const [accountExists, setAccountExists] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Verification state
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  // Phone number state
  const [selectedCountry, setSelectedCountry] = useState("NG");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [phoneNumberInfo, setPhoneNumberInfo] = useState({
    callingCode: null,
    country: null,
    isPhone: false,
  });

  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useStore(authStore);

  // Initialize country data
  useEffect(() => {
    const countries = getCountryData();
    setCountryData(countries);
    const defaultCountry = countries.find((c) => c.code === "NG");
    if (defaultCountry) {
      setPhoneNumberInfo({
        callingCode: defaultCountry.callingCode,
        country: defaultCountry.code,
        isPhone: false,
      });
    }
  }, []);

  // Handle identifier input changes (detect email vs phone)
  const handleIdentifierChange = (e, formik) => {
    const value = e.target.value;
    formik.setFieldValue("identifier", value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setPhoneNumberInfo((prev) => ({ ...prev, isPhone: false }));
      return;
    }

    const phoneRegex = /^[\d\s+()-]+$/;
    if (phoneRegex.test(value) && value.length > 0) {
      try {
        const parsed = parsePhoneNumberFromString(value, selectedCountry);
        if (parsed && parsed.isValid()) {
          const countryInfo = countryData.find(
            (c) => c.code === parsed.country
          );
          setPhoneNumberInfo({
            callingCode: parsed.countryCallingCode,
            country: parsed.country,
            isPhone: true,
          });
          setSelectedCountry(parsed.country);
        } else {
          const currentCountry = countryData.find(
            (c) => c.code === selectedCountry
          );
          setPhoneNumberInfo({
            callingCode: currentCountry?.callingCode || null,
            country: selectedCountry,
            isPhone: value.length > 0,
          });
        }
      } catch {
        const currentCountry = countryData.find(
          (c) => c.code === selectedCountry
        );
        setPhoneNumberInfo({
          callingCode: currentCountry?.callingCode || null,
          country: selectedCountry,
          isPhone: value.length > 0,
        });
      }
    } else {
      setPhoneNumberInfo((prev) => ({ ...prev, isPhone: false }));
    }
  };

  // STEP 1: Identifier Discovery
  const identifierFormik = useFormik({
    initialValues: { identifier: "" },
    validationSchema: identifierSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await discoverAccount({
          identifier: values.identifier,
        });

        setSessionToken(response.sessionToken);
        setIdentifierType(response.identifierType);
        setAccountExists(response.accountExists);

        if (response.accountExists) {
          // Existing user - go to password
          setUserInfo(response.userInfo);
          setStep("password");
        } else {
          // New user - go to verification
          setCanResend(false);
          setResendCooldown(response.expiresInMinutes * 60 || 600);
          setStep("verify");
        }

        toast.success(response.message);
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            "Unable to process your request. Please try again."
          )
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // STEP 2A: Password Authentication (existing users)
  const passwordFormik = useFormik({
    initialValues: { password: "", rememberMe: false },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await authenticateWithPassword({
          sessionToken,
          password: values.password,
          rememberMe: values.rememberMe,
        });

        // Login successful - token already set by auth service
        toast.success(response.message || "Welcome back!");

        const redirectPath = state?.path || state?.from || "/";
        navigate(redirectPath, { replace: true });
      } catch (err) {
        const errorMsg = getErrorMessage(
          err,
          "Invalid credentials. Please try again."
        );
        setError(errorMsg);

        // Handle account lockout
        if (err.response?.status === 423) {
          toast.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  // STEP 2B: Verify Code (new users)
  const verificationFormik = useFormik({
    initialValues: { code: "" },
    validationSchema: verificationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await verifyRegistrationCode({
          sessionToken,
          code: values.code,
        });

        setSessionToken(response.sessionToken);
        toast.success(response.message);
        setStep("complete");
      } catch (err) {
        setError(
          getErrorMessage(err, "Invalid verification code. Please try again.")
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // STEP 3: Complete Profile (new users)
  const profileFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await completeProfile({
          sessionToken,
          ...values,
        });

        toast.success(response.message || "Registration successful!");

        // Auto-login with received token
        if (response.accessToken) {
          await loginWithJwt(response.accessToken, response.expiresIn || 900);
          const redirectPath = state?.path || state?.from || "/";
          navigate(redirectPath, { replace: true });
        } else {
          navigate("/login", { state: { registrationSuccess: true } });
        }
      } catch (err) {
        setError(
          getErrorMessage(err, "Registration failed. Please try again.")
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // Resend verification code
  const handleResendCode = async () => {
    if (!canResend) return;

    setLoading(true);
    setError("");

    try {
      const response = await resendCode({ sessionToken });
      toast.success(response.message || "Verification code resent.");
      setCanResend(false);
      setResendCooldown(response.expiresInMinutes * 60 || 600);
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to resend code. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <section className="auth-main">
      <div className="auth__container">
        {/* STEP 1: Identifier Input */}
        {step === "identifier" && (
          <div className="auth__form">
            <h1>Sign in or create account</h1>
            <form onSubmit={identifierFormik.handleSubmit}>
              <label htmlFor="identifier" className="auth__label">
                Enter mobile number or email
              </label>

              <div className="contact-input-container">
                <div className="input-wrapper">
                  {phoneNumberInfo.isPhone && phoneNumberInfo.callingCode && (
                    <button
                      type="button"
                      className="country-code-overlay"
                      onClick={() =>
                        setShowCountryDropdown(!showCountryDropdown)
                      }
                    >
                      +{phoneNumberInfo.callingCode} {phoneNumberInfo.country}
                    </button>
                  )}

                  <input
                    id="identifier"
                    type="text"
                    name="identifier"
                    placeholder="Enter mobile number or email"
                    {...identifierFormik.getFieldProps("identifier")}
                    onChange={(e) =>
                      handleIdentifierChange(e, identifierFormik)
                    }
                    className={`auth__input ${
                      phoneNumberInfo.isPhone ? "with-country-code" : ""
                    }`}
                    style={
                      phoneNumberInfo.isPhone ? { paddingLeft: "120px" } : {}
                    }
                  />

                  {showCountryDropdown && (
                    <div className="country-dropdown">
                      <div className="country-dropdown-content">
                        {countryData.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            className={`country-option ${
                              selectedCountry === country.code ? "selected" : ""
                            }`}
                            onClick={() => {
                              setSelectedCountry(country.code);
                              setPhoneNumberInfo({
                                callingCode: country.callingCode,
                                country: country.code,
                                isPhone: phoneNumberInfo.isPhone,
                              });
                              setShowCountryDropdown(false);
                            }}
                          >
                            <span className="country-flag">{country.code}</span>
                            <span className="country-name">{country.name}</span>
                            <span className="country-calling-code">
                              +{country.callingCode}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {identifierFormik.touched.identifier &&
                identifierFormik.errors.identifier && (
                  <div className="error-message">
                    {identifierFormik.errors.identifier}
                  </div>
                )}

              <button type="submit" className="auth__btn" disabled={loading}>
                {loading ? "Processing..." : "Continue"}
              </button>

              {error && <p className="error-message">{error}</p>}

              <div className="terms-text">
                By continuing, you agree to our Conditions of Use and Privacy
                Notice.
              </div>
            </form>
          </div>
        )}

        {/* STEP 2A: Password (existing user) */}
        {step === "password" && (
          <div className="auth__form">
            <h1>
              Welcome back{userInfo?.firstName ? `, ${userInfo.firstName}` : ""}
              !
            </h1>
            <p className="signing-in-as">
              Signing in as: {identifierFormik.values.identifier}
            </p>

            <form onSubmit={passwordFormik.handleSubmit}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                {...passwordFormik.getFieldProps("password")}
                className="auth__input"
              />
              {passwordFormik.touched.password &&
                passwordFormik.errors.password && (
                  <div className="error-message">
                    {passwordFormik.errors.password}
                  </div>
                )}

              <label className="remember-me-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  {...passwordFormik.getFieldProps("rememberMe")}
                />
                Keep me signed in
              </label>

              <button type="submit" className="auth__btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>

              {error && <p className="error-message">{error}</p>}

              <button
                type="button"
                className="change-account-btn"
                onClick={() => {
                  setStep("identifier");
                  setSessionToken(null);
                  setUserInfo(null);
                }}
              >
                Use a different account
              </button>
            </form>
          </div>
        )}

        {/* STEP 2B: Verification (new user) */}
        {step === "verify" && (
          <div className="auth__form">
            <h1>Verify your {identifierType}</h1>
            <p>We sent a verification code to:</p>
            <div className="contact-display">
              {identifierFormik.values.identifier}
            </div>

            <form onSubmit={verificationFormik.handleSubmit}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                {...verificationFormik.getFieldProps("code")}
                onChange={(e) =>
                  verificationFormik.setFieldValue(
                    "code",
                    e.target.value.replace(/\D/g, "")
                  )
                }
                className="auth__input verification-input"
              />
              {verificationFormik.touched.code &&
                verificationFormik.errors.code && (
                  <div className="error-message">
                    {verificationFormik.errors.code}
                  </div>
                )}

              <button
                type="submit"
                className="auth__btn"
                disabled={
                  loading || verificationFormik.values.code.length !== 6
                }
              >
                {loading ? "Verifying..." : "Verify"}
              </button>

              <div className="resend-section">
                <button
                  type="button"
                  className="resend-link"
                  onClick={handleResendCode}
                  disabled={!canResend}
                >
                  Resend code
                </button>
                {!canResend && (
                  <CountdownTimer
                    initialSeconds={resendCooldown}
                    onExpire={() => setCanResend(true)}
                  />
                )}
              </div>

              {error && <p className="error-message">{error}</p>}
            </form>

            <button
              type="button"
              className="change-contact-btn"
              onClick={() => setStep("identifier")}
            >
              Change {identifierType}
            </button>
          </div>
        )}

        {/* STEP 3: Complete Profile (new user) */}
        {step === "complete" && (
          <div className="auth__form">
            <h1>Create your account</h1>
            <div className="verified-contact">
              ✓ {identifierType === "email" ? "Email" : "Phone"} verified:{" "}
              {identifierFormik.values.identifier}
            </div>

            <form onSubmit={profileFormik.handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                {...profileFormik.getFieldProps("firstName")}
                className="auth__input"
              />
              {profileFormik.touched.firstName &&
                profileFormik.errors.firstName && (
                  <div className="error-message">
                    {profileFormik.errors.firstName}
                  </div>
                )}

              <input
                type="text"
                name="lastName"
                placeholder="Last name (optional)"
                {...profileFormik.getFieldProps("lastName")}
                className="auth__input"
              />

              <input
                type="text"
                name="username"
                placeholder="Username"
                {...profileFormik.getFieldProps("username")}
                className="auth__input"
              />
              {profileFormik.touched.username &&
                profileFormik.errors.username && (
                  <div className="error-message">
                    {profileFormik.errors.username}
                  </div>
                )}

              <input
                type="password"
                name="password"
                placeholder="Create password"
                {...profileFormik.getFieldProps("password")}
                className="auth__input"
              />
              {profileFormik.touched.password &&
                profileFormik.errors.password && (
                  <div className="error-message">
                    {profileFormik.errors.password}
                  </div>
                )}

              <button type="submit" className="auth__btn" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </button>

              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        )}

        <hr />
        <div className="auth-footer-text">
          {accountExists ? "Don't have" : "Already have"} an account?{" "}
          <button
            type="button"
            className="auth-footer-link"
            onClick={() => {
              setStep("identifier");
              setSessionToken(null);
              setAccountExists(false);
              setUserInfo(null);
              identifierFormik.resetForm();
            }}
          >
            Start over
          </button>
        </div>
      </div>
    </section>
  );
}

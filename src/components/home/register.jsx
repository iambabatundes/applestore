// Register.jsx - Improved version with better error handling
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  parsePhoneNumberFromString,
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";
import { useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import { useStore } from "zustand";
import { toast } from "react-toastify";
import CountdownTimer from "./common/countdownTimer";
import "./styles/register.css";
import {
  initiateRegistration,
  verifyContact,
  completeRegistration,
  resendVerificationCode,
} from "../../services/userServices";
import { authStore, loginWithJwt } from "../../services/authService";
import { getErrorMessage, getErrorText } from "./utils/errorUtils";
import * as Yup from "yup";

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

const contactValidationSchema = Yup.object({
  contact: Yup.string()
    .required("Email or phone number is required")
    .test(
      "email-or-phone",
      "Enter a valid email or phone number",
      function (value) {
        if (!value) return false;

        // Check if it's a valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) return true;

        // Check if it's a valid phone number
        const parsed = parsePhoneNumberFromString(value, "NG");
        return parsed && parsed.isValid();
      }
    ),
});

const createProfileValidationSchema = (contactType) => {
  return Yup.object({
    firstName: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .max(255, "First name must be less than 255 characters")
      .required("First name is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(255, "Username must be less than 255 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    additionalContact: Yup.string().test(
      "additional-contact",
      contactType === "email"
        ? "Enter a valid phone number"
        : "Enter a valid email address",
      function (value) {
        if (!value) return true; // Optional field

        if (contactType === "email") {
          // User verified email, so additional contact should be phone
          const parsed = parsePhoneNumberFromString(value, "NG");
          return parsed && parsed.isValid();
        } else {
          // User verified phone, so additional contact should be email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        }
      }
    ),
  });
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState({ value: "", type: "" });
  const [registrationToken, setRegistrationToken] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);

  const [phoneNumberInfo, setPhoneNumberInfo] = useState({
    callingCode: null,
    country: null,
    isPhone: false,
  });
  const [selectedCountry, setSelectedCountry] = useState("NG"); // Default to Nigeria
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countryData, setCountryData] = useState([]);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useStore(authStore);

  useEffect(() => {
    const countries = getCountryData();
    setCountryData(countries);

    // Set default country info
    const defaultCountry = countries.find((c) => c.code === "NG");
    if (defaultCountry) {
      setPhoneNumberInfo({
        callingCode: defaultCountry.callingCode,
        country: defaultCountry.code,
        isPhone: false,
      });
    }
  }, []);

  const handleContactChange = (e) => {
    const value = e.target.value;
    contactFormik.setFieldValue("contact", value);

    // Check if it's an email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      setPhoneNumberInfo((prev) => ({ ...prev, isPhone: false }));
      return;
    }

    // Check if it looks like a phone number (contains only digits, spaces, +, -, (, ))
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
          // Show current selected country info for partial numbers
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
        // Fallback to selected country
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

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    const country = countryData.find((c) => c.code === countryCode);
    if (country) {
      setPhoneNumberInfo({
        callingCode: country.callingCode,
        country: countryCode,
        isPhone: phoneNumberInfo.isPhone,
      });
    }
    setShowCountryDropdown(false);

    // Re-validate current input with new country
    const currentValue = contactFormik.values.contact;
    if (currentValue && !currentValue.includes("@")) {
      handleContactChange({ target: { value: currentValue } });
    }
  };

  const contactFormik = useFormik({
    initialValues: { contact: "" },
    validationSchema: contactValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setLoading(true);
      setError("");

      try {
        // Determine if contact is email or phone
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(values.contact);

        let contactData = {};
        if (isEmail) {
          contactData = { email: values.contact };
          setContactInfo({ value: values.contact, type: "email" });
        } else {
          // It's a phone number, normalize it with selected country
          const parsed = parsePhoneNumberFromString(
            values.contact,
            selectedCountry
          );
          if (parsed && parsed.isValid()) {
            contactData = { phoneNumber: parsed.number };
            setContactInfo({ value: parsed.number, type: "phone" });
          } else {
            throw new Error("Invalid phone number format");
          }
        }

        const response = await initiateRegistration(contactData);

        setRegistrationToken(response.registrationToken);
        setCanResend(false);
        setVerificationCode("");
        setResendCooldown((response.expiresInMinutes || 10) * 60);

        toast.success(response.message || "Verification code sent.");
        setStep(2);
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            "Failed to send verification code. Please try again."
          )
        );
      } finally {
        setLoading(false);
        setIsSubmitting(false);
      }
    },
  });

  const profileFormik = useFormik({
    initialValues: {
      firstName: "",
      username: "",
      password: "",
      additionalContact: "",
    },
    validationSchema: createProfileValidationSchema(contactInfo.type),
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const profileData = {
          registrationToken,
          firstName: values.firstName,
          username: values.username,
          password: values.password,
        };

        // Add the verified contact info
        if (contactInfo.type === "email") {
          profileData.email = contactInfo.value;
          // Add phone number if provided
          if (values.additionalContact) {
            const parsed = parsePhoneNumberFromString(
              values.additionalContact,
              selectedCountry
            );
            if (parsed && parsed.isValid()) {
              profileData.phoneNumber = parsed.number;
            }
          }
        } else {
          profileData.phoneNumber = contactInfo.value;
          // Add email if provided
          if (values.additionalContact) {
            profileData.email = values.additionalContact;
          }
        }

        const response = await completeRegistration(profileData);

        console.log("Registration response:", response);
        toast.success(response.message || "Registration complete!");

        if (response.accessToken) {
          try {
            console.log("Attempting auto-login with registration token");

            // IMPROVED: Use the user data from registration response
            // This avoids the need to fetch user data again
            const authState = authStore.getState();

            // Set the user data directly from registration response
            if (response.user) {
              authState.setUser(response.user);
            }

            // Now login with token - this should skip the getUserApi call
            // since we already have user data
            await loginWithJwt(response.accessToken, response.expiresIn || 900);

            console.log("Auto-login successful");

            // Determine redirect path
            const redirectPath = state?.path || state?.from || "/";
            console.log("Redirecting to:", redirectPath);

            navigate(redirectPath, { replace: true });
          } catch (loginError) {
            console.error("Auto-login failed:", loginError);

            // IMPROVED: More specific error handling
            if (
              loginError.code === "ECONNABORTED" ||
              loginError.message?.includes("timeout")
            ) {
              console.log("Login timeout - but registration was successful");
              toast.success("Registration successful! Redirecting to login...");
            } else {
              toast.warn(
                "Registration successful, but auto-login failed. Please login manually."
              );
            }

            // Always redirect to login with the intended path
            navigate("/login", {
              state: {
                path: state?.path || state?.from,
                registrationSuccess: true,
              },
              replace: true,
            });
          }
        } else {
          console.warn("No token received from registration");
          toast.success("Registration successful! Please login.");
          navigate("/login", {
            state: {
              path: state?.path || state?.from,
              registrationSuccess: true,
            },
            replace: true,
          });
        }
      } catch (err) {
        console.error("Registration error:", err);
        setError(
          getErrorMessage(err, "Registration failed. Please try again.")
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyContact({
        registrationToken,
        channel: contactInfo.type,
        code: verificationCode,
      });

      // Update registration token with verified contact
      setRegistrationToken(response.registrationToken);
      toast.success(response.message || "Contact verified successfully!");
      setStep(3);
    } catch (err) {
      setError(
        getErrorMessage(err, "Invalid verification code. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setLoading(true);
    setError("");

    try {
      const response = await resendVerificationCode({
        registrationToken,
        channel: contactInfo.type,
      });

      toast.info(response.message || "Verification code resent successfully.");
      setCanResend(false);
      setResendCooldown((response.expiresInMinutes || 10) * 60);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to resend verification code."));
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <section className="register-main">
      <div className="register__container">
        {/* Step 1: Enter Email or Phone */}
        {step === 1 && (
          <div className="register__form">
            <h1>Sign in or create account</h1>
            <form onSubmit={contactFormik.handleSubmit}>
              <label htmlFor="contact" className="register__label">
                Enter mobile number or email
              </label>

              <div className="contact-input-container">
                <div className="input-wrapper">
                  {/* Country Code Selector - overlaid on input for phone numbers */}
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
                    id="contact"
                    type="text"
                    name="contact"
                    placeholder="Enter mobile number or email"
                    {...contactFormik.getFieldProps("contact")}
                    onChange={handleContactChange}
                    className={`register__input ${
                      phoneNumberInfo.isPhone ? "with-country-code" : ""
                    }`}
                    style={
                      phoneNumberInfo.isPhone ? { paddingLeft: "120px" } : {}
                    }
                  />

                  {/* Country Dropdown */}
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
                            onClick={() => handleCountrySelect(country.code)}
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

              {contactFormik.touched.contact &&
                contactFormik.errors.contact && (
                  <div className="error-message">
                    {contactFormik.errors.contact}
                  </div>
                )}

              <button
                type="submit"
                className="register__btn"
                disabled={loading || isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : loading
                  ? "Sending code..."
                  : "Continue"}
              </button>

              {error && <p className="error-message">{error}</p>}

              <div className="terms-text">
                By continuing, you agree to our Conditions of Use and Privacy
                Notice.
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <div className="register__form">
            <h1>
              Verify{" "}
              {contactInfo.type === "email" ? "email address" : "phone number"}
            </h1>
            <p>We sent a verification code to:</p>
            <div className="contact-display">
              {contactInfo.type === "email"
                ? contactInfo.value
                : `${contactInfo.value
                    .slice(0, -4)
                    .replace(/./g, "*")}${contactInfo.value.slice(-4)}`}
            </div>

            <form onSubmit={handleVerifyCode}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                className="register__input verification-input"
              />

              <button
                type="submit"
                className="register__btn"
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>

              <div className="resend-section">
                <button
                  type="button"
                  className="resend-link"
                  onClick={handleResendCode}
                  disabled={loading || !canResend}
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
              onClick={() => setStep(1)}
            >
              Change{" "}
              {contactInfo.type === "email" ? "email address" : "phone number"}
            </button>
          </div>
        )}

        {/* Step 3: Complete Profile */}
        {step === 3 && (
          <div className="register__form">
            <h1>Create your account</h1>
            <div className="verified-contact">
              ✓ {contactInfo.type === "email" ? "Email" : "Phone"} verified:{" "}
              {contactInfo.value}
            </div>

            <form onSubmit={profileFormik.handleSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                {...profileFormik.getFieldProps("firstName")}
                className="register__input"
              />
              {profileFormik.touched.firstName &&
                profileFormik.errors.firstName && (
                  <div className="error-message">
                    {profileFormik.errors.firstName}
                  </div>
                )}

              <input
                type="text"
                name="username"
                placeholder="Username"
                {...profileFormik.getFieldProps("username")}
                className="register__input"
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
                placeholder="Password"
                {...profileFormik.getFieldProps("password")}
                className="register__input"
              />
              {profileFormik.touched.password &&
                profileFormik.errors.password && (
                  <div className="error-message">
                    {profileFormik.errors.password}
                  </div>
                )}

              {/* Additional contact field */}
              <input
                type="text"
                name="additionalContact"
                placeholder={
                  contactInfo.type === "email"
                    ? "Phone number (optional)"
                    : "Email address (optional)"
                }
                {...profileFormik.getFieldProps("additionalContact")}
                className="register__input"
              />
              {profileFormik.touched.additionalContact &&
                profileFormik.errors.additionalContact && (
                  <div className="error-message">
                    {profileFormik.errors.additionalContact}
                  </div>
                )}

              <button
                type="submit"
                className="register__btn"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        )}

        <hr />
        <div className="login-link">
          Already have an account?
          <Link
            to="/login"
            state={{ path: state?.path, from: location.pathname }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import CountdownTimer from "./common/countdownTimer";
import "./styles/register.css";
import {
  createUser,
  verifyUser,
  resendValidationCode,
} from "../../services/userServices";
import { loginWithJwt } from "../../services/authService";

const validationSchema = yup.object({
  firstName: yup.string().required("First Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone Number is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function Register() {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumberInfo, setPhoneNumberInfo] = useState({
    country: "",
    callingCode: "",
  });

  const { state } = useLocation();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      email: "",
      phoneNumber: "",
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        const response = await createUser(values);
        alert(response.data.message);
        setStep(2);
      } catch (err) {
        setError(
          err.response?.data || "Registration failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue("phoneNumber", value);

    const phoneNumber = parsePhoneNumberFromString(value, "NG");
    if (phoneNumber) {
      setPhoneNumberInfo({
        country: phoneNumber.country,
        callingCode: phoneNumber.countryCallingCode,
      });
    } else {
      setPhoneNumberInfo({ country: "", callingCode: "" });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await verifyUser(
        { email: formik.values.email },
        verificationCode
      );
      alert(response.data.message);
      if (response.status === 200) {
        // setStep(3);
        loginWithJwt(response.data.token);
        window.location = state ? state.path : "/";
      } else {
        setError(
          response.data.message ||
            "Verification failed. Please check your code and try again."
        );
      }
    } catch (ex) {
      setError(
        ex.response?.data?.message ||
          "Verification failed. Please check your code and try again."
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
      await resendValidationCode(formik.values.email);
      alert("Verification code resent successfully.");
      setCanResend(false);
    } catch (error) {
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTimerExpire = () => {
    setCanResend(true);
  };

  return (
    <section className="register-main">
      <div className="register__container">
        {step === 1 && (
          <form onSubmit={formik.handleSubmit} className="register__form">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="register__input"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error-message">{formik.errors.email}</div>
            ) : null}
            <div className="input-container-register">
              {phoneNumberInfo.callingCode && (
                <span className="country-code-register">
                  +{phoneNumberInfo.callingCode} {phoneNumberInfo.country}
                </span>
              )}
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formik.values.phoneNumber}
                onChange={handlePhoneChange}
                className={`register__input ${
                  phoneNumberInfo.callingCode ? "with-code" : ""
                }`}
              />
            </div>
            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <div className="error-message">{formik.errors.phoneNumber}</div>
            ) : null}
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="register__input"
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="error-message">{formik.errors.firstName}</div>
            ) : null}
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="register__input"
            />
            {formik.touched.username && formik.errors.username ? (
              <div className="error-message">{formik.errors.username}</div>
            ) : null}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="register__input"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error-message">{formik.errors.password}</div>
            ) : null}
            <button type="submit" className="register__btn" disabled={loading}>
              {loading ? "Registering..." : "Continue"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify} className="register__form">
            <h1>Verify your email address</h1>
            <h2>We have sent a verification code to</h2>
            <span>{formik.values.email}</span>
            <input
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="register__input"
            />
            <button
              type="submit"
              className="register__btn-verify"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            <button
              type="button"
              className="register__btn-resend"
              onClick={handleResendCode}
              disabled={loading || !canResend}
            >
              {loading ? "Resending..." : "Resend Code"}
            </button>
            {!canResend && (
              <CountdownTimer
                initialSeconds={20}
                onExpire={handleTimerExpire}
              />
            )}

            {error && <p className="error-message">{error}</p>}
          </form>
        )}

        <hr />
        <div>
          <h1>
            Already have an account <Link to="/login">Login</Link>
          </h1>
        </div>
      </div>
    </section>
  );
}

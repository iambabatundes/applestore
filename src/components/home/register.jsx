import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./styles/register.css";

export default function Register() {
  const [step, setStep] = useState(1);
  const [emailPhone, setEmailPhone] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.emailPhone && location.state?.step === 2) {
      setEmailPhone(location.state.emailPhone);
      setStep(2);
    }
  }, [location.state]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/register",
        { emailPhone }
      );
      alert(response.data.message);
      setStep(2);
    } catch (error) {
      setError("Registration failed. Please try again.", error);
      console.log("Registration failed. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/verify",
        { emailPhone, verificationCode }
      );
      alert(response.data.message);
      setStep(3);
    } catch (error) {
      setError("Verification failed. Please check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        emailPhone,
        firstName,
        username,
        password,
      };

      if (emailPhone.includes("@")) {
        payload.phone = phone;
      } else {
        payload.email = email;
      }

      const response = await axios.post(
        "http://localhost:5000/api/users/complete-registration",
        payload
      );
      alert(response.data.message);
    } catch (error) {
      setError("Completion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:4000/api/users/resend-code", {
        emailPhone,
      });
      alert("Verification code resent successfully.");
    } catch (error) {
      setError("Failed to resend verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-main">
      <div className="register__container">
        {step === 1 && (
          <form onSubmit={handleRegister} className="register__form">
            <input
              type="text"
              placeholder="Email or Phone"
              value={emailPhone}
              onChange={(e) => setEmailPhone(e.target.value)}
              className="register__input"
              autoFocus
            />

            <button type="submit" className="register__btn" disabled={loading}>
              {loading ? "Registering..." : "Continue"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerify} className="register__form">
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
              disabled={loading}
            >
              {loading ? "Resending..." : "Resend Code"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        )}
        {step === 3 && (
          <form
            onSubmit={handleCompleteRegistration}
            className="register__form"
          >
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="register__input"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="register__input"
            />
            {emailPhone.includes("@") ? (
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="register__input"
              />
            ) : (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="register__input"
              />
            )}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register__input"
            />
            <button type="submit" className="register__btn" disabled={loading}>
              {loading ? "Completing..." : "Complete Registration"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}

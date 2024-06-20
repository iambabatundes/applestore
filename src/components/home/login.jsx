import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";
import { login, checkUser } from "../../services/authService";

export default function Login() {
  const [step, setStep] = useState(1);
  const [emailPhone, setEmailPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => setEmailPhone(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleNextStep = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await checkUser(emailPhone);
      if (response.data) {
        setStep(2);
      } else {
        navigate("/register", { state: { emailPhone } });
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("An error occurred. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      await login(emailPhone, password);
      navigate("/");
    } catch (error) {
      setMessage("Login failed. Please check your credentials and try again.");
      console.error(
        "Login failed. Please check your credentials and try again.",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="login-container">
        <h1>Welcome to AppleStore</h1>
        <p>
          Type your e-mail or phone number to log in or create an AppleStore
          account.
        </p>
        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={emailPhone}
              onChange={handleInputChange}
              className="login__input"
              autoFocus
            />
            <button
              className="login__btn"
              onClick={handleNextStep}
              disabled={loading}
            >
              {loading ? "Checking..." : "Continue"}
            </button>
            {message && <p className="error-message">{message}</p>}
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              value={emailPhone}
              readOnly
              className="login__input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="login__input"
            />
            <button
              className="login__btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {message && <p className="error-message">{message}</p>}
          </>
        )}
      </div>
    </section>
  );
}

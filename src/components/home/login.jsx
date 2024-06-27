import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "./styles/login.css";
import { login } from "../../services/authService";

export default function Login() {
  const [emailPhone, setEmailPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState({
    country: "",
    callingCode: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    setEmailPhone(value);

    // Check if the input is a phone number
    const phoneNumber = parsePhoneNumberFromString(value, "NG");
    if (phoneNumber) {
      setPhoneNumber({
        country: phoneNumber.country,
        callingCode: phoneNumber.countryCallingCode,
      });
    } else {
      setPhoneNumber({ country: "", callingCode: "" });
    }
  };

  const handlePasswordChange = (e) => setPassword(e.target.value);

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
        <>
          <div className="input-container">
            {phoneNumber.callingCode && (
              <span className="country-code">
                +{phoneNumber.callingCode} {phoneNumber.country}
              </span>
            )}
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={emailPhone}
              onChange={handleInputChange}
              className={`login__input ${
                phoneNumber.callingCode ? "with-code" : ""
              }`}
              autoFocus
            />
          </div>

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

        <hr />
        <div>
          <h1>New in AppleStore</h1>
          <Link to="/register">
            <button>Create your AppleStore Account</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

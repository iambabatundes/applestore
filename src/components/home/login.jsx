import React, { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
// import { parsePhoneNumberFromString } from "libphonenumber-js";
import "./styles/login.css";
import { login, getCurrentUser } from "../../services/authService";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  // const [errors, setErrors] = useState({});
  // const [emailPhoneUser, setEmailPhoneUser] = useState("");
  // const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    try {
      await login(data.email, data.password);
      toast.success("You are now logged in");
      window.location = state ? state.path : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const newErrors = { ...message };
        newErrors.email = ex.response.data;
        setMessage(newErrors);
      } else {
        setMessage("Invalid email or password"); // Set a general error message
        console.error(
          "Login failed. Please check your credentials and try again.",
          ex
        );
      }
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
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={data.email}
            onChange={handleInputChange}
            className="login__input"
            autoFocus
            name="email"
          />

          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={handleInputChange}
            className="login__input"
            name="password"
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

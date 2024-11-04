import React, { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./styles/adminLogin.css";
import { adminlogin, getCurrentUser } from "../../services/adminAuthService";

export default function AdminLogin({ adminUser, setAuth }) {
  const [data, setData] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoutMessage, setLogoutMessage] = useState(null);

  const { state } = useLocation();

  useEffect(() => {
    // Check if there's a logout message to display
    const message = localStorage.getItem("logoutMessage");
    if (message) {
      setLogoutMessage(message);
      localStorage.removeItem("logoutMessage"); // Clear the message after displaying
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await adminlogin(data.email, data.password); // Call the named import directly
      window.location = state ? state.path : "/admin/home";
      setAuth(true);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const newErrors = { ...errors };
        newErrors.email = ex.response.data;
        setErrors(newErrors);
      } else {
        setErrors({ ...errors, general: "Invalid email or password" }); // Set a general error message
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // if (adminUser) return <Navigate to="/admin/home" />;
  if (getCurrentUser()) return <Navigate to="/admin/home" />;

  return (
    <div className="admin-login-background">
      <div className="admin-login-container">
        {/* {logoutMessage && (
          <div className="adminLogin__message">{logoutMessage}</div>
        )} */}

        {logoutMessage && (
          <div className="adminLogin__message">
            {logoutMessage}
            <button
              className="adminLogin__close"
              onClick={() => setLogoutMessage(null)}
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="adminLogin__form">
          <h1 className="adminLogin__Heading">Admin Login</h1>
          {errors && (
            <div>
              {errors.email && (
                <p className="adminLogin__error">{errors.email}</p>
              )}
              {errors.general && (
                <p className="adminLogin__error">{errors.general}</p>
              )}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={handleInputChange}
            required
            className="adminLogin__input"
            autoFocus
            name="email"
          />
          <div className="adminLogin__password-container">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={data.password}
              onChange={handleInputChange}
              required
              className="adminLogin__input"
              name="password"
            />
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              onClick={togglePasswordVisibility}
              className="adminLogin__password-icon"
            />
          </div>
          <button type="submit" className="adminLogin__btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./styles/adminLogin.css";
import { useAdminAuthStore } from "./store/useAdminAuthStore";

export default function AdminLogin() {
  const [data, setData] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoutMessage, setLogoutMessage] = useState(null);
  const [logoutType, setLogoutType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    adminUser,
    isAuthenticated,
    loading,
    login,
    initialize,
    initialized,
  } = useAdminAuthStore();

  const navigate = useNavigate();
  const { state } = useLocation();

  // Initialize store when component mounts
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialize, initialized]);

  // Load logout messages
  useEffect(() => {
    const message = localStorage.getItem("logoutMessage");
    const type = localStorage.getItem("logoutType");

    if (message) {
      setLogoutMessage(message);
      setLogoutType(type);
      localStorage.removeItem("logoutMessage");
      localStorage.removeItem("logoutType");

      // Auto-hide message after 5 seconds
      const timer = setTimeout(() => {
        setLogoutMessage(null);
        setLogoutType(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Clear errors when inputs change
  useEffect(() => {
    if (errors.email || errors.general) {
      setErrors({});
    }
  }, [data.email, data.password]);

  const validateForm = () => {
    const newErrors = {};

    if (!data.email || !data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.password || !data.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(data.email.trim(), data.password, navigate);
    } catch (error) {
      console.error("Login submission error:", error);

      // Handle different error types
      if (error.response) {
        const { status, data: errorData } = error.response;

        switch (status) {
          case 400:
            setErrors({
              general: errorData?.message || "Invalid email or password",
            });
            break;
          case 401:
            setErrors({
              general: "Invalid email or password",
            });
            break;
          case 422:
            // Validation errors
            if (errorData?.errors) {
              setErrors(errorData.errors);
            } else {
              setErrors({
                general: errorData?.message || "Please check your input",
              });
            }
            break;
          case 429:
            setErrors({
              general: "Too many login attempts. Please try again later.",
            });
            break;
          case 500:
            setErrors({
              general: "Server error. Please try again later.",
            });
            break;
          default:
            setErrors({
              general: errorData?.message || "Login failed. Please try again.",
            });
        }
      } else if (error.request) {
        setErrors({
          general: "Network error. Please check your connection and try again.",
        });
      } else {
        setErrors({
          general: error.message || "An unexpected error occurred",
        });
      }
    } finally {
      setIsSubmitting(false);
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

  const closeLogoutMessage = () => {
    setLogoutMessage(null);
    setLogoutType(null);
  };

  // Show loading while initializing
  if (!initialized || loading) {
    return (
      <div className="admin-login-background">
        <div className="admin-login-container">
          <div className="adminLogin__loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated && adminUser) {
    const redirectTo = state?.from?.pathname || "/admin/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  const messageClass =
    logoutType === "manual"
      ? "adminLogin__message--manual"
      : "adminLogin__message--automatic";

  return (
    <div className="admin-login-background">
      <div className="admin-login-container">
        {logoutMessage && (
          <div className={`adminLogin__message ${messageClass}`}>
            {logoutMessage}
            <button
              className="adminLogin__close"
              onClick={closeLogoutMessage}
              type="button"
              aria-label="Close message"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="adminLogin__form" noValidate>
          <h1 className="adminLogin__heading">Admin Login</h1>

          {(errors.general || errors.email || errors.password) && (
            <div className="adminLogin__errors">
              {errors.general && (
                <p className="adminLogin__error">{errors.general}</p>
              )}
              {errors.email && (
                <p className="adminLogin__error">{errors.email}</p>
              )}
              {errors.password && (
                <p className="adminLogin__error">{errors.password}</p>
              )}
            </div>
          )}

          <div className="adminLogin__input-group">
            <input
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={handleInputChange}
              required
              className={`adminLogin__input ${
                errors.email ? "adminLogin__input--error" : ""
              }`}
              autoFocus
              name="email"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>

          <div className="adminLogin__input-group">
            <div className="adminLogin__password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={data.password}
                onChange={handleInputChange}
                required
                className={`adminLogin__input ${
                  errors.password ? "adminLogin__input--error" : ""
                }`}
                name="password"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="adminLogin__password-toggle"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                disabled={isSubmitting}
              >
                <FontAwesomeIcon
                  icon={passwordVisible ? faEyeSlash : faEye}
                  className="adminLogin__password-icon"
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`adminLogin__btn ${
              isSubmitting ? "adminLogin__btn--loading" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="adminLogin__btn-spinner"></span>
                Signing in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

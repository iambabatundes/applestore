import React, { useState, useEffect } from "react";
import { useStore } from "zustand";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./styles/login.css";
import { getVoteIntent } from "./ProductReviews/hooks/useVoteIntent";
import { authStore, login } from "../../services/authService";
import LoginSkeleton from "./login/loginSkeleton";

export default function Login({ companyName }) {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    user,
    isAuthenticated,
    isAuthReady,
    isLoading: authLoading,
  } = useStore(authStore);

  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const voteIntent = getVoteIntent();

  // Clear errors when component mounts or auth state changes
  useEffect(() => {
    if (errors) {
      setErrors("");
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors) setErrors("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!data.email.trim() || !data.password.trim()) {
      setErrors("Please fill in all fields");
      return;
    }

    // Email format validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;

    if (!emailRegex.test(data.email) && !phoneRegex.test(data.email)) {
      setErrors("Please enter a valid email address or phone number");
      return;
    }

    setLoading(true);
    setErrors("");

    try {
      const loggedInUser = await login(data.email, data.password);

      // Show success message with user's name if available
      const welcomeMessage = loggedInUser?.firstName
        ? `Welcome back, ${loggedInUser.firstName}!`
        : "You are now logged in";

      toast.success(welcomeMessage);

      // Handle navigation after successful login
      if (voteIntent) {
        navigate(voteIntent.path, {
          state: { ...voteIntent, action: "vote" },
          replace: true,
        });
        sessionStorage.removeItem("voteIntent");
      } else {
        const redirectPath = state?.path || "/";
        console.log("Redirecting user after login to:", redirectPath);
        navigate(redirectPath, { replace: true });
      }
    } catch (ex) {
      console.error("Login failed:", ex);

      // Handle specific error types with user-friendly messages
      if (ex.response?.status === 400 || ex.response?.status === 401) {
        setErrors(
          "Invalid email or password. Please check your credentials and try again."
        );
      } else if (ex.response?.status === 429) {
        setErrors(
          "Too many login attempts. Please wait a few minutes before trying again."
        );
      } else if (ex.response?.status === 403) {
        setErrors("Your account has been suspended. Please contact support.");
      } else if (ex.response?.status >= 500) {
        setErrors("Server error. Please try again in a few moments.");
      } else if (ex.code === "NETWORK_ERROR" || !navigator.onLine) {
        setErrors(
          "No internet connection. Please check your network and try again."
        );
      } else if (ex.name === "TimeoutError") {
        setErrors(
          "Request timed out. Please check your connection and try again."
        );
      } else {
        // Fallback error message
        const errorMessage =
          ex.response?.data?.message || ex.response?.data?.error || ex.message;

        setErrors(
          errorMessage || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && !authLoading) {
      handleLogin(e);
    }
  };

  // Show loading spinner while auth is initializing
  if (!isAuthReady || authLoading) {
    return <LoginSkeleton />;
  }

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const redirectPath = state?.path || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <section className="login-section">
      <div className="login-container">
        <h1>Welcome to {companyName}</h1>
        <p>
          Type your e-mail or phone number to log in or create a {companyName}
          account.
        </p>

        <form onSubmit={handleLogin} noValidate>
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={data.email}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="login__input"
            autoFocus
            name="email"
            autoComplete="username"
            disabled={loading || authLoading}
            aria-label="Email or Phone Number"
            aria-invalid={errors ? "true" : "false"}
            aria-describedby={errors ? "error-message" : undefined}
          />

          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="login__input"
            name="password"
            autoComplete="current-password"
            disabled={loading || authLoading}
            aria-label="Password"
            aria-invalid={errors ? "true" : "false"}
            aria-describedby={errors ? "error-message" : undefined}
          />

          <button
            type="submit"
            className="login__btn"
            disabled={
              loading ||
              authLoading ||
              !data.email.trim() ||
              !data.password.trim()
            }
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {errors && (
            <p
              id="error-message"
              className="error-message"
              role="alert"
              aria-live="polite"
            >
              {errors}
            </p>
          )}
        </form>

        <hr />

        <div className="createNew__account">
          <h2 className="createNew__title">New to {companyName}?</h2>
          <Link
            to="/register"
            state={{ path: state?.path, from: location.pathname }}
            aria-label={`Create your ${companyName} account`}
          >
            <button type="button" className="createNew__btn">
              Create your {companyName} Account
            </button>
          </Link>
        </div>

        {/* Enhanced forgot password section */}
        <div className="forgot-password">
          <Link
            to="/forgot-password"
            className="forgot-password-link"
            aria-label="Reset your password"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === "development" && (
          <div
            className="debug-info"
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#f0f0f0",
              fontSize: "12px",
              border: "1px solid #ccc",
            }}
          >
            <p>Debug Info:</p>
            <p>isAuthReady: {isAuthReady.toString()}</p>
            <p>isAuthenticated: {isAuthenticated.toString()}</p>
            <p>hasUser: {(!!user).toString()}</p>
            <p>authLoading: {authLoading.toString()}</p>
          </div>
        )}
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { useStore } from "zustand";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "./styles/login.css";
import { getVoteIntent } from "./ProductReviews/hooks/useVoteIntent";
import { authStore, login } from "../../services/authService";

export default function Login({ companyName }) {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useStore(authStore);

  // const { state } = useLocation();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const voteIntent = getVoteIntent();

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
    setErrors("");
    try {
      await login(data.email, data.password);
      toast.success("You are now logged in");
      if (voteIntent) {
        navigate(voteIntent.path, { state: { ...voteIntent, action: "vote" } });
        sessionStorage.removeItem("voteIntent");
      } else {
        navigate(state?.path || "/");
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setErrors("Invalid email or password");
      } else {
        setErrors("An unexpected error occurred. Please try again.");
        console.error(
          "Login failed. Please check your credentials and try again.",
          ex
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <section className="login-section">
      <div className="login-container">
        <h1>Welcome to {companyName}</h1>
        <p>
          Type your e-mail or phone number to log in or create an {companyName}
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
          {errors && <p className="error-message">{errors}</p>}
        </>

        <hr />
        <div className="createNew__account">
          <h1 className="createNew__title">New in {companyName}</h1>
          <Link to="/register">
            <button className="createNew__btn">
              Create your {companyName} Account
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

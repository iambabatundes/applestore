import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./styles/login.css";
import { login } from "../../services/authService";

export default function Login({ companyName, user }) {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

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
      navigate(state?.from || "/", { state });
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

  // if (user) return <Navigate to="/" replace />;

  if (user) {
    const redirectPath =
      state?.path + (state?.openReviewModal ? "?openReviewModal=true" : "") ||
      "/";
    return <Navigate to={redirectPath} replace />;
  }

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

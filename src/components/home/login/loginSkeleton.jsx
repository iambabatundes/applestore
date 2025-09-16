import React from "react";
import "./styles/login.css";

const LoginSkeleton = ({ companyName }) => {
  return (
    <section className="login-section">
      <div className="login-container">
        {/* Title skeleton */}
        <div
          className="skeleton skeleton-title"
          style={{
            height: "32px",
            marginBottom: "16px",
            borderRadius: "4px",
          }}
        ></div>

        {/* Subtitle skeleton */}
        <div
          className="skeleton skeleton-subtitle"
          style={{
            height: "18px",
            marginBottom: "24px",
            borderRadius: "4px",
            width: "80%",
          }}
        ></div>

        {/* Email input skeleton */}
        <div
          className="skeleton skeleton-input"
          style={{
            height: "48px",
            marginBottom: "16px",
            borderRadius: "6px",
            width: "100%",
          }}
        ></div>

        {/* Password input skeleton */}
        <div
          className="skeleton skeleton-input"
          style={{
            height: "48px",
            marginBottom: "24px",
            borderRadius: "6px",
            width: "100%",
          }}
        ></div>

        {/* Login button skeleton */}
        <div
          className="skeleton skeleton-button"
          style={{
            height: "48px",
            marginBottom: "32px",
            borderRadius: "6px",
            width: "100%",
          }}
        ></div>

        {/* Divider */}
        <hr style={{ margin: "32px 0", opacity: 0.3 }} />

        {/* "New to [company]" section skeleton */}
        <div style={{ textAlign: "center" }}>
          <div
            className="skeleton skeleton-subtitle"
            style={{
              height: "24px",
              marginBottom: "16px",
              borderRadius: "4px",
              width: "60%",
              margin: "0 auto 16px",
            }}
          ></div>

          <div
            className="skeleton skeleton-button"
            style={{
              height: "48px",
              marginBottom: "16px",
              borderRadius: "6px",
              width: "100%",
            }}
          ></div>
        </div>

        {/* Forgot password link skeleton */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <div
            className="skeleton skeleton-link"
            style={{
              height: "16px",
              borderRadius: "4px",
              width: "140px",
              margin: "0 auto",
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default LoginSkeleton;

// common/ErrorFallback.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
// import "./errorFallback.css";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  return (
    <div className="error-fallback" role="alert">
      <div className="error-content">
        <h2>Something went wrong</h2>
        <p className="error-message">{error.message}</p>
        <div className="error-actions">
          <button className="btn-primary" onClick={resetErrorBoundary}>
            Try again
          </button>
          <button className="btn-secondary" onClick={() => navigate("/")}>
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

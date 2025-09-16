import React from "react";
import "./ErrorFallback.css";

const ErrorFallback = ({ error, resetError, resetErrorBoundary }) => {
  const handleReset = resetErrorBoundary || resetError;

  // Log error details for debugging (in development)
  if (process.env.NODE_ENV === "development") {
    console.group("🚨 Error Boundary Caught An Error");
    console.error("Error:", error);
    console.error("Stack:", error?.stack);
    console.groupEnd();
  }

  // Extract useful error information
  const errorMessage = error?.message || "An unexpected error occurred";
  const isNetworkError =
    error?.message?.includes("fetch") || error?.message?.includes("network");
  const isTimeoutError =
    error?.message?.includes("timeout") ||
    error?.message?.includes("timed out");

  return (
    <div className="error-fallback">
      <div className="error-fallback__container">
        <div className="error-fallback__icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M12 8v4m0 4h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="error-fallback__content">
          <h1 className="error-fallback__title">Something went wrong</h1>

          <p className="error-fallback__message">
            {isNetworkError &&
              "Please check your internet connection and try again."}
            {isTimeoutError &&
              "The request took too long to complete. Please try again."}
            {!isNetworkError &&
              !isTimeoutError &&
              "We encountered an unexpected problem. Please try refreshing the page."}
          </p>

          {process.env.NODE_ENV === "development" && (
            <details className="error-fallback__details">
              <summary>Error Details (Development Only)</summary>
              <pre className="error-fallback__error-text">{errorMessage}</pre>
              {error?.stack && (
                <pre className="error-fallback__stack">{error.stack}</pre>
              )}
            </details>
          )}
        </div>

        <div className="error-fallback__actions">
          {handleReset && (
            <button
              onClick={handleReset}
              className="error-fallback__button error-fallback__button--primary"
              aria-label="Try again"
            >
              Try Again
            </button>
          )}

          <button
            onClick={() => window.location.reload()}
            className="error-fallback__button error-fallback__button--secondary"
            aria-label="Reload page"
          >
            Reload Page
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="error-fallback__button error-fallback__button--tertiary"
            aria-label="Go to home page"
          >
            Go Home
          </button>
        </div>

        <div className="error-fallback__support">
          <p className="error-fallback__support-text">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;

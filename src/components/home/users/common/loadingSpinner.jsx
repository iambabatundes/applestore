// common/loadingSpinner.jsx
import React from "react";
// import "./loadingSpinner.css";

export default function LoadingSpinner({
  fullScreen = false,
  size = "medium",
}) {
  const sizeClass = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large",
  }[size];

  const spinner = (
    <div className={`loading-spinner ${sizeClass}`}>
      <div className="spinner"></div>
    </div>
  );

  if (fullScreen) {
    return <div className="loading-overlay">{spinner}</div>;
  }

  return spinner;
}

import React from "react";
import "../common/styles/adminSetupScreens.css";

export default function SetupRequiredScreen({ onContinueSetup, darkMode }) {
  return (
    <div className={`setup-required-screen ${darkMode ? "dark-mode" : ""}`}>
      <div className="setup-required-content">
        <div className="setup-required-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9H21ZM19 21H5V3H13V9H19V21Z" />
          </svg>
        </div>
        <h2>Admin Panel Setup Required</h2>
        <p>
          This appears to be your first time accessing the admin panel. You'll
          need to set up an initial super administrator account to get started.
        </p>
        <div className="setup-features">
          <div className="setup-feature">
            <span className="setup-feature-icon">👤</span>
            <span>Create Super Admin Account</span>
          </div>
          <div className="setup-feature">
            <span className="setup-feature-icon">🔐</span>
            <span>Configure Two-Factor Authentication</span>
          </div>
          <div className="setup-feature">
            <span className="setup-feature-icon">🔑</span>
            <span>Generate Backup Access Codes</span>
          </div>
          <div className="setup-feature">
            <span className="setup-feature-icon">✅</span>
            <span>Verify Email & Security Settings</span>
          </div>
        </div>
        <button
          onClick={onContinueSetup}
          className="btn btn--primary btn--large"
        >
          Begin Setup Process
        </button>
        <p className="setup-help-text">
          This process takes about 5-10 minutes and ensures your admin panel is
          secure.
        </p>
      </div>
    </div>
  );
}

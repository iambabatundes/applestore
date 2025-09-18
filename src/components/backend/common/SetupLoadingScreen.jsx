import React from "react";
import "../common/styles/adminSetupScreens.css";

export default function SetupLoadingScreen({ darkMode }) {
  return (
    <section className={`setup-loading-screen ${darkMode ? "dark-mode" : ""}`}>
      <div className="setup-loading-content">
        <div className="setup-loading-spinner"></div>
        <h2>Checking System Status...</h2>
        <p>Please wait while we verify the admin panel setup.</p>
      </div>
    </section>
  );
}

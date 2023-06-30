import React, { useEffect } from "react";
import "./modal.css";
import Icon from "../icon";

export default function SocialButton({
  login,
  register,
  handleLoginClick,
  handleRegisterClick,
}) {
  useEffect(() => {
    // Load the Google Sign-In API
    const loadGoogleSignInAPI = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    };

    // Initialize the Google Sign-In API
    const initializeGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id:
          "33105655091-0d3up6n4u00r9t8lv23kpv2ot9d2al0m.apps.googleusercontent.com",
        callback: handleGoogleLogin,
      });
    };

    // Handle Google login callback
    const handleGoogleLogin = (response) => {
      // Handle the response from Google sign-in here
      console.log(response);
    };

    // Load the Google Sign-In API when the component mounts
    loadGoogleSignInAPI();

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(
        document.querySelector(
          "script[src='https://accounts.google.com/gsi/client']"
        )
      );
    };
  }, []);

  const handleGoogleSignIn = () => {
    window.google.accounts.id.prompt();
  };

  return (
    <section>
      <div className="social-buttons">
        <button className="login-btn" onClick={handleGoogleSignIn}>
          <Icon google className="google" />
          <h5>Continue with Google</h5>
        </button>

        {login && (
          <button className="login-btn" onClick={handleLoginClick}>
            <Icon emailLogin />
            <h5>Continue with email/username</h5>
          </button>
        )}

        {register && (
          <button className="login-btn" onClick={handleRegisterClick}>
            <Icon emailLogin />
            <h5>Continue with email</h5>
          </button>
        )}
      </div>
    </section>
  );
}

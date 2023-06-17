import React from "react";
import "./modal.css";
import Icon from "../icon";

export default function SocialButton({
  login,
  register,
  handleLoginClick,
  handleRegisterClick,
}) {
  return (
    <section>
      <div className="social-buttons">
        <button className="login-btn">
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

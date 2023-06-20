import React from "react";
import ModalForm from "./modalForm";
import ModalHeading from "./modalHeading";
import Icon from "../icon";
import "./modal.css";

export default function ForgetPassword({ navigateToSignIn, onClose }) {
  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  const handleforgetGoBack = () => {
    navigateToSignIn(); // Call the callback function to navigate to the SignIn modal
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // ...
  };

  return (
    <section className="modal">
      <div className="modal-container">
        <img src="/brandNew.webp" alt="Apple for sell" />
        <div className="modal-content" onClick={handleFormClick}>
          <div className="modal-function">
            <section className="goBack" onClick={handleforgetGoBack}>
              <Icon goBack />
              <p>Back</p>
            </section>
            <Icon cancel className="modal-function-cancel" onClick={onClose} />
          </div>
          <ModalHeading
            title="Reset Password"
            className="modal-forgetPassword__title"
            sub="modal-forgetPassword__subtitle"
            subtitle="Enter your email address and we'll send you a link to reset your password."
          />

          <form onSubmit={handleFormSubmit}>
            <ModalForm
              label="Email"
              placeholder="Email"
              email="Email"
              title="Forget Password"
            />

            <button type="submit" className="login-btn-login">
              Submit
            </button>
          </form>

          {/* <ModalForm
            label="Email"
            placeholder="Email"
            email="Email"
            title="Forget Password"
            dis
          /> */}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import ModalForm from "./modalForm";
import ModalHeading from "./modalHeading";
import ForgetPassword from "./forgetPassword";
import Icon from "../icon";

export default function SignInModal({ onClose, onOpen, navigateToLogin }) {
  const [showForgetModal, setShowForgetModal] = useState(false);

  const handleForgetClick = () => {
    setShowForgetModal(true);
  };

  const handleForgetClose = () => {
    setShowForgetModal(false);
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  const handleGoBack = () => {
    navigateToLogin(); // Call the callback function to navigate to the login modal
  };

  const navigateToSignIn = () => {
    setShowForgetModal(false); // Close the ForgetPassword modal
  };

  return (
    <section className="modal">
      <div className="modal-container">
        <img src="/brandNew.webp" alt="Apple for sell" />
        <div className="modal-content" onClick={handleFormClick}>
          <div className="modal-function">
            <section className="goBack" onClick={handleGoBack}>
              <Icon goBack />
              <p>Back</p>
            </section>
            <Icon cancel className="modal-function-cancel" onClick={onClose} />
          </div>
          <ModalHeading title="Continue with your email or username" />

          {showForgetModal ? (
            <ForgetPassword
              onClose={onClose}
              navigateToSignIn={navigateToSignIn}
            />
          ) : (
            <ModalForm
              label="Email or Username"
              placeholder="Email or Username"
              password="Password"
              title="Login"
              onClick={handleForgetClick}
              forget
              submit
            />
          )}

          {/* <ModalForm
            email="Email / Password"
            password="Password"
            title="Login"
          /> */}
        </div>
      </div>
    </section>
  );
}

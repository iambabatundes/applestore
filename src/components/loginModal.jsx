import React, { useState } from "react";
import "./forms/modal.css";
import SignInModal from "./forms/signInModal";
import LoginModalContent from "./forms/loginModalContent";

export default function LoginModal({
  onClose,
  onOpen,
  handleFormClick,
  showLoginModal,
  setShowLoginModal,
  // handleLoginClick,
}) {
  const [activeModal, setActiveModal] = useState("login");

  const navigateToLogin = () => {
    setActiveModal("login");
  };

  const handleLoginClick = () => {
    setActiveModal("signin");
  };

  return (
    <section className="modal" onClick={onClose}>
      {activeModal === "login" ? (
        <LoginModalContent
          onClose={onClose}
          setShowLoginModal={setShowLoginModal}
          onOpen={onOpen}
          handleFormClick={handleFormClick}
          handleLoginClick={handleLoginClick}
        />
      ) : (
        <SignInModal
          onClose={onClose}
          onOpen={onOpen}
          navigateToLogin={navigateToLogin}
        />
      )}
    </section>
  );
}

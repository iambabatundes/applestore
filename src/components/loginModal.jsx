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
  handleLoginClick,
}) {
  // const handleLoginClick = (e) => {
  //   e.preventDefault();
  //   setShowLoginModal(true);
  // };

  return (
    <section className="modal" onClick={onClose}>
      {showLoginModal ? (
        <SignInModal onClose={() => setShowLoginModal(false)} onOpen={onOpen} />
      ) : (
        <LoginModalContent
          onClose={onClose}
          setShowLoginModal={setShowLoginModal}
          onOpen={onOpen}
          handleFormClick={handleFormClick}
          handleLoginClick={handleLoginClick}
        />
      )}
    </section>
  );
}

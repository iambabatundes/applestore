import React, { useState } from "react";
import "./forms/modal.css";
import JoinModal from "./forms/joinModal";
import RegisterModalContent from "./forms/registerModalContent";

export default function RegisterModal({
  onClose,
  onOpen,
  setShowJoinModal,
  showJoinModal,
  handleFormClick,
  handleContinueClick,
}) {
  const [activeModal, setActiveModal] = useState("register");

  const navigateToRegister = () => {
    setActiveModal("register");
  };

  const handleRegisterClick = () => {
    setActiveModal("joinin");
  };
  return (
    <section className="modal">
      {activeModal === "register" ? (
        <RegisterModalContent
          onClose={onClose}
          setShowJoinModal={setShowJoinModal}
          onOpen={onOpen}
          handleContinueClick={handleContinueClick}
          handleFormClick={handleFormClick}
          handleRegisterClick={handleRegisterClick}
        />
      ) : (
        <JoinModal
          // onClose={() => setShowJoinModal(false)}
          onClose={onClose}
          onOpen={onOpen}
          navigateToRegister={navigateToRegister}
        />
      )}
    </section>
  );
}

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
  return (
    <section className="modal" onClick={onClose}>
      {showJoinModal ? (
        <JoinModal onClose={() => setShowJoinModal(false)} onOpen={onOpen} />
      ) : (
        <RegisterModalContent
          onClose={onClose}
          setShowJoinModal={setShowJoinModal}
          onOpen={onOpen}
          handleContinueClick={handleContinueClick}
          handleFormClick={handleFormClick}
        />
      )}
    </section>
  );
}

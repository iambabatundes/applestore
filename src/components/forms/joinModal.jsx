import React from "react";
import ModalFooter from "./modalFooter";
import ModalForm from "./modalForm";
import ModalHeading from "./modalHeading";

export default function joinModal({ onClose, onOpen }) {
  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  return (
    <section className="join-modal" onClick={onClose}>
      <div className="join-modal-container">
        <div className="join-modal-content" onClick={handleFormClick}>
          <ModalHeading title="Join Fiverr" />

          <ModalForm
            email="Choose a Username"
            password="Choose a Password"
            desc="8 characters or longer. Combine upper and lowercase letters and
            numbers."
            title="Join"
            subscribe="By joining, you agree to Fiverr's Terms of Service,
            as well as to receive occasional emails from us."
          />
        </div>

        <ModalFooter
          onClick={handleFormClick}
          subtitle="Already a member?"
          link="Sign In"
          onOpen={onOpen}
        />
      </div>
    </section>
  );
}

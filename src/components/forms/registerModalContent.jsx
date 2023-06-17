import React from "react";
import ModalFooter from "./modalFooter";
// import ModalForm from "./modalForm";
import ModalHeading from "./modalHeading";
import SocialButton from "./socialButton";

export default function RegisterModalContent({
  onClose,
  onOpen,
  handleFormClick,
  handleContinueClick,
}) {
  return (
    <div className="modal-container" onClick={onClose}>
      <img
        src="/brandNew.webp"
        alt="brand image"
        className="join-bannerImage"
      />
      <div>
        <div className="modal-content" onClick={handleFormClick}>
          <ModalHeading title="Create a new account" />
          <ModalFooter
            onClick={handleFormClick}
            subtitle="Already have an account?"
            link="Sign in"
            onOpen={onOpen}
          />

          <SocialButton />
          <div className="separator">
            <hr />
            <span>OR</span>
            <hr />
          </div>

          <form>
            <input type="text" placeholder="Enter your Email" />

            <button onClick={handleContinueClick} className="continue">
              Continue
            </button>

            <p className="modal-subscribe">
              By joining I agree to receive emails from AppleStore.
            </p>
          </form>
        </div>

        <ModalFooter
          onClick={handleFormClick}
          subtitle="Already A member"
          link="Sign in"
          onOpen={onOpen}
        />
      </div>
    </div>
  );
}

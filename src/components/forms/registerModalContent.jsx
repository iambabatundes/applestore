import React from "react";
import ModalFooter from "./modalFooter";
// import ModalForm from "./modalForm";
import ModalHeading from "./modalHeading";
import SocialButton from "./socialButton";
import Icon from "../icon";

export default function RegisterModalContent({
  onClose,
  onOpen,
  handleFormClick,
  handleRegisterClick,
}) {
  return (
    <div className="modal-container">
      <img
        src="/brandNew.webp"
        alt="brand image"
        className="join-bannerImage"
      />
      <div>
        <div className="modal-content" onClick={handleFormClick}>
          <div>
            <Icon cancel className="cancel" onClick={onClose} />
          </div>
          <ModalHeading title="Create a new account" />
          <h4>
            Already have an account? <span onClick={onOpen}>Sign in</span>
          </h4>
          <SocialButton register handleRegisterClick={handleRegisterClick} />

          <div className="separator">
            <hr />
            <span>OR</span>
            <hr />
          </div>

          <div className="btn-group">
            <button className="login-btn">
              <Icon apple />
              Apple
            </button>

            <button className="login-btn">
              <Icon facebook />
              Facebook
            </button>
          </div>
        </div>

        {/* <ModalFooter
          onClick={handleFormClick}
          subtitle="Already A member"
          link="Sign in"
          onOpen={onOpen}
        /> */}
      </div>
    </div>
  );
}

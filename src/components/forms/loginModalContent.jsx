import React from "react";
import ModalFooter from "./modalFooter";
// import ModalForm from "./modalForm";
import ModalHeading from "./modalHeading";
import SocialButton from "./socialButton";

import Icon from "../icon";

export default function LoginModalContent({
  onClose,
  onOpen,
  handleFormClick,
  handleLoginClick,
}) {
  return (
    <section className="modal">
      <div className="modal-container">
        <img src="/brandNew.webp" alt="Apple for sell" />
        <div className="modal-content" onClick={handleFormClick}>
          <div>
            <Icon cancel className="cancel" onClick={onClose} />
          </div>
          <ModalHeading title="Sign in to your account" />
          <h4>
            Don't have an account? <span onClick={onOpen}>Join here</span>
          </h4>
          <SocialButton login handleLoginClick={handleLoginClick} />
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

          {/* <ModalFooter
            onClick={handleFormClick}
            subtitle="Not a member yet?"
            link="Join now"
            onOpen={onOpen}
          /> */}
        </div>
      </div>
    </section>
  );
}

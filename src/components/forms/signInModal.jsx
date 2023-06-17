import React from "react";
import ModalFooter from "./modalFooter";
import ModalForm from "./modalForm";
import ModalHeading from "./modalHeading";
import SocialButton from "./socialButton";

import Icon from "../icon";

export default function SignInModal({ onClose, onOpen }) {
  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  return (
    <section className="modal">
      <div className="modal-container">
        <img src="/brandNew.webp" alt="Apple for sell" />
        <div className="modal-content" onClick={handleFormClick}>
          <div className="modal-function">
            <section className="goBack">
              <Icon goBack onClick />
              <p>Back</p>
            </section>
            <Icon cancel className="modal-function-cancel" onClick={onClose} />
          </div>
          <ModalHeading title="Continue with your email or username" />

          <ModalForm
            email="Email / Password"
            password="Password"
            checked
            title="Continue"
          />

          {/* <ModalFooter
            onClick={handleFormClick}
            subtitle="Not a member yet?"
            link="Join now"
            onOpen={onOpen}
          /> */}
        </div>
      </div>
    </section>

    // <section className="join-modal" onClick={onClose}>
    //   <div className="join-modal-container">
    //     <div className="join-modal-content" onClick={handleFormClick}>
    //       <ModalHeading title="Join Fiverr" />

    //       <ModalForm
    //         email="Choose a Username"
    //         password="Choose a Password"
    //         desc="8 characters or longer. Combine upper and lowercase letters and
    //         numbers."
    //         title="Join"
    //         subscribe="By joining, you agree to Fiverr's Terms of Service,
    //         as well as to receive occasional emails from us."
    //       />
    //     </div>

    //     <ModalFooter
    //       onClick={handleFormClick}
    //       subtitle="Already a member?"
    //       link="Sign In"
    //       onOpen={onOpen}
    //     />
    //   </div>
    // </section>
  );
}

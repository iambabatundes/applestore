import React, { useState } from "react";
import "./styles/CommitmentSection.css";
import { FaTruck, FaUndo, FaShieldAlt, FaChevronRight } from "react-icons/fa";
import CommitmentModal from "./common/CommitmentModal";

export default function CommitmentSection() {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (type) => {
    setModalContent(type);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <>
      <section className="commitment">
        <div className="commitment__item" onClick={() => openModal("shipping")}>
          <div className="commitment__left">
            <FaTruck className="commitment__icon" />
            <div className="commitment__text">
              <h4 className="commitment__heading">Free shipping</h4>
              <p>
                Delivery: <span className="highlight">Jun 19 - 29</span>
                <br />
                Courier company: .etc.
              </p>
            </div>
          </div>
          <FaChevronRight className="commitment__arrow" />
        </div>

        <div className="commitment__item" onClick={() => openModal("refund")}>
          <div className="commitment__left">
            <FaUndo className="commitment__icon" />
            <h4 className="commitment__heading">Return & refund policy</h4>
          </div>
          <FaChevronRight className="commitment__arrow" />
        </div>

        <div className="commitment__item" onClick={() => openModal("security")}>
          <div className="commitment__left">
            <FaShieldAlt className="commitment__icon" />
            <div className="commitment__text">
              <h4 className="commitment__heading">Security & Privacy</h4>
              <p className="commitment__subtext">
                Safe payments: We do not share your personal info.
              </p>
              <p className="commitment__subtext">
                Secure personal details: We protect your data.
              </p>
            </div>
          </div>
          <FaChevronRight className="commitment__arrow" />
        </div>
      </section>
      {modalContent && (
        <CommitmentModal type={modalContent} onClose={closeModal} />
      )}
    </>
  );
}

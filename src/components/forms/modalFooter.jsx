import React from "react";
import { NavLink } from "react-router-dom";
import "./modal.css";

export default function ModalFooter({ subtitle, link, onOpen }) {
  return (
    <section>
      <div>
        <hr className="modal-line" />
        <div className="footer-modal">
          <p className="footer-modal-subtitle">{subtitle}</p>
          <NavLink onClick={onOpen}>
            <span>{link}</span>
          </NavLink>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import PropTypes from "prop-types";
import "../styles/arrowButton.css";

export default function ArrowButton({ direction, onClick, className }) {
  const iconClass =
    direction === "left" ? "fa-chevron-left" : "fa-chevron-right";
  const defaultButtonClass = `arrowButton__arrowBtn arrowButton__${direction}Btn`;

  const buttonClass = `${defaultButtonClass} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick}>
      <span className="arrowButton__iconBtn">
        <i className={`fa ${iconClass}`} aria-hidden="true"></i>
      </span>
    </button>
  );
}

ArrowButton.propTypes = {
  direction: PropTypes.oneOf(["left", "right"]).isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string, // New prop for custom className
};

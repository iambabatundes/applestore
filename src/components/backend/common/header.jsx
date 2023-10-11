import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

export default function Header({ buttonTitle, headerTitle, to, onClick }) {
  return (
    <header className="headerData-main">
      <h1 className="headerData-title">{headerTitle}</h1>
      <Link to={to}>
        {buttonTitle && (
          <button className="headerData-btn" onClick={onClick}>
            {buttonTitle}
          </button>
        )}
      </Link>
    </header>
  );
}

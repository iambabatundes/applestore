import React from "react";
import { Link } from "react-router-dom";
// import "../styles/header.css";
import "../styles/header.css";

export default function Header({
  buttonTitle,
  className,
  headerTitle,
  to,
  onClick,
  titleHeader,
}) {
  return (
    <header className={`${className}`}>
      <h1 className={`${titleHeader}, headerData-title`}>{headerTitle}</h1>
      <Link to={to}>
        {buttonTitle && (
          <button className={`${className}, headerData-btn`} onClick={onClick}>
            {buttonTitle}
          </button>
        )}
      </Link>
    </header>
  );
}

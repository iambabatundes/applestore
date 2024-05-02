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
}) {
  return (
    <header className={`${className}, headerData-main`}>
      <h1 className={`${className}, headerData-title`}>{headerTitle}</h1>
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

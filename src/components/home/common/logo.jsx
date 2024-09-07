import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <div className="navbar-brand">
      <Link to="/">
        <img
          src="https://www.amazon.com/favicon.ico"
          alt="Brand Logo"
          className="brand-logo"
        />
      </Link>
    </div>
  );
}

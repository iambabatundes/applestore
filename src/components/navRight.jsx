import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function NavRight() {
  const [showNavbar, setShowNavbar] = useState(false);

  const handleToggle = () => {
    setShowNavbar(!showNavbar);
  };

  return (
    <nav>
      <div className="toggle-icon" onClick={handleToggle}>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="19"
            viewBox="0 0 23 19"
          >
            <rect y="16" width="23" height="3" rx="1.5" fill="#555"></rect>
            <rect width="23" height="3" rx="1.5" fill="#555"></rect>
            <rect y="8" width="23" height="3" rx="1.5" fill="#555"></rect>
          </svg>
        </span>
      </div>
      <div className={`navbar-links ${showNavbar ? "show" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/product">Product</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <NavLink to="/cart" activeClassName="active">
          Cart
        </NavLink>
      </div>
    </nav>
  );
}

export default NavRight;

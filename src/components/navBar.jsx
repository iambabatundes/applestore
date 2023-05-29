import React, { useState } from "react";
import "../components/styles/navbar.css";
import logo from "../logo.svg";
import message from "../message.svg";
import notification from "../notification.svg";
import { Link, NavLink } from "react-router-dom";
import Search from "./search";
// import NavRight from "./navRight";

function NavBar() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleToggle = () => {
    setShowNavbar(!showNavbar);
    setShowOverlay(!showOverlay);
  };

  const handleClose = () => {
    setShowNavbar(false);
    setShowOverlay(false);
  };

  return (
    <header>
      <header className="header__contact">
        <span>applestore@gmail.com | </span>
        <span> +2348162366357</span>
      </header>
      <section className="container-menu">
        <div className="mobile-menu">
          <span className="toggle-icon" onClick={handleToggle}>
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
          <img src={logo} alt="logo" className="App-logo" />
        </div>
        <div className="search-section">
          <Search />
        </div>
        <nav>
          <div className={`navbar-links`}>
            <Link to="/" className="active">
              Home
            </Link>
            <Link to="/shop">Shop</Link>
            <Link to="/product">Product</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <NavLink to="/cart" activeClassName="active">
            <div className="icon">
              <img src={message} alt="Message Icon" />
              <span className="badge-nav">10</span>
            </div>
          </NavLink>

          <NavLink to="/cart" activeClassName="active">
            <div className="icon">
              <img src={notification} alt="Notification Icon" />
              <span className="badge-nav">10</span>
            </div>
          </NavLink>

          <div className="right-section">
            <Link to="/login">Login</Link>
            <Link to="/join">
              <button className="join">Join</button>
            </Link>
          </div>
        </nav>
      </section>

      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <div className="toggle-menu-logo">
              <img src={logo} alt="logo" className="mobile-App-logo" />
              <span className="close-icon" onClick={handleClose}>
                X
              </span>
            </div>
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/product">Product</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;

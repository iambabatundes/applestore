import React, { useState } from "react";
import "../components/styles/navbar.css";
import logo from "../logo.svg";
import message from "../message.svg";
import notification from "../notification.svg";
import { Link, NavLink } from "react-router-dom";
import Search from "./search";
import Icon from "./icon";
import LoginModal from "./loginModal";
import RegisterModal from "./registerModal";
// import NavRight from "./navRight";

function NavBar() {
  const [showNavbar, setShowNavbar] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClose = () => {
    setShowModal(false);
  };

  const handleToggle = () => {
    setShowNavbar(!showNavbar);
    setShowOverlay(!showOverlay);
  };

  const handleClose = () => {
    setShowNavbar(false);
    setShowOverlay(false);
  };

  const handleContinueClick = (e) => {
    e.preventDefault();
    setShowJoinModal(true);
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setShowLoginModal(true);
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  return (
    <header className="navbar__main">
      <header className="header__contact">
        <span>applestore@gmail.com | </span>
        <span> +2348162366357</span>
      </header>
      <section className="container-menu">
        <div className="mobile-menu">
          <Icon menu onClick={handleToggle} />

          <Link to="/">
            <img src={logo} alt="logo" className="App-logo" />
          </Link>
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

          <NavLink to="/cart">
            <div className="icon">
              <Icon cart className="cart-icon" />
              <span className="badge-nav">10</span>
            </div>
          </NavLink>

          <div className="right-section">
            <section>
              <span
                style={{ cursor: "pointer" }}
                className="nav-login"
                onClick={() => setShowModal(true)}
              >
                Login
              </span>

              {showModal && (
                <LoginModal
                  onClose={handleLoginClose}
                  onOpen={() => setOpenModal(true)}
                  handleLoginClick={handleLoginClick}
                  setShowLoginModal={setShowLoginModal}
                  showLoginModal={showLoginModal}
                  handleFormClick={handleFormClick}
                />
              )}
            </section>

            <section>
              <button onClick={() => setOpenModal(true)} className="join">
                Join
              </button>

              {openModal && (
                <RegisterModal
                  onClose={() => setOpenModal(false)}
                  onOpen={() => setShowModal(true)}
                  setShowJoinModal={setShowJoinModal}
                  showJoinModal={showJoinModal}
                  handleContinueClick={handleContinueClick}
                  handleFormClick={handleFormClick}
                />
              )}
            </section>
          </div>
        </nav>
      </section>

      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <div className="toggle-menu-logo">
              <img src={logo} alt="logo" className="mobile-App-logo" />
              <Icon closed onClick={handleClose} className="close-icon" />
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

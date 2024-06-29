import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import cart from "./images/cartItem.png";
import UserImage from "./images/user.png";
import "./styles/navbar.css";

export default function Navbar({ user, cartItemCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [geoLocation, setGeoLocation] = useState("");

  useEffect(() => {
    if (!user) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.ipgeolocation.io/ipgeo?apiKey=74d7025b99284e5ab87ede8a6b623e9b&lat=${latitude}&long=${longitude}`
            );
            const data = await response.json();
            setGeoLocation(data.country_name);
          } catch (error) {
            console.error("Error fetching geolocation data: ", error);
          }
        },
        (error) => {
          console.error("Error getting user's location: ", error);
        }
      );
    }
  }, [user]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="#home">
          <img
            src="https://www.amazon.com/favicon.ico"
            alt="Brand Logo"
            className="brand-logo"
          />
        </Link>
      </div>

      <form className="navbar-search">
        <select className="category-select">
          <option value="all">All</option>
          <option value="electronics">Electronics</option>
          <option value="fashion">Fashion</option>
          <option value="home-kitchen">Home & Kitchen</option>
        </select>
        <input type="text" className="search-input" placeholder="Search..." />
        <button className="search-button">
          <i className="fa fa-search"></i>
        </button>
      </form>

      <section className="navbar-actions">
        {!user ? (
          <>
            <div className="navbar-user-container">
              <div className="navbar-user__main" onClick={toggleDropdown}>
                <img src={UserImage} alt="User" className="navbar-user-image" />
                <div className="navbar-signin-main">
                  <h1 className="navbar-user-greeting">Hello!</h1>
                  <span>Sign in</span>
                </div>
                <i
                  className={`fa ${
                    isDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"
                  } navbar-dropdown-chevron`}
                ></i>
              </div>
              {isDropdownOpen && (
                <div className="navbar-dropdown-menu">
                  <Link to="/login" className="navbar-dropdown-item">
                    <i className="fa fa-sign-in-alt"></i> Sign In
                  </Link>
                  <Link to="/register" className="navbar-dropdown-item">
                    <i className="fa fa-user-plus"></i> Register
                  </Link>
                  <Link to="/help" className="navbar-dropdown-item">
                    <i className="fa fa-question-circle"></i> Help
                  </Link>
                  {!user ? (
                    <Link to="/my-dashboard" className="navbar-dropdown-item">
                      <i className="fa fa-question-circle"></i> My Dashboard
                    </Link>
                  ) : (
                    Navigate("/login")
                  )}
                </div>
              )}
            </div>
            <div className="navbar-user-container">
              <Link to="/address" className="navbar-user__main">
                <i className="fa fa-map-marker map-marker"></i>
                <div className="navbar-signin-main">
                  <h1 className="navbar-user-greeting">Deliver to!</h1>
                  <span>{geoLocation}</span>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="navbar-user-container">
              <div className="navbar-user__main" onClick={toggleDropdown}>
                <img
                  src={user.profileImage || UserImage}
                  alt="User"
                  className="navbar-user-image"
                />
                <div className="navbar-signin-main">
                  <h1 className="navbar-user-greeting">Hello!</h1>
                  <span>{user.username}</span>
                </div>
                <i
                  className={`fa ${
                    isDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"
                  } navbar-dropdown-chevron`}
                ></i>
              </div>
              {isDropdownOpen && (
                <div className="navbar-dropdown-menu">
                  <Link to="/my-dashboard" className="navbar-dropdown-item">
                    <i className="fa fa-user"></i> My Dashboard
                  </Link>
                  <Link to="/profile" className="navbar-dropdown-item">
                    <i className="fa fa-user"></i> My Account
                  </Link>
                  <Link to="/orders" className="navbar-dropdown-item">
                    <i class="fa fa-envelope"></i> My Orders
                  </Link>
                  <Link to="/messages" className="navbar-dropdown-item">
                    <i className="fa fa-envelope"></i> My Messages
                  </Link>
                  <Link to="/saved-items" className="navbar-dropdown-item">
                    <i className="fa fa-heart"></i> My Saved Items
                  </Link>
                  <Link to="/logout" className="navbar-dropdown-item logout">
                    <i className="fa fa-sign-out-alt"></i> Logout
                  </Link>
                </div>
              )}
            </div>
            <div className="navbar-user-address">
              <Link to="/address" className="navbar-address__main">
                <i className="fa fa-map-marker map-marker"></i>
                <div className="navbar-address__container">
                  <h1 className="navbar-user-greeting">Deliver to!</h1>
                  <span>{user.address || geoLocation}</span>
                </div>
              </Link>
            </div>
          </>
        )}
      </section>

      <div className="navbar-cart">
        <Link to="/cart" className="navbar-cart-link">
          <img src={cart} alt="Cart" className="navbar-cart-icon" />
          <h2 className="navbar-cart-text">Cart</h2>
          <div className="cart-item-count">{cartItemCount}</div>
        </Link>
      </div>

      <div className={`navbar-menu ${isOpen ? "is-active" : ""}`}>
        <Link to="#orders">Returns & Orders</Link>
      </div>
      <button className="navbar-burger" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}

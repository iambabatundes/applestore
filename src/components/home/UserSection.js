import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import config from "../../config.json";
import "./styles/userSection.css";
import { getProfileImageUrl } from "./utils/profileImageUtils";

export default function UserSection({
  user,
  toggleDropdown,
  isDropdownOpen,
  className,
}) {
  return (
    <>
      {!user ? (
        <>
          <div className={`navbar-user-container ${className}`}>
            <div className="navbar-user__main" onClick={toggleDropdown}>
              <Avatar
                src="/default-avatar.png"
                sx={{ width: 35, height: 35, mr: 1 }}
              />

              <div className="navbar-signin-main">
                <h1 className="navbar-user-greeting">Hello!</h1>
                <span>Sign in</span>
              </div>
              <span className="chevron-display">
                <i
                  className={`fa ${
                    isDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"
                  } navbar-dropdown-chevron`}
                ></i>
              </span>
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

                <Link to="/users/my-dashboard" className="navbar-dropdown-item">
                  <i className="fa fa-question-circle"></i> My Dashboard
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={`navbar-user-container ${className}`}>
            <div className="navbar-user__main" onClick={toggleDropdown}>
              <Avatar
                src={getProfileImageUrl(user.profileImage)}
                alt={`${user.firstName} ${user.lastName}`}
                sx={{ width: 40, height: 40, mr: 1 }}
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />

              <div className="navbar-signin-main">
                <h1 className="navbar-user-greeting">Hello!</h1>
                <span>{user.username}</span>
              </div>
              <span className="chevron-display">
                <i
                  className={`fa ${
                    isDropdownOpen ? "fa-chevron-up" : "fa-chevron-down"
                  } navbar-dropdown-chevron`}
                ></i>
              </span>
            </div>
            {isDropdownOpen && (
              <div className="navbar-dropdown-menu">
                <Link to="/users/my-dashboard" className="navbar-dropdown-item">
                  <i className="fa fa-user"></i> My Dashboard
                </Link>
                <Link to="/users/my-profile" className="navbar-dropdown-item">
                  <i className="fa fa-user"></i> My Account
                </Link>
                <Link to="/users/my-orders" className="navbar-dropdown-item">
                  <i className="fa fa-envelope"></i> My Orders
                </Link>
                <Link to="/users/my-messages" className="navbar-dropdown-item">
                  <i className="fa fa-envelope"></i> My Messages
                </Link>
                <Link to="/users/saved-items" className="navbar-dropdown-item">
                  <i className="fa fa-heart"></i> My Saved Items
                </Link>
                <Link to="/logout" className="navbar-dropdown-item logout">
                  <i className="fa fa-sign-out-alt"></i> Logout
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

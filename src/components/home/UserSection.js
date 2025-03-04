import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import config from "../../config.json";

export default function UserSection({
  user,
  geoLocation,
  toggleDropdown,
  isDropdownOpen,
}) {
  return (
    <>
      {!user ? (
        <>
          <div className="navbar-user-container">
            <div className="navbar-user__main" onClick={toggleDropdown}>
              <Avatar
                src="/default-avatar.png"
                sx={{ width: 35, height: 35, mr: 1 }}
              />

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

                <Link to="/users/my-dashboard" className="navbar-dropdown-item">
                  <i className="fa fa-question-circle"></i> My Dashboard
                </Link>
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
              <Avatar
                src={
                  user.profileImage instanceof File
                    ? URL.createObjectURL(user.profileImage)
                    : user.profileImage
                    ? `${config.mediaUrl}/uploads/${user.profileImage.filename}`
                    : "/default-avatar.png"
                }
                alt={`${user.firstName} ${user.lastName}`}
                sx={{ width: 40, height: 40, mr: 1 }}
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
          <div className="navbar-user-address">
            <Link to="/address" className="navbar-address__main">
              <i className="fa fa-map-marker map-marker"></i>
              <div className="navbar-address__container">
                <h1 className="navbar-user-greeting">Deliver to!</h1>
                <span>{user.address?.country || geoLocation}</span>
              </div>
            </Link>
          </div>
        </>
      )}
    </>
  );
}

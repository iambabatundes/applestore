import React from "react";
import {
  FaHome,
  FaUser,
  FaBox,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCog,
  FaStar,
  FaArrowRight,
  FaArrowLeft,
  FaCreditCard,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { Avatar } from "@mui/material";
import config from "../../../../config.json";
import "../styles/sidebarLeft.css";

export default function SidebarLeft({ isOpen, toggleSidebar, user, isMobile }) {
  const location = useLocation();

  const getProfileImageUrl = () => {
    if (user?.profileImage) {
      if (user.profileImage instanceof File) {
        return URL.createObjectURL(user.profileImage);
      }
      if (typeof user.profileImage === "string") {
        return `${config.mediaUrl}/uploads/${user.profileImage}`;
      }
      if (user.profileImage?.filename) {
        return `${config.mediaUrl}/uploads/${user.profileImage.filename}`;
      }
    }
    return "/default-avatar.png";
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return isOpen ? (
    <aside className="sidebar-left open">
      <div className="sidebar-toggle-left" onClick={toggleSidebar}>
        <FaArrowLeft className="open__icon" /> Close
      </div>

      <div className="profile-section">
        <Avatar
          src={getProfileImageUrl()}
          alt={`${user.firstName} ${user.lastName}`}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <h2>{user.firstName}</h2>
        <p>{user.email}</p>
      </div>

      <nav className="menu">
        <Link
          to="/users/my-dashboard"
          className={isActive("/users/my-dashboard") ? "active" : ""}
        >
          <FaHome className="menu-icon" /> Dashboard
        </Link>
        <Link
          to="/users/my-profile"
          className={isActive("/users/my-profile") ? "active" : ""}
        >
          <FaUser className="menu-icon" /> My Profile
        </Link>
        <Link
          to="/users/my-orders"
          className={isActive("/users/my-orders") ? "active" : ""}
        >
          <FaBox className="menu-icon" /> Orders
        </Link>
        <Link
          to="/users/my-payments"
          className={isActive("/users/my-payments") ? "active" : ""}
        >
          <FaCreditCard className="menu-icon" /> Payments
        </Link>
        <Link
          to="/users/my-messages"
          className={isActive("/users/my-messages") ? "active" : ""}
        >
          <FaEnvelope className="menu-icon" /> Messages
        </Link>
        <Link
          to="/users/my-address"
          className={isActive("/users/my-address") ? "active" : ""}
        >
          <FaMapMarkerAlt className="menu-icon" /> Address
        </Link>
        <Link
          to="/users/my-settings"
          className={isActive("/users/my-settings") ? "active" : ""}
        >
          <FaCog className="menu-icon" /> Settings
        </Link>
      </nav>

      {/* <div className="userUpgrade">
        <h1>
          <FaStar className="menu-icon" /> Upgrade to Premium
        </h1>
        <button className="upgrade__btn">Get Started</button>
      </div> */}
    </aside>
  ) : (
    <div className="sidebar-toggle-left closed" onClick={toggleSidebar}>
      <FaArrowRight className="closed__icon" />
      <span className="content-open">Open</span>
    </div>
  );
}

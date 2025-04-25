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
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import config from "../../../../config.json";

export default function SidebarLeft({ isOpen, toggleSidebar, user }) {
  return isOpen ? (
    <aside className="sidebar-left open">
      <div className="sidebar-toggle-left" onClick={toggleSidebar}>
        <FaArrowLeft className="open__icon" /> Close
      </div>
      <div className="profile-section">
        <Avatar
          src={
            user.profileImage instanceof File
              ? URL.createObjectURL(user.profileImage)
              : user.profileImage
              ? `${config.mediaUrl}/uploads/${user.profileImage?.filename}`
              : "/default-avatar.png"
          }
          alt={`${user.firstName} ${user.lastName}`}
          sx={{ width: 100, height: 100, mb: 2 }}
        />

        <h2>{user.firstName}</h2>
        <p>{user.email}</p>
      </div>
      <nav className="menu">
        <Link to="/users/my-dashboard">
          <FaHome className="menu-icon" /> Dashboard
        </Link>
        <Link to="/users/my-profile">
          <FaUser className="menu-icon" /> My Profile
        </Link>
        <Link to="/users/my-orders">
          <FaBox className="menu-icon" /> Orders
        </Link>
        <Link to="/users/my-messages">
          <FaEnvelope className="menu-icon" /> Messages
        </Link>
        <Link to="/users/my-address">
          <FaMapMarkerAlt className="menu-icon" /> Address
        </Link>
        <Link to="/users/my-settings">
          <FaCog className="menu-icon" /> Settings
        </Link>
      </nav>
      <div className="userUpgrade">
        <h1>
          <FaStar className="menu-icon" /> Upgrade to Premium
        </h1>
        <button className="upgrade__btn">Get Started</button>
      </div>
    </aside>
  ) : (
    <div className="sidebar-toggle-left closed" onClick={toggleSidebar}>
      <FaArrowRight className="closed__icon" />
      <span className="content-open">Open</span>
    </div>
  );
}

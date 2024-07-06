import React from "react";
import {
  FaHome,
  FaUser,
  FaBox,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCog,
  FaStar,
  // FaTimes,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import defaultImage from "../../images/user.png";
import config from "../../../../config.json";

export default function SidebarLeft({ isOpen, toggleSidebar, user }) {
  return isOpen ? (
    <aside className="sidebar-left open">
      <div className="sidebar-toggle-left" onClick={toggleSidebar}>
        <FaArrowLeft className="icon" /> Close
      </div>
      <div className="profile-section">
        <img
          src={
            `${config.mediaUrl}/uploads/${user.profileImage?.filename}` ||
            defaultImage
          }
          alt=""
          className="profile-pic"
        />
        <h2>{user.firstName}</h2>
        <p>{user.email}</p>
      </div>
      <nav className="menu">
        <Link to="my-dashboard">
          <FaHome className="menu-icon" /> Dashboard
        </Link>
        <Link to="my-profile">
          <FaUser className="menu-icon" /> My Profile
        </Link>
        <Link to="my-orders">
          <FaBox className="menu-icon" /> Orders
        </Link>
        <Link to="my-messages">
          <FaEnvelope className="menu-icon" /> Messages
        </Link>
        <Link to="my-address">
          <FaMapMarkerAlt className="menu-icon" /> Address
        </Link>
        <Link to="my-settings">
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
      <FaArrowRight className="icon" />
      <span className="content-open">Open</span>
    </div>
  );
}

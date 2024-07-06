import React from "react";
import { FaBell, FaSearch, FaBars } from "react-icons/fa";

export default function TopNavbar({ greeting, user }) {
  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <h1>
          {greeting}, {user.username}!
        </h1>
        <FaBell className="icon" />
        <button className="new-course-btn">Order New Product</button>
      </div>
      <div className="navbar-right">
        <FaSearch className="icon" />
        <FaBars className="icon" />
      </div>
    </nav>
  );
}

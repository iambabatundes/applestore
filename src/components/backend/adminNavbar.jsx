import React from "react";
import userImage from "./images/user.png";
import logo from "../../logo.svg";
import "./styles/adminNavbar.css";
import Icon from "../icon";

export default function AdminNavbar({
  companyName,
  count,
  handleToggle,
  userName,
}) {
  return (
    <header className="admin-navbar">
      <div className="admin-navbar__left">
        <Icon menu onClick={handleToggle} menuClassname="admin-menu__icon" />
        {/* <Icon menu onClick={handleToggle} className="admin-menu__icon" /> */}
        <img src={logo} alt="Company logo" className="company-logo" />
        <h1 className="company-name">{companyName}</h1>
      </div>
      <div className="admin-navbar__center">
        <div className="admin-navbar__comments">
          <i className="fa fa-comment" aria-hidden="true"></i>
          <span>{count}</span>
        </div>
      </div>
      <div className="admin-navbar__right">
        <h4>Hi,</h4>
        <span className="admin__userName">{userName}</span>
        <img src={userImage} alt="User" className="user-image" />
      </div>
    </header>
  );
}

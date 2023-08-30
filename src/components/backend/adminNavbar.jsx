import React from "react";
import userImage from "./images/user.png";
import logo from "../../logo.svg";
import "./styles/adminNavbar.css";
import Icon from "../icon";

export default function AdminNavbar({ companyName, count, handleToggle }) {
  return (
    <section className="admin-navbar__main">
      <div className="admin-navbar">
        <div className="adminLogo">
          <Icon menu onClick={handleToggle} className="admin-menu__icon" />
          <img src={logo} alt="Company logo" />
          <h1>{companyName}</h1>
        </div>

        <div className="admin-navbar__comments">
          <i className="fa fa-comment" aria-hidden="true"></i>
          {/* <Icon comment /> */}
          <span>{count}</span>
        </div>
      </div>

      <div className="admin-navbar__user">
        <h4>Hi,</h4>
        <span className="admin__companyName">{companyName}</span>
        <img src={userImage} alt="User image" />
      </div>
    </section>
  );
}

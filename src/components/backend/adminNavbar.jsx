import React from "react";
import logo from "../../logo.svg";

export default function AdminNavbar({ companyName, count }) {
  return (
    <section>
      <div>
        <div className="logo">
          <img src={logo} alt="Company logo" />
          <h1>{companyName}</h1>
        </div>

        <div className="comments">
          <i className="fas fa-comment"></i>
          <span>{count}</span>
        </div>
      </div>

      <div className="">
        <h4>Hi,</h4>
        <span>{companyName}</span>
        <img src={logo} alt="" />
      </div>
    </section>
  );
}

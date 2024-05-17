import React from "react";
import { Link } from "react-router-dom";

export default function UserHeader() {
  return (
    <header className="user__header">
      <h1 className="user-title">Users </h1>
      <Link to="/admin/add-product">
        <button className="user-btn">Add New</button>
      </Link>

      <Link to="/admin/add-product">
        <button className="user-btn">Import</button>
      </Link>
    </header>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function OrderHeader() {
  return (
    <header className="order__header">
      <h1 className="order-title">Orders</h1>
      <Link to="/admin/add-product">
        <button className="order-btn">Add New</button>
      </Link>

      <Link to="/admin/add-product">
        <button className="order-btn">Import</button>
      </Link>

      <Link to="/admin/add-product">
        <button className="order-btn">Export</button>
      </Link>
    </header>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function ProductHeader() {
  function handleDownload() {}
  return (
    <header className="product__header">
      <h1 className="headerData-title">Products</h1>
      <Link to="/admin/add-product">
        <button className="headerData-btn">Add New</button>
      </Link>

      <Link to="/admin/add-product">
        <button className="headerData-btn">Import</button>
      </Link>

      <Link to="/admin/add-product">
        <button className="headerData-btn">Export</button>
      </Link>

      <span onClick={handleDownload}>
        <button className="headerData-btn">Download Sample</button>
      </span>
    </header>
  );
}

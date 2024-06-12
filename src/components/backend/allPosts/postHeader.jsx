import React from "react";
import { Link } from "react-router-dom";

import "./styles/post.css";

export default function PostHeader({ darkMode }) {
  return (
    <header className={`allPost__header ${darkMode ? "dark-mode" : ""}`}>
      <h1 className={`allPost-title ${darkMode ? "dark-mode" : ""}`}>Posts</h1>
      <Link to="/admin/create">
        <button className={`allPost-btn ${darkMode ? "dark-mode" : ""}`}>
          Add New
        </button>
      </Link>
    </header>
  );
}

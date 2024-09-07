import React from "react";

export default function SearchBar() {
  return (
    <form className="navbar-search">
      <input type="text" className="search-input" placeholder="Search..." />
      <button className="search-button">
        <i className="fa fa-search"></i>
      </button>
    </form>
  );
}

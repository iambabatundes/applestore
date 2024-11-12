import React from "react";
import "./styles/tags.css";

function TagSearchBox({ value, onChange }) {
  return (
    <input
      name="query"
      type="text"
      className="searchBox"
      onChange={(e) => onChange(e.target.value)}
      value={value}
      placeholder="Search..."
      aria-label="Search"
    />
  );
}

export default TagSearchBox;

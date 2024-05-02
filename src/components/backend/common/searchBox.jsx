import React from "react";

function SearchBox({ value, onChange }) {
  return (
    <input
      name="query"
      type="text"
      className="form-control mb-3"
      onChange={(e) => onChange(e.target.value)}
      value={value}
      placeholder="Search..."
    />
  );
}

export default SearchBox;

import React from "react";
import "./styles/MediaLibrary.css";

export default function MediaSearch({ mediaSearch, handleSearch }) {
  return (
    <section>
      <input
        type="search"
        value={mediaSearch}
        onChange={handleSearch}
        placeholder="Search..."
        className="MediaSearch"
      />
    </section>
  );
}

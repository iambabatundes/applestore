import React from "react";

export default function MediaFilter({ selectedFilter, handleFilterChange }) {
  return (
    <div className="allMediaItem-main">
      <select
        name="allMediaItem"
        id="allMediaItem"
        className="allMediadata"
        onChange={handleFilterChange}
        value={selectedFilter}
      >
        <option value="">All media item</option>
        <option value="image">Images</option>
        <option value="video">Videos</option>
        <option value="doc">Documents</option>
        <option value="pdf">PDFs</option>
      </select>
    </div>
  );
}

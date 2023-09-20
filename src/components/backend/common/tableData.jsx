import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import "../styles/posts.css";

export default function TableData({
  handleSelectAllChange,
  handleSort,
  selectAll,
  sortBy,
  currentPosts,
  formatPermalink,
  handlePostCheckboxChange,
  onEdit,
  onTrash,
  onPreview,
  hoveredPost,
  handleMouseEnter,
  handleMouseLeave,
}) {
  return (
    <table className="allPost-table post-list">
      <TableHeader
        handleSelectAllChange={handleSelectAllChange}
        handleSort={handleSort}
        selectAll={selectAll}
        sortBy={sortBy}
      />

      <TableBody
        currentPosts={currentPosts}
        formatPermalink={formatPermalink}
        handlePostCheckboxChange={handlePostCheckboxChange}
        onEdit={onEdit}
        onPreview={onPreview}
        hoveredPost={hoveredPost}
        onTrash={onTrash}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
    </table>
  );
}

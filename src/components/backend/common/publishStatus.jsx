import React from "react";

export default function PublishStatus() {
  return (
    <div className="post-actions postbox post-status">
      <i className="fa fa-exclamation" aria-hidden="true"></i>
      Status:
      <span className="post-display" id="post-status-display">
        Draft
      </span>
    </div>
  );
}

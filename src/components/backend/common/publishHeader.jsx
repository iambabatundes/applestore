import React from "react";
import "../styles/createNew.css";

export default function PublishHeader({
  toggleContent,
  publishTitle,
  isContentVisible,
}) {
  return (
    <div className="createPost-publish-main" onClick={toggleContent}>
      <h3 className="createPost-publish__title">{publishTitle}</h3>
      <i
        className={`fa fa-caret-${isContentVisible ? "down" : "up"}`}
        aria-hidden="true"
      ></i>
    </div>
  );
}

import React from "react";
import "../styles/createNew.css";

export default function TagsHeader({ onClick, TagsTitle, isTagsVisible }) {
  return (
    <div className="createPost-publish-main" onClick={onClick}>
      <h3 className="createPost-publish__title">{TagsTitle}</h3>
      <i
        className={`fa fa-caret-${isTagsVisible ? "down" : "up"}`}
        aria-hidden="true"
      ></i>
    </div>
  );
}

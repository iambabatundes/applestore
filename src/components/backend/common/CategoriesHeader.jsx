import React from "react";
import "../styles/createNew.css";

export default function CategoryHeader({
  onClick,
  CategoryTitle,
  isCategoriesVisible,
}) {
  return (
    <div className="createPost-publish-main" onClick={onClick}>
      <h3 className="createPost-publish__title">{CategoryTitle}</h3>
      <i
        className={`fa fa-caret-${isCategoriesVisible ? "down" : "up"}`}
        aria-hidden="true"
      ></i>
    </div>
  );
}

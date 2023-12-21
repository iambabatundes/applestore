import React from "react";
import "../styles/createNew.css";

export default function FeaturedImageHeader({
  onClick,
  FeaturedImageTitle,
  isFeaturedImageVisible,
}) {
  return (
    <div className="createPost-publish-main" onClick={onClick}>
      <h3 className="createPost-publish__title">{FeaturedImageTitle}</h3>
      <i
        className={`fa fa-caret-${isFeaturedImageVisible ? "down" : "up"}`}
        aria-hidden="true"
      ></i>
    </div>
  );
}

import React from "react";
import "../styles/createNew.css";

export default function ProductGallaryHeader({
  onClick,
  productGallaryTitle,
  dataImageVisible,
}) {
  return (
    <div className="createPost-publish-main" onClick={onClick}>
      <h3 className="createPost-publish__title">{productGallaryTitle}</h3>
      <i
        className={`fa fa-caret-${dataImageVisible ? "down" : "up"}`}
        aria-hidden="true"
      ></i>
    </div>
  );
}

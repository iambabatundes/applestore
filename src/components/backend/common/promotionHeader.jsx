import React from "react";
import "../styles/createNew.css";

export default function PromotionsHeader({
  onClick,
  promotionTitle,
  isPromotionVisible,
}) {
  return (
    <div className="createPost-publish-main" onClick={onClick}>
      <h3 className="createPost-publish__title">{promotionTitle}</h3>
      <i
        className={`fa fa-caret-${isPromotionVisible ? "down" : "up"}`}
        aria-hidden="true"
      ></i>
    </div>
  );
}

import React from "react";
import "../styles/promotions.css";

export default function PromotionList({ promotions, onEdit, onDelete }) {
  if (promotions.length === 0) {
    return <p>No promotions available</p>;
  }

  return (
    <div className="promotion-list">
      {promotions.map((promotion) => (
        <div className="promotion-card" key={promotion._id}>
          <h2>{promotion.name}</h2>
          <p>{promotion.description}</p>
          <p>Type: {promotion.promotionType}</p>
          {promotion.promotionType === "Discount" && (
            <p>Discount: {promotion.discountPercentage}%</p>
          )}
          {promotion.promotionType === "FlashSale" && (
            <p>Flash Sale Price: {promotion.flashSalePrice}</p>
          )}
          {promotion.promotionType === "FreeShipping" && (
            <p>Shipping Discount: {promotion.shippingDiscount}%</p>
          )}
          {promotion.promotionType === "BundleDeal" && (
            <p>
              Buy {promotion.minimumQuantity} and get {promotion.freeQuantity}{" "}
              free
            </p>
          )}
          <p>Active: {promotion.isActive ? "Yes" : "No"}</p>
          <p>
            Valid from: {new Date(promotion.startDate).toLocaleDateString()} to{" "}
            {new Date(promotion.endDate).toLocaleDateString()}
          </p>
          <div className="promotion-actions">
            <button onClick={() => onEdit(promotion)}>Edit</button>
            <button onClick={() => onDelete(promotion._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import "../styles/promotionList.css";

export default function PromotionList({
  promotions,
  onEdit,
  onDelete,
  loading,
  error,
}) {
  if (loading) {
    return (
      <span className="shippingRate__loading">Loading coupon list...</span>
    );
  }

  if (error) {
    return <span className="shipping__error">Error loading coupon list</span>;
  }

  if (!promotions || promotions.length === 0) {
    return <p>No promotions available</p>;
  }

  return (
    <div className="promotion-list">
      {promotions.map((promotion) => (
        <div className="promotionList__card" key={promotion._id}>
          <div>
            <span className="promotionList__label">Promotion Name:</span>
            <h2 className="promotionList__name">{promotion.name}</h2>
          </div>

          <div>
            <span className="promotionList__label">Promotion Description:</span>
            <p className="promotionList__name">{promotion.description}</p>
          </div>

          <div>
            <p className="promotionList__name">
              Type: {promotion.promotionType}
            </p>
            {promotion.promotionType === "Discount" && (
              <p className="promotionList__discount">
                Discount: {promotion.discountPercentage}%
              </p>
            )}
            {promotion.promotionType === "FlashSale" && (
              <p className="promotionList__flashSale">
                Flash Sale Price: {promotion.flashSalePrice}
              </p>
            )}
            {promotion.promotionType === "FreeShipping" && (
              <p className="promotionList__shippingDiscount">
                Shipping Discount: {promotion.shippingDiscount}%
              </p>
            )}
            {promotion.promotionType === "BundleDeal" && (
              <p className="promotionList__mini">
                Buy {promotion.minimumQuantity} and get {promotion.freeQuantity}{" "}
                free
              </p>
            )}
          </div>

          <p className="promotionList__isActive">
            isActive: {promotion.isActive ? "Yes" : "No"}
          </p>
          <p className="promotionList__date">
            Start Date: {new Date(promotion.startDate).toLocaleDateString()}
          </p>

          <p className="promotionList__date">
            End Date: {new Date(promotion.endDate).toLocaleDateString()}
          </p>
          <div className="promotionList__actions">
            <button
              className="promotionList__onEdit"
              onClick={() => onEdit(promotion)}
            >
              {" "}
              <FaEdit /> Edit
            </button>
            <button
              className="promotionList__onDelete"
              onClick={() => onDelete(promotion._id)}
            >
              {" "}
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

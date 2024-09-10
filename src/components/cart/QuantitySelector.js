import React from "react";

export default function QuantitySelector({
  isQuantityTenPlus,
  selectedQuantity,
  onQuantityChange,
  onTenPlusChange,
  handleSubmit,
  quantityTenPlusValue,
}) {
  return isQuantityTenPlus ? (
    <form onSubmit={handleSubmit} className="cart-item__form">
      <input
        type="number"
        className="cart-item__input"
        min="1"
        value={quantityTenPlusValue}
        onChange={onTenPlusChange}
      />
      <button className="cart-quantity10__btn" type="submit">
        Update
      </button>
    </form>
  ) : (
    <select
      value={selectedQuantity}
      className="cart-item__select"
      onChange={(e) => onQuantityChange(e.target.value)}
    >
      {Array.from({ length: 9 }, (_, index) => (
        <option key={index + 1} value={index + 1}>
          Qty: {index + 1}
        </option>
      ))}
      <option value="10+">10+</option>
    </select>
  );
}

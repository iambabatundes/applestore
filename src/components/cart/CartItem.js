import React from "react";
import { Link } from "react-router-dom";
import QuantitySelector from "./QuantitySelector";

export default function CartItem({
  item,
  selectedQuantity,
  isQuantityTenPlus,
  handleQuantityChange,
  handleQuantityTenPlusChange,
  handleSubmit,
  handleDelete,
}) {
  return (
    <section className="cart-item">
      <article className="cart-item__main">
        <img src={item.image} alt={item.name} width={100} />
        <div className="cart-item__content">
          <div className="item-details">
            <Link to={`/${item.name.toLowerCase().replaceAll(" ", "-")}`}>
              <h2>{item.name}</h2>
            </Link>
            <span className="cart-item__price">${item.price}</span>
            <p>In Stock: {item.inStock}</p>
          </div>
          <div className="item-actions">
            <QuantitySelector
              isQuantityTenPlus={isQuantityTenPlus}
              selectedQuantity={selectedQuantity}
              onQuantityChange={(value) =>
                handleQuantityChange(item._id, value)
              }
              onTenPlusChange={(e) => handleQuantityTenPlusChange(e, item._id)}
              handleSubmit={(e) => handleSubmit(e, item._id)}
              quantityTenPlusValue={
                isQuantityTenPlus ? item.quantityTenPlus : ""
              }
            />
            <span
              className="cart-item__span"
              onClick={() => handleDelete(item._id)}
            >
              Delete
            </span>
            <span className="cart-item__span">Save for Later</span>
            <span className="cart-item__span">Share</span>
          </div>
        </div>
      </article>
    </section>
  );
}

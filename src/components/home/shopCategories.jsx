import React from "react";
import "./styles/shopCategories.css";
import productImage from "./images/produ1.avif";
import productImage1 from "./images/produ2.avif";

export default function ShopCategories() {
  const categories = [
    { name: "Electronics", image: productImage1 },
    { name: "Fashion", image: productImage },
    { name: "Home", image: productImage1 },
    { name: "Books", image: productImage },
    { name: "Toys", image: productImage1 },
  ];

  return (
    <div className="shop-categories">
      <h2 className="shop-categories-title">Shop by Category</h2>
      <div className="shop-categories-grid">
        {categories.map((category, index) => (
          <div key={index} className="shop-category-item">
            <img src={category.image} alt={category.name} />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import "./ShopCategories.css";

export default function ShopCategories() {
  const categories = [
    { name: "Electronics", image: "electronics.jpg" },
    { name: "Fashion", image: "fashion.jpg" },
    { name: "Home", image: "home.jpg" },
    { name: "Books", image: "books.jpg" },
    { name: "Toys", image: "toys.jpg" },
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

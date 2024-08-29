import React, { useState, useEffect } from "react";
import "./styles/bigSave.css";
import { getProducts } from "./common/productDatas";
import ProductCard from "./common/productCard";

export default function BigSave({ addToCart, cartItems }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchedProducts = getProducts();
    setProducts(fetchedProducts);
  }, []);

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  return (
    <section className="big-save">
      <div className="big-save-header">
        <div className="big-save-banner"></div>
      </div>

      <div className="bigSave__product">
        {products.map((product, index) => {
          return (
            <ProductCard
              key={index}
              addToCart={addToCart}
              item={product}
              handleRatingChange={handleRatingChange}
              cartItems={cartItems}
              productName={product}
            />
          );
        })}
      </div>
    </section>
  );
}

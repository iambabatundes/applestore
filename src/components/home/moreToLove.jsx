import React, { useState, useEffect } from "react";
import "../styles/moreToLove.css";
import { getProducts } from "./common/productDatas";
import ProductCard from "./common/productCard";

export default function MoreToLove({
  addToCart,
  cartItems,
  conversionRate,
  selectedCurrency,
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchedProducts = getProducts();
    setProducts(fetchedProducts);
  }, []);

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  return (
    <div className="moreToLove">
      <h2>More to love</h2>
      <div className="moreToLove__main">
        {products.map((product) => {
          return (
            <ProductCard
              key={product.id}
              addToCart={addToCart}
              item={product}
              handleRatingChange={handleRatingChange}
              cartItems={cartItems}
              productName={product}
              conversionRate={conversionRate}
              selectedCurrency={selectedCurrency}
            />
          );
        })}
      </div>
    </div>
  );
}

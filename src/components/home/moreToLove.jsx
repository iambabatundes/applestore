import React, { useState, useEffect } from "react";
import "../styles/moreToLove.css";
import ProductCard from "./common/productCard";
import { getProducts } from "../../services/productService";

export default function MoreToLove({
  addToCart,
  cartItems,
  conversionRate,
  selectedCurrency,
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("Cart Items:", cartItems);
  }, [cartItems]);

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="moreToLove">
      <h2>More to love</h2>
      <div className="moreToLove__main">
        {products.map((product) => {
          return (
            <ProductCard
              key={product._id}
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

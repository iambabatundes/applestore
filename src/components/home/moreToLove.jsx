import { useEffect } from "react";
import "../styles/moreToLove.css";
import ProductCard from "./common/productCard";
import { useProductStore } from "./hooks/useProductStore";
import ProductSkeletonCard from "./moreToLove/ProductSkeletonCard";

export default function MoreToLove({
  addToCart,
  cartItems,
  conversionRate,
  selectedCurrency,
}) {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log("Cart Items:", cartItems);
  }, [cartItems]);

  const handleRatingChange = (newRating) => {
    console.log(`New rating for ${products.name}: ${newRating}`);
  };

  return (
    <div className="moreToLove">
      <h2>More to love</h2>
      <div className="moreToLove__main">
        {loading &&
          [...Array(8)].map((_, i) => <ProductSkeletonCard key={i} />)}

        {!loading && error && <p className="error-message">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="no-products">No products available yet</p>
        )}

        {!loading &&
          !error &&
          products.length > 0 &&
          products.map((product) => (
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
          ))}
      </div>
    </div>
  );
}

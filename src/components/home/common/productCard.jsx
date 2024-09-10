import React from "react";
import { Link } from "react-router-dom";
import "../styles/productCard.css";
import { formatPermalink } from "./utils";
import ProductImage from "./productImage";
import ProductLabels from "./ProductLabels";
import ProductRating from "./ProductRating";
import ProductPrice from "./productPrice";
import CartStatus from "./CartStatus";
import { useCart } from "./hooks/useCart";

export default function ProductCard({
  item,
  addToCart,
  handleRatingChange,
  cartItems,
  conversionRate,
  productName,
  selectedCurrency,
}) {
  const { added, handleAddToCart } = useCart(item, cartItems, addToCart);

  return (
    <div className={`productCard ${added ? "expanded" : ""}`}>
      <ProductImage src={item.image} alt={item.name} />

      <article className="productCard__content">
        <Link to={`/${formatPermalink(productName.name)}`}>
          <h1 className="productCard__product-name">{item.name}</h1>
        </Link>

        <ProductRating
          numberOfSales={item.numberOfSales}
          onRatingChange={handleRatingChange}
          rating={item.rating}
        />

        <ProductPrice
          conversionRate={conversionRate}
          selectedCurrency={selectedCurrency}
          originalPrice={item.originalPrice}
          price={item.price}
        />

        <ProductLabels
          choice={item.choice}
          discount={item.discount}
          shipping={item.shipping}
          superDeal={item.superDeal}
        />

        <CartStatus
          added={added}
          cartItems={cartItems}
          handleAddToCart={handleAddToCart}
          item={item}
        />
      </article>
    </div>
  );
}

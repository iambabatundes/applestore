// components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/productCard.css";
import { formatPermalink } from "./utils";
import ProductImage from "./productImage";
import ProductLabels from "./ProductLabels";
import ProductRating from "./ProductRating";
import ProductPrice from "./productPrice";
import CartStatus from "./CartStatus";
import config from "../../../config.json";
import useCart from "./hooks/useCart";

export default function ProductCard({
  item,
  cartItems,
  conversionRate,
  productName,
  selectedCurrency,
}) {
  // Use the optimized hook - it now returns instantly
  const { added, handleAddToCart, isAdding, isPending } = useCart(item);

  return (
    <div
      className={`productCard ${added ? "expanded" : ""} ${
        isAdding ? "adding" : ""
      }`}
    >
      <ProductImage
        src={
          item.featureImage && item.featureImage.filename
            ? `${import.meta.env.VITE_API_URL}/uploads/${
                item.featureImage.filename
              }`
            : "/default-image.jpg"
        }
        alt={item.name}
      />

      <article className="productCard__content">
        <Link to={`/${formatPermalink(productName.name)}`}>
          <h1 className="productCard__product-name">{item.name}</h1>
        </Link>
        <ProductRating
          purchaseCount={item.purchaseCount}
          reviews={item.reviewCount}
          rating={item.ratings}
        />
        <ProductPrice
          conversionRate={conversionRate}
          selectedCurrency={selectedCurrency}
          salePrice={item.salePrice}
          price={item.price}
        />
        <ProductLabels promotions={item.promotion || []} />

        <CartStatus
          added={added}
          cartItems={cartItems}
          handleAddToCart={handleAddToCart}
          item={item}
          isAdding={isAdding}
          isPending={isPending}
        />
      </article>
    </div>
  );
}

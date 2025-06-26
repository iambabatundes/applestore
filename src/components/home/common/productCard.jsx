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
import config from "../../../config.json";

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
      <ProductImage
        src={
          item.featureImage && item.featureImage.filename
            ? `${config.mediaUrl}/uploads/${item.featureImage.filename}`
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
          // numberOfSales={item.numberOfSales}
          // onRatingChange={handleRatingChange}
          // reviews={item.reviews}
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
        />
      </article>
    </div>
  );
}

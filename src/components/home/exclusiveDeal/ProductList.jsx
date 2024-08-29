import React from "react";
import "../styles/exclusiveDeal.css";

export default function ProductList({
  products,
  containerClassName,
  productClassName,
  imageClassName,
  priceClassName,
  discountClassName,
  oldPriceClassName,
  priceContainer,
}) {
  return (
    <div className={containerClassName}>
      {products.map((product, index) => (
        <div key={index} className={productClassName}>
          <img
            src={product.image}
            alt={`Product ${index + 1}`}
            className={imageClassName}
          />

          <article className={priceContainer}>
            <span className={priceClassName}>{product.price}</span>
            {product.discount && (
              <span className={discountClassName}>{product.discount}</span>
            )}
            {product.oldPrice && (
              <span className={oldPriceClassName}>{product.oldPrice}</span>
            )}
          </article>
        </div>
      ))}
    </div>
  );
}

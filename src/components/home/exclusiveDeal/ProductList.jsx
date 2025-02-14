import React from "react";
import "../styles/exclusiveDeal.css";
import { formatPrice } from "../common/utils";
import config from "../../../config.json";

export default function ProductList({
  products,
  containerClassName,
  productClassName,
  imageClassName,
  priceClassName,
  discountClassName,
  oldPriceClassName,
  priceContainer,
  selectedCurrency,
  conversionRate,
}) {
  return (
    <div className={containerClassName}>
      {products.map((product, index) => {
        const {
          currency: saleCurrency,
          whole: saleWhole,
          fraction: saleFraction,
        } = formatPrice(product.price, selectedCurrency, conversionRate);
        const {
          currency: originalCurrency,
          whole: originalWhole,
          fraction: originalFraction,
        } = product.salePrice
          ? formatPrice(product.salePrice, selectedCurrency, conversionRate)
          : {};

        return (
          <div key={index} className={productClassName}>
            <img
              src={
                product.featureImage && product.featureImage.filename
                  ? `${config.mediaUrl}/uploads/${product.featureImage.filename}`
                  : "/default-image.jpg"
              }
              alt={`Product ${index + 1}`}
              className={imageClassName}
            />

            <article className={priceContainer}>
              <span className={priceClassName}>
                <span className="currency">{saleCurrency}</span>
                <span className="whole">{saleWhole}</span>
                <span className="fraction">.{saleFraction}</span>
              </span>

              {product.discountPercentage && (
                <span className={discountClassName}>
                  {product.discountPercentage}
                </span>
              )}

              {product.salePrice && (
                <span className={oldPriceClassName}>
                  <span className="currency">{originalCurrency}</span>
                  <span className="whole">{originalWhole}</span>
                  <span className="fraction">.{originalFraction}</span>
                </span>
              )}
            </article>
          </div>
        );
      })}
    </div>
  );
}

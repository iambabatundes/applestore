import React from "react";
import { formatPrice } from "./utils";

export default function ProductPrice({
  price,
  originalPrice,
  selectedCurrency,
  conversionRate,
}) {
  const {
    currency: saleCurrency,
    whole: saleWhole,
    fraction: saleFraction,
  } = formatPrice(price, selectedCurrency, conversionRate);

  const {
    currency: originalCurrency,
    whole: originalWhole,
    fraction: originalFraction,
  } = originalPrice
    ? formatPrice(originalPrice, selectedCurrency, conversionRate)
    : {};

  return (
    <div className="productCard__price">
      <span className="productCard__salePrice">
        <span className="currency">{saleCurrency}</span>
        <span className="whole">{saleWhole}</span>
        <span className="fraction">.{saleFraction}</span>
      </span>
      {originalPrice && (
        <span className="productCard__originalPrice">
          <span className="currency">{originalCurrency}</span>
          <span className="whole">{originalWhole}</span>
          <span className="fraction">.{originalFraction}</span>
        </span>
      )}
    </div>
  );
}

import React from "react";
import { formatPrice } from "./utils";

export default function ProductPrice({
  price,
  salePrice,
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
  } = salePrice ? formatPrice(salePrice, selectedCurrency, conversionRate) : {};

  return (
    <div className="productCard__price">
      <span className="productCard__salePrice">
        <span className="currency">{saleCurrency}</span>
        <span className="whole">{saleWhole}</span>
        <span className="fraction">.{saleFraction}</span>
      </span>
      {salePrice && (
        <span className="productCard__originalPrice">
          <span className="currency">{originalCurrency}</span>
          <span className="whole">{originalWhole}</span>
          <span className="fraction">.{originalFraction}</span>
        </span>
      )}
    </div>
  );
}

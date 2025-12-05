import React from "react";

export default function PriceDisplay({
  price,
  currency,
  conversionRate = 1,
  className = "",
  showDecimals = true,
}) {
  const convertedPrice = price * conversionRate;
  const formattedPrice = convertedPrice
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const [whole, fraction] = formattedPrice.split(".");

  return (
    <span className={`price-display ${className}`}>
      <span className="price-currency">{currency}</span>
      <span className="price-whole">{whole}</span>
      {showDecimals && <span className="price-fraction">.{fraction}</span>}
    </span>
  );
}

// Optional: Inline variant for simpler use cases
export function PriceInline({ price, currency, conversionRate = 1 }) {
  const convertedPrice = price * conversionRate;
  const formattedPrice = convertedPrice
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <span className="price-inline">
      {currency}
      {formattedPrice}
    </span>
  );
}

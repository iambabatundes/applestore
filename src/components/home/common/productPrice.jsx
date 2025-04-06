import { formatPrice } from "./utils";

export default function ProductPrice({
  price,
  salePrice,
  selectedCurrency,
  conversionRate,
}) {
  // Format the original price
  const formattedPrice = formatPrice(price, selectedCurrency, conversionRate);

  // Format the sale price if available
  const formattedSalePrice = salePrice
    ? formatPrice(salePrice, selectedCurrency, conversionRate)
    : null;

  return (
    <div className="productCard__price">
      {formattedSalePrice ? (
        <>
          {/* Sale Price (New Price) */}
          <span className="productCard__salePrice">
            <span className="currency">{formattedSalePrice.currency}</span>
            <span className="whole">{formattedSalePrice.whole}</span>
            <span className="fraction">.{formattedSalePrice.fraction}</span>
          </span>

          {/* Original Price with Strikethrough */}
          <span className="productCard__originalPrice">
            <span className="currency">{formattedPrice.currency}</span>
            <span className="whole">{formattedPrice.whole}</span>
            <span className="fraction">.{formattedPrice.fraction}</span>
          </span>
        </>
      ) : (
        // If no salePrice, show the original price in the salePrice style
        <span className="productCard__salePrice">
          <span className="currency">{formattedPrice.currency}</span>
          <span className="whole">{formattedPrice.whole}</span>
          <span className="fraction">.{formattedPrice.fraction}</span>
        </span>
      )}
    </div>
  );
}

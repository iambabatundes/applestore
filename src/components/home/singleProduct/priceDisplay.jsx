import React from "react";
import "../styles/singleProduct.css";

export default function PriceDisplay({
  convertedPrice,
  selectedCurrency,
  product,
  convertedDiscount,
}) {
  return (
    <div className="singleProduct__price">
      <span className="singleProduct__price-price">
        <span className="singleProduct__price-currency">
          {selectedCurrency}
        </span>
        {/* <span className="singleProduct__price-whole">
                {Math.floor(convertedPrice)}
              </span> */}
        {/* <span className="singleProduct__price-fraction">
                .{(convertedPrice % 1).toFixed(2).substring(2)}
              </span> */}
        <span className="singleProduct__price-whole">{convertedPrice}</span>
      </span>
      <div className="singleProduct__discountPrice-main">
        {product.salePrice && (
          <span className="singleProduct__discountPrice">
            {selectedCurrency} {convertedDiscount}
          </span>
        )}

        {product.discountPercentage && (
          <span className="singleProduct__discountPrecentage">
            {product.discountPercentage} Off
          </span>
        )}
        {/* <p className="singleProduct__shown">Price shown before tax</p> */}
        <p className="singleProduct__shown">
          Tax excluded, add at checkout if applicable.
        </p>
      </div>
    </div>
  );
}

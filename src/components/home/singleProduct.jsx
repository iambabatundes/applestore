import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/singleProduct.css";
import ShippingDetails from "./common/shippingDetails";
import { useProduct } from "./singleProduct/hooks/useProduct";
import MediaThumbnails from "./singleProduct/MediaThumbnail";
import PriceDisplay from "./singleProduct/priceDisplay";
import { formatPrice } from "./singleProduct/utils/priceFormatter";
import ProductMedia from "./singleProduct/productMedia";
// import StarRating from "./common/starRating";
import ProductRating from "./common/ProductRating";
import SingleProductTab from "./common/singleProductTab";

export default function SingleProduct({ selectedCurrency, conversionRate }) {
  const { name } = useParams();
  const { product, error } = useProduct(name);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [fadeClass, setFadeClass] = useState("visible");

  useEffect(() => {
    if (product) {
      if (product.image) {
        setSelectedMedia({ type: "image", url: product.image });
      } else if (product.media && product.media.length > 0) {
        setSelectedMedia(product.media[0]);
      }
    }
  }, [product]);

  if (error) return <div>Error fetching product: {error.message}</div>;
  if (!product || !product.media) return <div>Loading...</div>;

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setFadeClass("visible");
    setIsZoomed(false);
  };

  const handleRatingChange = () => {};

  // Use the conversion rate to calculate prices
  const convertedPrice = formatPrice(product.price * conversionRate);
  const convertedDiscount = formatPrice(product.originalPrice * conversionRate);

  return (
    <section className="singleProduct-container">
      <div className="singleProduct__left">
        <div className="singleProduct__detailsMain">
          <section className="singleProduct__productMedia">
            {product.media && Array.isArray(product.media) && (
              <MediaThumbnails
                mediaData={product.media}
                onMediaClick={handleMediaClick}
                selectedMedia={selectedMedia}
              />
            )}
            {!product.media && <p>No media available for this product.</p>}

            <ProductMedia
              fadeClass={fadeClass}
              selectedMedia={selectedMedia}
              isZoomed={isZoomed}
              setIsZoomed={setIsZoomed}
            />
          </section>
          <section>
            <PriceDisplay
              convertedDiscount={convertedDiscount}
              convertedPrice={convertedPrice}
              product={product}
              selectedCurrency={selectedCurrency}
            />
            <span>
              Tax excluded, add at checkout if applicable.丨Extra 1% off with
              coins
            </span>
            <h1 className="singleProduct__productName">{product.name}</h1>
            <ProductRating
              numberOfSales={product.numberOfSales}
              onRatingChange={handleRatingChange}
              reviews={product.reviews}
              rating={product.rating}
            />
          </section>
        </div>

        <SingleProductTab />
      </div>
      <div className="singleProduct__shippingDetail">
        <ShippingDetails />
      </div>
    </section>
  );
}

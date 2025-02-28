import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/singleProduct.css";
import ShippingDetails from "./common/shippingDetails";
import { useProduct } from "./singleProduct/hooks/useProduct";
import MediaThumbnails from "./singleProduct/MediaThumbnail";
import PriceDisplay from "./singleProduct/priceDisplay";
import { formatPrice } from "./singleProduct/utils/priceFormatter";
import ProductMedia from "./singleProduct/productMedia";
import ProductRating from "./common/ProductRating";
import SingleProductTab from "./common/singleProductTab";
import config from "../../config.json";
import ProductVariation from "./ProductVariation";

export default function SingleProduct({ selectedCurrency, conversionRate }) {
  const { name } = useParams();
  const { product, error } = useProduct(name);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [fadeClass, setFadeClass] = useState("visible");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (product) {
      if (product.featureImage) {
        setSelectedMedia({
          type: "image",
          url: `${config.mediaUrl}/uploads/${product.featureImage.filename}`,
        });
      } else if (product.media && product.media.length > 0) {
        setSelectedMedia({
          type: product.media[0]?.mimeType?.startsWith("image")
            ? "image"
            : "video",
          url: `${config.mediaUrl}/uploads/${product.media[0]?.filename}`,
        });
      }
    }
  }, [product]);

  if (error) return <div>Error fetching product: {error.message}</div>;
  if (!product || !product.media) return <div>Loading...</div>;

  const handleMediaClick = (media) => {
    setSelectedMedia({
      type: media.mimeType.startsWith("image") ? "image" : "video",
      url: `${config.mediaUrl}/uploads/${media.filename}`,
    });
    setFadeClass("visible");
    setIsZoomed(false);
  };

  const convertedPrice = formatPrice(
    (product.salePrice || product.price) * conversionRate
  );
  const convertedDiscount = formatPrice(product.price * conversionRate);

  console.log(product.colors);

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
                product={product}
              />
            )}
            {!product.media && <p>No media available for this product.</p>}

            <ProductMedia
              fadeClass={fadeClass}
              selectedMedia={selectedMedia}
              isZoomed={isZoomed}
              setIsZoomed={setIsZoomed}
              product={product}
            />
          </section>
          <section>
            <PriceDisplay
              convertedDiscount={convertedDiscount}
              convertedPrice={convertedPrice}
              product={product}
              selectedCurrency={selectedCurrency}
            />

            <h1 className="singleProduct__productName">{product.name}</h1>
            <ProductRating
              purchaseCount={product.purchaseCount}
              reviews={product.reviews}
              rating={product.rating}
            />

            <ProductVariation
              colors={product.colors}
              sizes={product.sizes}
              capacity={product.capacity}
              materials={product.materials}
              onColorSelect={setSelectedImage}
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

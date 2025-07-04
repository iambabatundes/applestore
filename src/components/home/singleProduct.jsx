import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/singleProduct.css";
import ShippingDetails from "./common/shippingDetails";
import { useProduct } from "./singleProduct/hooks/useProduct";
import MediaThumbnails from "./singleProduct/MediaThumbnail";
import PriceDisplay from "./singleProduct/priceDisplay";
import ProductMedia from "./singleProduct/productMedia";
import ProductRating from "./common/ProductRating";
// import SingleProductTab from "./common/singleProductTab";
import config from "../../config.json";
import ProductVariation from "./ProductVariation";
import { useSingleProductStore } from "./store/useSingleProductStore";
import StarRating from "./common/starRating";
import {
  handleMediaClick,
  getMergedMediaList,
  getConvertedPrices,
} from "./singleProduct/utils/singleProductUtils";
import MobileMediaCarousel from "./singleProduct/MobileMediaCarousel";
import ProductLabels from "./common/ProductLabels";
import CommitmentSection from "./mobile/CommitmentSection";
// import useProductReviews from "./ProductReviews/hooks/useProductReviews";
import ReviewSection from "./ProductReviews/ReviewSection";
import useProductReviews from "./ProductReviews/hooks/useProductReviews";

export default function SingleProduct({ selectedCurrency, conversionRate }) {
  const { name } = useParams();
  const { product, error } = useProduct(name);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomMedia, setZoomMedia] = useState(null);

  const promotionsArray = Array.isArray(product.promotion)
    ? product.promotion
    : product.promotion
    ? [product.promotion]
    : [];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    selectedMedia,
    isZoomed,
    fadeClass,
    selectedImage,
    setSelectedMedia,
    setIsZoomed,
    setFadeClass,
    setSelectedImage,
    resetMediaState,
  } = useSingleProductStore();

  const { reviews, totalReviews, rating, loading, currentUserId } =
    useProductReviews(product._id);

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

  const mergedMediaList = getMergedMediaList(product);

  const { convertedPrice, convertedDiscount } = getConvertedPrices(
    product,
    conversionRate
  );

  return (
    <section className="singleProduct-container">
      {isMobile && (
        <section>
          <div className="singleProduct__mobileInfoWrapper">
            <MobileMediaCarousel
              mergedMediaList={mergedMediaList}
              zoomMedia={zoomMedia}
              setZoomMedia={setZoomMedia}
            />

            <div className="singleProduct__mobile">
              <div className="singleProduct__mobilePrice">
                <span className="mobilePrice__main">
                  <span className="mobilePrice__currency">
                    {selectedCurrency}
                  </span>
                  <span className="mobilePrice__amount">{convertedPrice}</span>
                </span>

                {product.salePrice && (
                  <span className="mobilePrice__original">
                    {selectedCurrency} {convertedDiscount}
                  </span>
                )}

                {product.discountPercentage && (
                  <span className="mobilePrice__discountTag">
                    {product.discountPercentage} OFF
                  </span>
                )}
              </div>

              <ProductLabels promotions={promotionsArray} />

              <p className="mobilePrice__taxNote">
                Tax excluded, add at checkout if applicable.
              </p>

              <h1 className="singleProduct__productNameMobile">
                {product.name}
              </h1>

              <div className="productCard__rating">
                <StarRating
                  totalStars={5}
                  rating={parseFloat(rating).toFixed(1) || 0}
                  readOnly={true}
                />
                <span className="productCard__product-rating">
                  {rating > 0
                    ? `${parseFloat(rating).toFixed(1)} Rating`
                    : "0.0"}
                </span>
                <div className="productCard__details">
                  <span className="productCard__review">
                    {product.reviewCount > 0
                      ? `${product.reviewCount} Reviews`
                      : "0 Review"}
                  </span>
                </div>

                <span className="productCard__product-sold">
                  {product.purchaseCount > 0
                    ? `${product.purchaseCount}  sold`
                    : "0 sold"}
                </span>
              </div>

              <ProductVariation
                colors={product.colors}
                sizes={product.sizes}
                capacity={product.capacity}
                materials={product.materials}
                onColorSelect={setSelectedImage}
                className="singleProduct__variationMobile"
              />

              <CommitmentSection />
              <ReviewSection
                product={product}
                reviews={reviews}
                loading={loading}
                error={error}
                onPreviewClick={() => setShowModal(true)}
                totalReviews={totalReviews}
                rating={rating}
                currentUserId={currentUserId}
              />
              <section>
                <h1>Specification</h1>
              </section>
            </div>
          </div>
          <div className="mobileActions__stickyBar">
            <button className="mobileActions__addToCart">Add to Cart</button>
            <button className="mobileActions__buyNow">Buy Now</button>
          </div>
        </section>
      )}

      <div className="singleProduct__left">
        <div className="singleProduct__detailsMain">
          <section className="singleProduct__productMedia">
            {product.media && Array.isArray(product.media) && (
              <MediaThumbnails
                mediaData={product.media}
                onMediaClick={(media) =>
                  handleMediaClick(
                    media,
                    setSelectedMedia,
                    setFadeClass,
                    setIsZoomed
                  )
                }
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

            <ProductVariation
              colors={product.colors}
              sizes={product.sizes}
              capacity={product.capacity}
              materials={product.materials}
              onColorSelect={setSelectedImage}
            />

            {promotionsArray.map((promo, index) => (
              <div key={index} className="singleProduct__promotion">
                <h4 className="promotion__title">{promo.name}</h4>
                <p className="promotion__description">{promo.description}</p>
              </div>
            ))}
          </section>
        </div>

        {/* <SingleProductTab /> */}
      </div>
      <div className="singleProduct__shippingDetail">
        <ShippingDetails />
      </div>
    </section>
  );
}

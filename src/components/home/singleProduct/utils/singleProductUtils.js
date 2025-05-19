import { formatPrice } from "./priceFormatter";

export const handleMediaClick = (
  media,
  setSelectedMedia,
  setFadeClass,
  setIsZoomed
) => {
  setSelectedMedia({
    type: media.mimeType.startsWith("image") ? "image" : "video",
    url: `${import.meta.env.VITE_API_URL}/uploads/${media.filename}`,
    // url: `${config.mediaUrl}/uploads/${media.filename}`,
  });
  setFadeClass("visible");
  setIsZoomed(false);
};

export const getMergedMediaList = (product) => {
  const mergedMediaList = [];

  if (product.featureImage) {
    mergedMediaList.push({
      filename: product.featureImage.filename,
      mimeType: "image",
    });
  }

  if (product.colorImages && product.colorImages.length > 0) {
    mergedMediaList.push(
      ...product.colorImages.map((img) => ({
        filename: img.filename,
        mimeType: "image",
      }))
    );
  }

  if (product.media && product.media.length > 0) {
    mergedMediaList.push(...product.media);
  }

  return mergedMediaList;
};

export const getConvertedPrices = (product, conversionRate) => {
  const convertedPrice = formatPrice(
    (product.salePrice || product.price) * conversionRate
  );
  const convertedDiscount = formatPrice(product.price * conversionRate);
  return { convertedPrice, convertedDiscount };
};

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/singleProduct.css";
import { getProduct } from "./productData";
import ReactImageMagnify from "react-image-magnify";
import SingleProductModal from "./singleProductModal";

export default function SingleProduct() {
  const [product, setProduct] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  const { title } = useParams();

  useEffect(() => {
    const fetchedProduct = getProduct(title);
    setProduct(fetchedProduct);
  }, [title]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleMediaHover = (media) => {
    setHoveredImage(media);
  };

  const handleMediaClick = (media) => {
    // Handle media click and open the modal
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal and reset the selected media
    setSelectedMedia([]);
    setIsModalOpen(false);
  };

  const getThumbnailMedia = () => {
    // Get at least 6 images and one video for the thumbnail display
    const thumbnailMedia = Object.values(product.productDatas || {});

    if (product.video) {
      thumbnailMedia.push(product.video);
    }

    return thumbnailMedia.slice(0, 7);
  };

  return (
    <section>
      <div className="singleProduct-main">
        <section className="singleProduct-left">
          <div className="singleProduct-thumbnail">
            {getThumbnailMedia().map((media, index) => {
              const isVideo = media.includes(".mp4");
              return (
                <div
                  key={index}
                  onMouseEnter={() => handleMediaHover(media)}
                  onMouseLeave={() => handleMediaHover(media)}
                >
                  {isVideo ? (
                    <video
                      src={media}
                      controls
                      width="100"
                      height="80"
                      muted
                      id={hoveredImage === media ? "selected" : ""}
                      className="thumbnail__video"
                    ></video>
                  ) : (
                    <img
                      src={media}
                      alt=""
                      id={hoveredImage === media ? "selected" : ""}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div
            className="product-image-container"
            onDoubleClick={(media) => handleMediaClick(media)}
          >
            {hoveredImage ? (
              hoveredImage.includes(".mp4") ? (
                <div className="product__video-main">
                  <video className="product-video" src={hoveredImage} />
                </div>
              ) : (
                <ReactImageMagnify
                  {...{
                    imageClassName: "smallImage",
                    smallImage: {
                      alt: "",
                      isFluidWidth: true,
                      src: hoveredImage || product.image,
                    },
                    shouldUsePositiveSpaceLens: true,
                    lensStyle: {
                      background: "hsla(0, 0%, 100%, .3)",
                      cursor: "pointer",
                    },
                    largeImage: {
                      src: hoveredImage,
                      width: 1800,
                      height: 1800,
                    },
                    enlargedImageContainerDimensions: {
                      width: "150%",
                      height: "100%",
                    },
                    isHintEnabled: true,
                    shouldHideHintAfterFirstActivation: false,
                  }}
                />
              )
            ) : (
              <ReactImageMagnify
                {...{
                  imageClassName: "smallImage",
                  smallImage: {
                    alt: "",
                    isFluidWidth: true,
                    src: product.image,
                  },
                  shouldUsePositiveSpaceLens: true,
                  lensStyle: {
                    background: "hsla(0, 0%, 100%, .3)",
                    cursor: "pointer",
                  },
                  largeImage: {
                    src: product.image,
                    width: 1800,
                    height: 1800,
                  },
                  enlargedImageContainerDimensions: {
                    width: "150%",
                    height: "100%",
                  },
                  isHintEnabled: true,
                  shouldHideHintAfterFirstActivation: false,
                }}
              />
            )}
          </div>
        </section>

        <div>
          <h1>{product.title}</h1>
        </div>
        <div>
          <h1>This is for the AddCart side</h1>
        </div>
      </div>

      {/* Modal */}
      <SingleProductModal
        isModalOpen={isModalOpen}
        media={selectedMedia}
        handleCloseModal={handleCloseModal}
      />
    </section>
  );
}

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/singleProduct.css";
import { getProduct } from "./productData";
import ReactImageMagnify from "react-image-magnify";

export default function SingleProduct() {
  const [product, setProduct] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoSrc, setSelectedVideoSrc] = useState(false);

  const { title } = useParams();

  useEffect(() => {
    const fetchedProduct = getProduct(title);
    setProduct(fetchedProduct);
  }, [title]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleImageHover = (image) => {
    if (selectedImage === image) {
      setHoveredImage(image);
    } else {
      setSelectedImage(image);
      setHoveredImage(image);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setHoveredImage(image);
  };

  const handleMouseLeave = () => {
    if (selectedImage === null) {
      setHoveredImage(null);
    }
  };
  const handleVideoClick = (videoSrc) => {
    // Handle video click and display the video in the video section
    setSelectedVideoSrc(videoSrc);
  };

  const handleDoubleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section>
      <div className="singleProduct-main">
        <section className="singleProduct-left">
          <div className="singleProduct-thumbnail">
            {product.productDatas &&
              Object.entries(product.productDatas).map(([key, data]) => {
                // Checking if the entry is a video
                const isVideo = key.includes("video");

                return (
                  <div
                    key={key}
                    onClick={() => (isVideo ? handleVideoClick(data) : null)}
                  >
                    {isVideo ? (
                      <video
                        src={data}
                        controls
                        width="100"
                        height="80"
                        muted
                      ></video>
                    ) : (
                      <img
                        src={data}
                        alt=""
                        id={hoveredImage === data ? "selected" : ""}
                        onMouseEnter={() => handleImageHover(data)}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => handleImageClick(data)}
                      />
                    )}
                  </div>
                );
              })}
          </div>

          <div
            className="product-image-container"
            onDoubleClick={handleDoubleClick}
          >
            <ReactImageMagnify
              {...{
                imageClassName: "smallImage",

                smallImage: {
                  alt: "",
                  isFluidWidth: true,
                  src: selectedImage || product.image,
                },
                shouldUsePositiveSpaceLens: true,
                lensStyle: {
                  background: "hsla(0, 0%, 100%, .3)",
                  // border: "1px solid #ccc",
                  cursor: "pointer",
                },

                largeImage: {
                  src: hoveredImage || product.image,
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
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              Close
            </button>
            {/* Video and Image tabs */}
            <div className="tabs">
              <button>Video</button>
              <button>Image</button>
            </div>
            {/* Video and Image content */}
            <div className="tab-content">
              {/* Video content */}
              <div className="video-tab">
                <video controls>
                  <source src="path_to_video" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              {/* Image content */}
              <div className="image-tab">
                <img src="path_to_image" alt="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

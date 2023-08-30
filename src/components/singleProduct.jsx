import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/singleProduct.css";
import { getProduct } from "./productData";
import ReactImageMagnify from "react-image-magnify";
import SingleProductModal from "./singleProductModal";

export default function SingleProduct() {
  const [product, setProduct] = useState([]);
  const [hoveredImage, setHoveredImage] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [activeTab, setActiveTab] = useState("video");
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);

  const videosArray = Object.values(product?.productVideo || {});
  const imagesArray = Object.values(product?.productDatas || {});

  // const { productDatas = {} } = product || {};
  // const imagesArray = Object.values(productDatas);

  const { title } = useParams();

  function formatPermalink(title) {
    return title.toLowerCase().replaceAll(" ", "-");
  }

  useEffect(() => {
    try {
      const fetchedProduct = getProduct(formatPermalink(title));
      setProduct(fetchedProduct);
      console.log(fetchedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }, [title]);

  // if (!product) {
  //   return <div>Loading...</div>;
  // }

  const updateMainVideo = (video) => {
    setSelectedMedia(video);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // If the "Images" tab is clicked, set the selectedMedia state to the main product image
    if (tab === "image") {
      setSelectedMedia(product.image);
    } else setSelectedMedia(mainVideo);
  };

  const handleMediaHover = (media) => {
    setHoveredImage(media);
  };

  const handleMediaClick = (media, type) => {
    // Handle media click and open the modal
    setSelectedMedia(media);

    if (type === "image") {
      // If the clicked media is an image, set the active tab to "image"
      setActiveTab("image");
    } else if (type === "video") {
      // If the clicked media is a video, set the active tab to "video"
      setActiveTab("video");
    } else setActiveTab("image");

    // Call the updateMainVideo function with the selected video
    if (type === "video" && (media.src || (media.video && media.title))) {
      updateMainVideo({
        src: media.src,
        title: media.title,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal and reset the selected media
    setSelectedMedia([]);
    setIsModalOpen(false);
  };

  const getThumbnailMedia = () => {
    // Get at least 6 images and one video for the thumbnail display
    const thumbnailMedia = Object.values(product?.productDatas || {});

    if (product.video) {
      thumbnailMedia.push(product.video.video);
    }

    return thumbnailMedia.slice(0, 7);
  };

  // const mainVideo = product.video
  //   ? { src: product?.video.video, title: product.video.title }
  //   : product.image;

  // const mainVideo = product
  //   ? product.video
  //     ? { src: product?.video.video, title: product.video.title }
  //     : product.image
  //   : null; // or a default value

  const mainVideo = product?.video
    ? { src: product?.video?.video, title: product?.video?.title }
    : product?.image || {}; // Provide a default value if 'image' is also undefined

  const hasVideo = videosArray.length > 0;

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
                  {hasVideo && isVideo ? (
                    <video
                      onClick={(isVideo) =>
                        handleMediaClick(mainVideo, isVideo ? "video" : "")
                      }
                      src={media}
                      width="100"
                      height="80"
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
            onClick={() =>
              hoveredImage && hoveredImage.includes(".mp4")
                ? handleMediaClick(mainVideo, "video")
                : handleMediaClick(hoveredImage || product.image, "image")
            }
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
        activeTab={activeTab}
        videosArray={hasVideo ? [mainVideo, ...videosArray] : []} // Include the main video in the videosArray
        imagesArray={imagesArray}
        selectedMedia={selectedMedia}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        handleTabClick={handleTabClick}
        handleMediaClick={handleMediaClick}
        mainVideoTitle={mainVideo?.title || ""}
        updateMainVideo={updateMainVideo}
        hasVideo={hasVideo}
        currentPlayingIndex={currentPlayingIndex}
        setCurrentPlayingIndex={setCurrentPlayingIndex}
        setSelectedMedia={setSelectedMedia}
      />
    </section>
  );
}

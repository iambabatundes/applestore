import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/singleProduct.css";
import { getProduct } from "./productData";
// import ReactImageMagnify from "react-image-magnify";
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

  const { name } = useParams();

  function formatPermalink(name) {
    return name.toLowerCase().replaceAll(" ", "-");
  }

  useEffect(() => {
    try {
      const fetchedProduct = getProduct(formatPermalink(name));
      setProduct(fetchedProduct);
      console.log(fetchedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }, [name]);

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
      setActiveTab("image");
    } else if (type === "video") {
      setActiveTab("video");
    } else setActiveTab("image");

    if (type === "video" && (media.src || (media.video && media.name))) {
      updateMainVideo({
        src: media.src,
        name: media.name,
      });
    }
    // setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal and reset the selected media
    setSelectedMedia([]);
    setIsModalOpen(false);
  };

  const getThumbnailMedia = () => {
    // Get at least 6 images and one video for the thumbnail display
    const thumbnailMedia = Object.values(product?.productDatas || {});

    if (product?.video) {
      thumbnailMedia.push(product.video.video);
    }

    return thumbnailMedia.slice(0, 7);
  };

  const mainVideo = product?.video
    ? { src: product?.video?.video, name: product?.video?.name }
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
        </section>

        <div>
          <h1>{product?.name}</h1>
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
        mainVideoTitle={mainVideo?.name || ""}
        updateMainVideo={updateMainVideo}
        hasVideo={hasVideo}
        currentPlayingIndex={currentPlayingIndex}
        setCurrentPlayingIndex={setCurrentPlayingIndex}
        setSelectedMedia={setSelectedMedia}
      />
    </section>
  );
}

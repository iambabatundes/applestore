import React, { useRef, useEffect } from "react";
import "./styles/singleProductModal.css";
import Icon from "./icon";

export default function SingleProductModal({
  isModalOpen,
  handleCloseModal,
  activeTab,
  videosArray,
  imagesArray,
  selectedMedia,
  handleTabClick,
  handleMediaClick,
  mainVideoTitle,
  updateMainVideo,
  hasVideo, // Add this prop
  currentPlayingIndex,
  setCurrentPlayingIndex,
  setSelectedMedia,
}) {
  const mainVideoRef = useRef(null);

  useEffect(() => {
    if (isModalOpen && mainVideoRef.current) {
      mainVideoRef.current.play();

      // Add an event listener for the "ended" event
      mainVideoRef.current.addEventListener("ended", handleVideoEnded);

      // Clean up the event listener when the component unmounts
      return () => {
        mainVideoRef.current.removeEventListener("ended", handleVideoEnded);
      };
    }
  }, [isModalOpen]);

  const handleVideoEnded = () => {
    if (mainVideoRef.current) {
      const currentIndex = videosArray.findIndex(
        (video) => video.src === mainVideoRef.current.src
      );
      const nextIndex = (currentIndex + 1) % videosArray.length;
      const nextVideo = videosArray[nextIndex];
      if (nextVideo) {
        mainVideoRef.current.src = nextVideo.src;
        mainVideoRef.current.title = nextVideo.title;
        mainVideoRef.current.play();

        setCurrentPlayingIndex(nextIndex); // Update the index of the currently playing video
        setSelectedMedia(nextVideo); // Update the selected video
      } else {
        setCurrentPlayingIndex(-1); // No video is playing
        setSelectedMedia([]); // Clear the selected video
      }
    }
  };

  return (
    <section>
      {/* Modal */}
      {isModalOpen && (
        <section className="productModal">
          <div className="productModal-content">
            <Icon cancel className="modalCancel" onClick={handleCloseModal} />
            {/* Tabs */}
            <div className="ProductModal-tabs">
              {hasVideo && (
                <button
                  onClick={() => handleTabClick("video")}
                  className={activeTab === "video" ? "product-active" : ""}
                >
                  Videos
                </button>
              )}

              <button
                onClick={() => handleTabClick("image")}
                className={activeTab === "image" ? "product__active" : ""}
              >
                Images
              </button>
            </div>

            {/* Media content based on active tab */}
            <div className="modal-media">
              <div className="modal-big-media">
                {hasVideo && activeTab === "video" ? (
                  <>
                    <video
                      // ref={mainVideoRef} // Ref to the main video element
                      className="modal-video"
                      src={selectedMedia.src}
                      controls
                      autoPlay // Add autoPlay attribute to play the main video automatically
                      onEnded={handleVideoEnded} // Handle video end event
                    ></video>

                    {selectedMedia.title && (
                      <p className="video-title">
                        {selectedMedia.title || mainVideoTitle}
                      </p>
                    )}
                  </>
                ) : (
                  <img className="modal-image" src={selectedMedia} alt="" />
                )}
              </div>

              <div className="modal-thumbnails">
                {activeTab === "video"
                  ? videosArray.map((video, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          updateMainVideo(video);
                          setCurrentPlayingIndex(index); // Set the currentPlayingIndex when a thumbnail is clicked
                        }}
                        className={`modal-thumbnail ${
                          selectedMedia === video ? "selected" : ""
                        } ${currentPlayingIndex === index ? "playing" : ""}`}
                      >
                        <video src={video.src} muted width="100" height="80" />
                        {video.title && (
                          <p className="video-title">{video.title}</p>
                        )}
                      </div>
                    ))
                  : imagesArray.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => handleMediaClick(image)}
                        className={`modal-thumbnail ${
                          selectedMedia === image ? "selected" : ""
                        }`}
                      >
                        <img src={image} alt="" />
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

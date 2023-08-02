import React from "react";
import "./styles/singleProductModal.css";

export default function SingleProductModal({ isModalOpen, handleCloseModal }) {
  return (
    <section>
      <div>
        {/* Modal */}
        {isModalOpen && (
          <div className="singleProductModal">
            <div className="singleProductModal-content">
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
      </div>
    </section>
  );
}

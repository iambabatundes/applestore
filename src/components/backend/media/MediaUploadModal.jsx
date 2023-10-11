import React from "react";
import Icon from "../../icon";
import "./styles/MediaUploadModal.css";
import Button from "../button";

export default function MediaUploadModal({
  isMediaUploadOpen,
  onClick,
  selectedTab,
  handleTabChange,
}) {
  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  return (
    <section>
      {isMediaUploadOpen && (
        <section className="mediaUpload" onClick={handleFormClick}>
          <div className="mediaUpload-main">
            <div className="mediaUpload-heading">
              <h1>Add Media</h1>
              <Icon cancel className="mediaUpload-cancel" onClick={onClick} />
            </div>
            <div className="modal-tabs">
              <Button
                title="Upload files"
                onClick={() => handleTabChange("upload")}
                className={selectedTab === "upload" ? "active" : ""}
              />

              <Button
                title="Media Library"
                onClick={() => handleTabChange("library")}
                className={selectedTab === "library" ? "active" : ""}
              />
            </div>
            <section className="modal-content-area">
              {/* {selectedTab === "upload" && }
                {selectedTab === "library" && } */}
              <div></div>
              <div></div>
            </section>
          </div>
        </section>
      )}
    </section>
  );
}

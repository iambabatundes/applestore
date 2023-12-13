import React from "react";
import SelectFiles from "./SelectFiles";

export default function MediaUpload({
  showMediaUpload,
  handleUploadCanel,
  getMaxFileSizeGB,
  onChange,
}) {
  return (
    <div className={`media-upload-container ${showMediaUpload ? "show" : ""}`}>
      {showMediaUpload ? (
        <section className="media-upload-main">
          <div className="media-upload-section">
            <span className="media-cancel" onClick={handleUploadCanel}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </span>

            <SelectFiles
              getMaxFileSizeGB={getMaxFileSizeGB()}
              onChange={onChange}
              className="upload__section"
              uploadMaxMain="upload-maxMain"
              uploadMaxSize="upload-maxSize"
            />
          </div>
        </section>
      ) : (
        ""
      )}
    </div>
  );
}

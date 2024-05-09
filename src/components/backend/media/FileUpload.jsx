import React from "react";
import SelectFiles from "./SelectFiles";
import "./styles/fileUpload.css";

export default function FileUpload({ handleFileChange }) {
  return (
    <div>
      <SelectFiles
        onChange={handleFileChange}
        className="fileupload-main"
        uploadMaxMain="filemain-maxSize"
        selectfilebtn="fileUploadBtn"
      />
      <input type="file" onChange={handleFileChange} />
      {/* Add additional UI elements as needed */}
    </div>
  );
}

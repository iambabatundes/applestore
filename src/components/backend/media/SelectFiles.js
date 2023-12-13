import React from "react";
import Button from "../button";
import "./styles/SelectFiles.css";

export default function SelectFiles({
  getMaxFileSizeGB,
  onChange,
  className,
  uploadMaxMain,
  uploadMaxSize,
  selectfilebtn,
}) {
  return (
    <div>
      <article className={`${className}`}>
        <h3>Drop files to upload</h3>
        <p>or</p>
        <Button
          title="Select files"
          onChange={onChange}
          type="file"
          className={`${selectfilebtn}`}
        />
        {/* <button onChange={}>Select files</button> */}
      </article>

      <div className={`${uploadMaxMain}`}>
        <h4 className={`${uploadMaxSize}`}>
          Maximum upload file size: <span>{getMaxFileSizeGB} GB</span>
        </h4>
      </div>
    </div>
  );
}

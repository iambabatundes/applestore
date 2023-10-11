import React from "react";
import Button from "../button";
import "./styles/SelectFiles.css";

export default function SelectFiles({ getMaxFileSizeGB, onChange }) {
  return (
    <div>
      <article className="upload__section">
        <h3>Drop files to upload</h3>
        <p>or</p>
        <Button title="Select files" onChange={onChange} type="file" />
        {/* <button onChange={}>Select files</button> */}
      </article>

      <div className="upload-maxMain">
        <h4 className="upload-maxSize">
          Maximum upload file size: <span>{getMaxFileSizeGB} GB</span>
        </h4>
      </div>
    </div>
  );
}

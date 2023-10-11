import React from "react";
import SelectFiles from "./SelectFiles";

export default function FileUpload({ handleFileChange }) {
  return (
    <div>
      <SelectFiles onChange={handleFileChange} />
      {/* <input type="file" onChange={handleFileChange} /> */}
      {/* Add additional UI elements as needed */}
    </div>
  );
}

// components/MainMediaDisplay.js
import React from "react";
import ZoomableImage from "./zoomableImage";

export default function MainMediaDisplay({ selectedMedia, fadeClass }) {
  return (
    <section className="main-media">
      {selectedMedia.type === "image" ? (
        <ZoomableImage src={selectedMedia.medias} fadeClass={fadeClass} />
      ) : (
        <video src={selectedMedia.medias} controls className="main-video" />
      )}
    </section>
  );
}

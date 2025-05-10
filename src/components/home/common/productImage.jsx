// ProductImage.js
import React, { useState, useRef, useEffect } from "react";

export default function ProductImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    let observer;
    if (imgRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(imgRef.current);
          }
        },
        {
          threshold: 0.1, // Adjust threshold as needed
        }
      );
      observer.observe(imgRef.current);
    }
    return () => {
      if (observer && observer.disconnect) observer.disconnect();
    };
  }, [src]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className={`productCard__image-wrapper ${
        isImageLoaded ? "loaded" : "loading"
      }`}
    >
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`productCard__productImage productCard__productImage--blurred ${
          isImageLoaded ? "hidden" : ""
        }`}
      />

      <img
        ref={imgRef}
        src={imageSrc || ""}
        alt={alt}
        className="productCard__productImage"
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );
}

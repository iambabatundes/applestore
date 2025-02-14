// ProductImage.js
import React, { useState, useRef, useEffect } from "react";

export default function ProductImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(null);
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

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className="productCard__productImage"
    />
  );
}

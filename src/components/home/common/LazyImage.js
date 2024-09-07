import React, { useState, useEffect, useRef } from "react";

const LazyImage = ({ src, alt, className, placeholderHeight = "200px" }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsImageLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return isImageLoaded ? (
    <img src={src} alt={alt} className={className} ref={imgRef} />
  ) : (
    <div
      ref={imgRef}
      style={{ height: placeholderHeight, backgroundColor: "#f0f0f0" }}
    ></div>
  );
};

export default LazyImage;

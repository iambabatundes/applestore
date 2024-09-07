import React, { useState, useEffect, useRef } from "react";

export default function LazyImages({ src, alt, className }) {
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect(); // Stop observing once the image is in view
          }
        });
      },
      {
        rootMargin: "0px 0px 50px 0px", // Load images just before they come into view
        threshold: 0.1, // Trigger when 10% of the image is visible
      }
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

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined} // Load image only when in view
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}

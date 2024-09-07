// ProductImage.js
// import React from "react";
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import placeholderImg from "../assets/placeholder.png";
// import "react-lazy-load-image-component/src/effects/blur.css";

// export default function ProductImage({ src, alt }) {
//   return (
//     <LazyLoadImage
//       src={src}
//       alt={alt}
//         placeholderSrc={placeholderImg}
//       className="productCard__productImage"
//       effect="blur"

//     />
//   );
// }

// ProductImage.js
// import React from "react";

// export default function ProductImage({ src, alt, srcSet, sizes }) {
//   return (
//     <img
//       src={src}
//       srcSet={srcSet}
//       sizes={sizes}
//       alt={alt}
//       className="productCard__productImage"
//       loading="lazy"
//     />
//   );
// }

// <ProductImage
//   src={item.image}
//   alt={item.name}
//   srcSet={`${item.imageSmall} 300w, ${item.imageMedium} 600w, ${item.imageLarge} 1200w`}
//   sizes="(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px"
// />

// import React from "react";
// import LazyImages from "../hooks/lazyImage";

// export default function ProductImage({ src, alt }) {
//   return (
//     <LazyImages alt={alt} src={src} className="productCard__productImage" />
//   );
// }

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

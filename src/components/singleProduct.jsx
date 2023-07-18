import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/singleProduct.css";
import { getProduct } from "./productData";

export default function SingleProduct() {
  const [product, setProduct] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showProductHover, setShowProductHover] = useState(false);
  const [zoomedScreenPosition, setZoomedScreenPosition] = useState({
    top: 0,
    left: 0,
  });

  const { title } = useParams();

  useEffect(() => {
    const fetchedProducts = getProduct(title);
    setProduct(fetchedProducts);
  }, [title]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleImageHover = (image) => {
    if (selectedImage === null) {
      setHoveredImage(image);
    } else {
      setSelectedImage(null);
      setHoveredImage(image);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setHoveredImage(image);
  };

  const handleMouseLeave = () => {
    if (selectedImage === null) {
      setHoveredImage(null);
    }
  };

  const handleProductImageHover = (image, event) => {
    setHoveredImage(image);
    const { clientX, clientY } = event;
    setZoomedScreenPosition({ top: clientY, left: clientX });
    setShowProductHover(true);
  };

  const handleProductImageClick = (image) => {
    setSelectedImage(image);
    setHoveredImage(image);
  };

  const handleProductImageMouseLeave = () => {
    setHoveredImage(null);
    setShowProductHover(false);
  };

  const handleProductHover = () => {
    setShowProductHover(true);
  };

  const handleProductMouseLeave = () => {
    setShowProductHover(false);
  };

  return (
    <section>
      <div className="singleProduct-main">
        <section className="singleProduct-left">
          <div className="singleProduct-thumbnail">
            {product.productImages &&
              Object.entries(product.productImages).map(([key, image]) => (
                <img
                  src={image}
                  key={key}
                  alt=""
                  className={selectedImage === image ? "selected" : ""}
                  onMouseEnter={() => handleImageHover(image)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleImageClick(image)}
                />
              ))}
          </div>

          <div
            className="product-image-container"
            onMouseMove={(e) => {
              const { clientX, clientY } = e;
              setZoomedScreenPosition({ top: clientY, left: clientX });
            }}
            onMouseEnter={handleProductHover}
            onMouseLeave={handleProductMouseLeave}
          >
            <img
              src={selectedImage || hoveredImage || product.image}
              alt=""
              className={showProductHover ? "product-image-hover" : ""}
            />
            {showProductHover && (
              <div
                className="zoomed-screen"
                style={{
                  top: zoomedScreenPosition.top,
                  left: zoomedScreenPosition.left,
                }}
              >
                <img
                  src={hoveredImage || selectedImage || product.image}
                  alt=""
                />
              </div>
            )}
          </div>
        </section>

        <div>
          <h1>{product.title}</h1>
        </div>
        <div>
          <h1>This is for the AddCart side</h1>
        </div>
      </div>
    </section>
  );
}

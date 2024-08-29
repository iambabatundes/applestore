import React from "react";
import Slider from "react-slick";

export default function Choice() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const products = [
    {
      id: 1,
      title: "Multi-Layer Trolley Rack",
      price: "NGN 30,775.73",
      originalPrice: "NGN 87,732.89",
      image: "path-to-image", // Replace with your image path
      sold: "10,000+ sold",
    },
    {
      id: 2,
      title: "QT&QY 25L/45L Tactical Backpack",
      price: "NGN 55,200.59",
      originalPrice: "NGN 110,840.32",
      image: "path-to-image", // Replace with your image path
      sold: "5,000+ sold",
    },
    // Add more products here
  ];

  return (
    <div className="choice-container">
      <h2>Better services and selected items on Choice</h2>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.sold}</p>
            <p className="price">{product.price}</p>
            <p className="original-price">{product.originalPrice}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

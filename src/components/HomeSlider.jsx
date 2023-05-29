import React from "react";
import { Carousel } from "react-responsive-carousel";
import "./styles/homeSlider.css";

function HomeSlider() {
  const slides = [
    {
      id: 1,
      image: "/apple3.jpg",
      title: "Apples Available For Picking or Shipping!",
      subtitle:
        "Our user-friendly ecommerce website offers a seamless browsing experience",
      buttonText: "Shop Now",
    },
    {
      id: 2,
      image: "/apple.png",
      title: "Online Shopping Made Simple: Find, Click, Enjoy!",
      subtitle:
        "Where Shopping Meets Seamless Delight: Unleash the Thrill of Online Retail Therapy!",
      buttonText: "Shop Now",
    },
    {
      id: 3,
      image: "/apple1.jpg",
      title: "Your One-Stop Online Shop: Unleash Retail Bliss!",
      subtitle:
        "Transforming the Way You Shop: Elevate Your Online Retail Experience to New Heights!",
      buttonText: "Shop Now",
    },
  ];
  return (
    <Carousel
      autoPlay={true}
      interval={3000} // 3 seconds per slide
      showStatus={false}
      showIndicators={false}
      showThumbs={false}
      infiniteLoop={true}
    >
      {slides.map((slide) => (
        <div key={slide.id} className="slider__container">
          <img
            src={slide.image}
            alt={`Slide ${slide.id}`}
            className="sliderImage"
          />

          <div className="content">
            <h2>{slide.title}</h2>
            <h3>{slide.subtitle}</h3>
            <button>{slide.buttonText}</button>
          </div>
        </div>
      ))}
    </Carousel>
  );
}

export default HomeSlider;

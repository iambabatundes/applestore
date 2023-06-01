import React from "react";
import "@fontsource/poppins/700.css";
import "../components/styles/brandcard.css";

export default function BrandCard({ item, className }) {
  return (
    <section className={`${className} brandcard`}>
      <img className="brandcard__image" src={item.image} alt="" />
      <div className="brandcard__content">
        <h1 className={`${className} brandcard__title`}>{item.title}</h1>
        <h2 className={`${className} brandcard__title header`}>
          {item.header}
        </h2>
        <h4 className={`${className} brandcard__subtitle`}>{item.subTitle}</h4>
        <button className="brandcard__btn">Learn More</button>
      </div>
    </section>
  );
}

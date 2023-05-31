import React from "react";
import "../components/styles/brandcard.css";

export default function BrandCard({ item, className }) {
  return (
    <section className="brandcard">
      <img className="brandcard__image" src={item.image} alt="" />
      <div className="brandcard__content">
        <h4 className={`${className}" brandcard__subtitle"`}>
          {item.subTitle}
        </h4>
        <h1 className={`${className} "brandcard__title"`}>{item.title}</h1>
      </div>
    </section>
  );
}

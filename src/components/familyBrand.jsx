import React from "react";
import "../components/styles/familyBrand.css";
import "@fontsource/poppins";
import ButtonSmall from "./buttonSmall";

function FamilyBrand() {
  const cards = [
    {
      id: 1,
      image: "/brand1.webp",
      title: "Apple and Natural Drinks",
      buttonText: "Learn More",
    },
    {
      id: 2,
      image: "/brand.svg",
      title: "Soft Older Spirit NATURAL Win!",
      buttonText: "Learn More",
    },
    {
      id: 3,
      image: "brand3.webp",
      title: "Apple Juice & Natural Juice",
      buttonText: "Learn More",
    },
  ];
  return (
    <section className="card__main">
      <header className="card__title">
        <h2>Our Family Brand</h2>
      </header>
      <section className="card-container">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <img src={card.image} alt={`Card ${card.id}`} />
            <h2>{card.title}</h2>
            <ButtonSmall children={card.buttonText} className="btn__card" />
          </div>
        ))}
      </section>
    </section>
  );
}

export default FamilyBrand;

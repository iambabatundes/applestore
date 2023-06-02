import React from "react";
import Faq from "./faq";
import "../components/styles/faqSection.css";

export default function FaqSection() {
  return (
    <section>
      <header className="faqSection__header">
        <h1>Frequently Asked Any Questions</h1>
      </header>
      <div className="faqSection">
        <Faq />
        <img
          src="/apple6.jpg"
          alt="Frequent ask questions"
          className="faqSection__image"
        />
      </div>
    </section>
  );
}

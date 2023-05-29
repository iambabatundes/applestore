import React from "react";
import "../components/styles/feactured.css";
import "@fontsource/poppins/900.css";
import ButtonSmall from "./buttonSmall";

export default function Feactured() {
  return (
    <section>
      <div className="feactured__main">
        <img src="/100years.webp" alt="100 years of quality" />
        <article className="feactured__content">
          <h2>100 years of Quality</h2>
          <p>
            As we celebrate 100 years of quality, we reflect on the trust and
            loyalty you have bestowed upon us. Your unwavering support has been
            our driving force, inspiring us to reach new heights and redefine
            excellence. We are grateful for the opportunity to be a part of your
            lives, and we are committed to exceeding your expectations for the
            next century and beyond.
          </p>
          <ButtonSmall children="Read More" className="btn__card" />
        </article>
      </div>
    </section>
  );
}

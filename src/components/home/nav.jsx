import React from "react";
import "./Sneaker.css"; // Import the CSS file for styling

export default function Sneaker() {
  return (
    <section className="sneaker-section">
      <div className="sneaker-container">
        <div className="text-overlay">
          <h2 className="new-collection">NEW COLLECTION</h2>
          <h1 className="super-speed">SUPER SPEED</h1>
          <img
            src="/path/to/sneaker-image.png"
            alt="Sneaker"
            className="sneaker-image"
          />
          <div className="price-box">
            <span>ONLY</span>
            <h2>$50</h2>
          </div>
          <div className="order-now">ORDER NOW</div>
          <div className="contact-info">+354-980-567</div>
          <div className="website">www.yourstore.com</div>
        </div>
      </div>
    </section>
  );
}

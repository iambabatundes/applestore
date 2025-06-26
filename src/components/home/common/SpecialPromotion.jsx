import { useState, useEffect } from "react";
import "../styles/SpecialPromotion.css";

export default function SpecialPromotion({
  promo,
  selectedCurrency,
  convertedPrice,
  convertedDiscount,
  specialPromotions,
}) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const endDate = new Date(promo.endDate);
      if (isNaN(endDate.getTime())) {
        setTimeLeft("Invalid end time");
        return;
      }

      const end = endDate.getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / 1000 / 60) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [promo.endDate]);

  const bgColor = specialPromotions[promo.name] || "#ccc";

  return (
    <section className="special-promotion" style={{ backgroundColor: bgColor }}>
      <div className="special__Mobilepromotion-main">
        <div className="promo-pricing">
          <span className="current-price">
            {selectedCurrency} {convertedPrice}
          </span>
          {convertedDiscount && (
            <span className="discount-price">
              {selectedCurrency} {convertedDiscount}
            </span>
          )}
        </div>
        <article>
          <h4 className="specialPromo__heading">{promo.name}</h4>
          {/* <p calssName="specialPromo__subheading">{promo.description}</p> */}
          <p className="countdown">Ends in: {timeLeft}</p>
        </article>
      </div>
    </section>
  );
}

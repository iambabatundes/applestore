import React from "react";
import Icon from "../icon";

export default function FooterFooter() {
  return (
    <section>
      <div className="footer__footer">
        <h1>Shop, explore, buy</h1>
        <h2>develop by 9digitals</h2>
        <div className="footer__payment-icon">
          <Icon paystack className="paystack" />
          <Icon strip className="strip" />
          <Icon mastercard className="mastercard" />
          <Icon visa className="visa" />
        </div>
      </div>
    </section>
  );
}

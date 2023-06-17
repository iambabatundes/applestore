import React from "react";
import Icon from "../icon";
import { Link } from "react-router-dom";

export default function FooterContact() {
  return (
    <section>
      <article className="footer__contact">
        <h1>Contact us</h1>
        <ul>
          <Link to="tel:+2348162366357">
            <span className="phone">
              <Icon phone className="phone-icon" />
              <li>+234 8162366357</li>
            </span>
          </Link>

          <span className="address">
            <Icon address className="address-icon" />
            <li>Ikeja, Lagos Nigeria</li>
          </span>

          <Link to="email:info@applestore.com">
            <span className="email">
              <Icon email className="email-icon" />
              <li>info@applestore.com</li>
            </span>
          </Link>
        </ul>
      </article>
    </section>
  );
}

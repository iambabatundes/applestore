import React from "react";
import "./styles/footer.css";

import Newsletter from "./Newsletter";
import FooterContact from "./footerContact";
import UsefulLink from "./usefulLink";
import OpenTime from "./OpenTime";
import FooterFooter from "./FooterFooter";
import Logo from "../home/common/logo";

export default function Footer({ logoImage }) {
  return (
    <section>
      <div className="footer">
        <div>
          <Logo
            logoImage={logoImage}
            brandLogo="footer__logo"
            navbarBrand="footer__container"
          />
        </div>
        <FooterContact />
        <UsefulLink />
        <Newsletter />
        <OpenTime />
      </div>
      <FooterFooter />
    </section>
  );
}

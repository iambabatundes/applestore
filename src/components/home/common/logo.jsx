import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ brandLogo, logoImage, navbarBrand }) {
  return (
    <div className={`${navbarBrand}`}>
      <Link to="/">
        <img src={logoImage} alt="Brand Logo" className={`${brandLogo}`} />
      </Link>
    </div>
  );
}

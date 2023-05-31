import React from "react";
import HomeSlider from "./HomeSlider";
import FamilyBrand from "./familyBrand";
import Feactured from "./feactured";
import Products from "./products";
import BrandProduct from "./brandProduct";

function Home() {
  return (
    <section>
      <HomeSlider />
      <BrandProduct />
      {/* <FamilyBrand /> */}
      <Feactured />
      <Products />
    </section>
  );
}

export default Home;

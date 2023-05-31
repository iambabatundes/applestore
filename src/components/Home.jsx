import React from "react";
import HomeSlider from "./HomeSlider";
import FamilyBrand from "./familyBrand";
import Feactured from "./feactured";
import Products from "./products";

function Home() {
  return (
    <section>
      <HomeSlider />
      <FamilyBrand />
      <Feactured />
      <Products />
    </section>
  );
}

export default Home;

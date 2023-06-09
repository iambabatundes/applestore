import React from "react";
import HomeSlider from "./HomeSlider";
import FamilyBrand from "./familyBrand";
import Feactured from "./feactured";
import Products from "./products";
import BrandProduct from "./brandProduct";
import FaqSection from "./faqSection";
import Blog from "./blog";

function Home() {
  return (
    <section>
      <HomeSlider />
      <BrandProduct />
      {/* <FamilyBrand /> */}
      <Feactured />
      <BrandProduct />
      {/* <Products /> */}
      <FaqSection />
      <Blog />
    </section>
  );
}

export default Home;

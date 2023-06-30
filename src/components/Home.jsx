import React from "react";
import HomeSlider from "./HomeSlider";
import FamilyBrand from "./familyBrand";
import Feactured from "./feactured";
import Products from "./products";
import Product from "./Product";
import BrandProduct from "./brandProduct";
import FaqSection from "./faqSection";
import Blog from "./blog";
import Newsletter from "./Newsletter";

function Home({ addToCart }) {
  return (
    <section>
      <HomeSlider />
      <BrandProduct />
      <Feactured />
      <Product addToCart={addToCart} />
      <FaqSection />
      <Blog />
      <Newsletter />
    </section>
  );
}

export default Home;

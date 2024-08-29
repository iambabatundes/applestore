import React from "react";
import HomeSlider from "./HomeSlider";
// import FamilyBrand from "./familyBrand";
import Feactured from "./feactured";
// import Products from "./products";
import Product from "./Product";
import BrandProduct from "./brandProduct";
import FaqSection from "./faqSection";
import Blog from "./blog";
import Newsletter from "./Newsletter";
import HeroSlider from "./home/HeroSlider";
import ExclusiveDeal from "./home/exclusiveDeal";
import BigSave from "./home/bigSave";
// import DiscountProduct from "./home/discountProduct";

function Home({ addToCart, cartItems, blogPosts, user }) {
  return (
    <section>
      <HeroSlider />
      <ExclusiveDeal user={user} />
      <BigSave addToCart={addToCart} cartItems={cartItems} />
      {/* <DiscountProduct /> */}
      <HomeSlider />
      <BrandProduct />
      <Feactured />
      <Product addToCart={addToCart} cartItems={cartItems} />
      <FaqSection />
      <Blog blogPosts={blogPosts} />
      <Newsletter />
    </section>
  );
}

export default Home;

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
import DiscountProduct from "./home/discountProduct";
// import ShopCategories from "./home/shopCategories";
// import ChoiceDay from "./home/choiceDay";
import Choice from "./home/choice";
import MoreToLove from "./home/moreToLove";

function Home({
  addToCart,
  cartItems,
  blogPosts,
  user,
  conversionRate,
  selectedCurrency,
}) {
  return (
    <section>
      <HeroSlider />
      <ExclusiveDeal user={user} />
      <BigSave
        addToCart={addToCart}
        cartItems={cartItems}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
      />
      {/* <ShopCategories /> */}
      <Choice
        addToCart={addToCart}
        cartItems={cartItems}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
      />
      <MoreToLove
        addToCart={addToCart}
        cartItems={cartItems}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
      />
      {/* <ChoiceDay /> */}
      <DiscountProduct />
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

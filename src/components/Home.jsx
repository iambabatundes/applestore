import React from "react";
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
  currencySymbols,
  isLoading,
}) {
  return (
    <section>
      <HeroSlider
        selectedCurrency={selectedCurrency}
        conversionRate={conversionRate}
      />
      <ExclusiveDeal
        user={user}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
      />
      <BigSave
        addToCart={addToCart}
        cartItems={cartItems}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
        currencySymbols={currencySymbols}
        isLoading={isLoading}
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
    </section>
  );
}

export default Home;

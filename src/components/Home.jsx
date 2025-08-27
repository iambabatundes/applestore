import React from "react";
import { useStore } from "zustand";
import { authStore } from "../services/authService";
import HeroSlider from "./home/HeroSlider";
import ExclusiveDeal from "./home/exclusiveDeal";
import BigSave from "./home/bigSave";
// import DiscountProduct from "./home/discountProduct";
// import ShopCategories from "./home/shopCategories";
// import ChoiceDay from "./home/choiceDay";
import Choice from "./home/choice";
import MoreToLove from "./home/moreToLove";
import CategoryOne from "./home/categoryOne";
import CategoryTwo from "./home/categoryTwo";
import CategoryThree from "./home/categoryThree";
import { useCartStore } from "./store/cartStore";
import { useCurrencyStore } from "./store/currencyStore";

function Home({
  // conversionRate,
  // selectedCurrency,
  currencySymbols,
  isLoading,
}) {
  const { user } = useStore(authStore);
  const { addToCart, cartItems } = useCartStore();
  const { selectedCurrency, conversionRate } = useCurrencyStore();
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

      <CategoryOne
        addToCart={addToCart}
        cartItems={cartItems}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
        currencySymbols={currencySymbols}
      />
      {/* <ShopCategories /> */}
      <Choice
        addToCart={addToCart}
        cartItems={cartItems}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
      />

      <CategoryTwo
        addToCart={addToCart}
        cartItems={cartItems}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
        currencySymbols={currencySymbols}
      />

      <CategoryThree
        addToCart={addToCart}
        cartItems={cartItems}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
        currencySymbols={currencySymbols}
      />
      <MoreToLove
        addToCart={addToCart}
        cartItems={cartItems}
        conversionRate={conversionRate}
        selectedCurrency={selectedCurrency}
      />
      {/* <ChoiceDay /> */}
    </section>
  );
}

export default Home;

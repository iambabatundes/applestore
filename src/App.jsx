import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import "./fonts/MacanPanWeb-Medium.ttf";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";

import AppRoutes from "./routes/AppRoutes";
import CheckoutNavbar from "./components/checkoutNavbar";
import Admin from "./components/backend/admin";
import Navbar from "./components/home/navbar";
import useUser from "./components/home/hooks/useUser";
import Footer from "./components/footer/footer";
import LoadingSpinner from "./components/common/loadingSpinner";
import fetchLogo from "./utils/fetchLogo";
import { useCartStore } from "../src/components/store/cartStore";
import { useCurrencyStore } from "../src/components/store/currencyStore";
import { useGeoLocationStore } from "../src/components/store/geoLocationStore";

function App() {
  const { user, loading, setUser, handleProfileSubmit } = useUser();

  const {
    cartItems,
    addToCart,
    selectedQuantities,
    setSelectedQuantities,
    quantityTenPlus,
    setQuantityTenPlus,
    handleDelete,
    setCartItems,
  } = useCartStore();

  const [loadingApp, setLoadingApp] = useState(false);
  const [logoImage, setLogoImage] = useState("");

  const location = useLocation();

  const {
    conversionRate,
    selectedCurrency,
    setSelectedCurrency,
    setConversionRate,
    currencyRates,
  } = useCurrencyStore();

  const { geoLocation, fetchGeoLocation } = useGeoLocationStore();

  useEffect(() => {
    fetchGeoLocation();
    useCurrencyStore.getState().initializeCurrency();
    fetchLogo(setLogoImage);
    setTimeout(() => setLoadingApp(false), 300);
  }, []);

  const handleCurrencyChange = (currency) => {
    // setSelectedCurrency(currency);
    const rate = currencyRates[currency] || 1;
    setConversionRate(rate);
    setSelectedCurrency(currency, rate);
    localStorage.setItem("selectedCurrency", currency);
  };

  const handleSubmit = (e, itemId) => {
    e.preventDefault();
    const input = e.target.querySelector('input[name="quantity"]');
    const inputValue = input ? input.value.trim() : "1";

    let quantity = parseInt(inputValue, 10);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    }

    // Update Zustand store correctly
    useCartStore.setState((state) => ({
      selectedQuantities: {
        ...state.selectedQuantities,
        [itemId]: quantity,
      },
      quantityTenPlus: {
        ...state.quantityTenPlus,
        [itemId]: quantity > 9 ? quantity : undefined,
      },
      cartItems: state.cartItems.map((item) =>
        item._id === itemId
          ? { ...item, quantity, total: item.price * quantity }
          : item
      ),
    }));
  };

  const cartItemCount =
    Object.values(selectedQuantities).reduce((total, quantity) => {
      if (quantity === "10+") {
        return total + 1; // Increment count by 1 "Quantity 10+"
      }
      return total + parseInt(quantity);
    }, 0) + (selectedQuantities["Quantity 10+"] || 0);

  const renderNavbar = () => {
    return location.pathname === "/checkout" ? (
      <CheckoutNavbar cartItemCount={cartItemCount} logoImage={logoImage} />
    ) : (
      <Navbar
        cartItemCount={cartItemCount}
        user={user}
        selectedCurrency={selectedCurrency}
        currencyRates={currencyRates}
        onCurrencyChange={handleCurrencyChange}
        isLoading={loadingApp}
        logoImage={logoImage}
        geoLocation={geoLocation}
      />
    );
  };

  if (loadingApp || loading) return <LoadingSpinner />;

  return (
    <>
      <ToastContainer />
      {location.pathname.includes("/admin") ? (
        <Admin count={5} logo={logoImage} />
      ) : (
        <>
          {renderNavbar()}
          <main className="main">
            <AppRoutes
              user={user}
              setUser={setUser}
              handleProfileSubmit={handleProfileSubmit}
              addToCart={addToCart}
              cartItems={cartItems}
              selectedQuantities={selectedQuantities}
              setSelectedQuantities={setSelectedQuantities}
              quantityTenPlus={quantityTenPlus}
              setQuantityTenPlus={setQuantityTenPlus}
              handleSubmit={handleSubmit}
              setCartItems={setCartItems}
              handleDelete={handleDelete}
              isLoggedIn={user}
              selectedCurrency={selectedCurrency}
              conversionRate={conversionRate}
            />
          </main>
          <Footer logoImage={logoImage} />
        </>
      )}
    </>
  );
}

export default App;

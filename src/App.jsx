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
import Footer from "./components/footer/footer";
import LoadingSpinner from "./components/common/loadingSpinner";
import fetchLogo from "./utils/fetchLogo";
import { useCartStore } from "../src/components/store/cartStore";
import { useCurrencyStore } from "../src/components/store/currencyStore";
import { useGeoLocationStore } from "../src/components/store/geoLocationStore";
import { useStore } from "zustand";
import { authStore, initializeAuth } from "./services/authService"; // Import initializeAuth
import { httpService, ClientType } from "./services/httpService";

import { useAdminAuthStore } from "./components/backend/store/useAdminAuthStore";

function App() {
  const { user, isAuthReady, accessToken, isAuthenticated } =
    useStore(authStore);
  const [appInitialized, setAppInitialized] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false); // Track auth initialization

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

  // Initialize interceptors and auth once
  useEffect(() => {
    let isInitialized = false;

    const initializeApp = async () => {
      if (isInitialized) return;
      isInitialized = true;

      try {
        console.log("Starting app initialization...");

        await initializeAuth();
        setAuthInitialized(true);

        httpService.setRefreshCallback(ClientType.USER, () =>
          authStore.getState().refreshAccessToken()
        );

        httpService.setRefreshCallback(ClientType.ADMIN, () => {
          console.warn("Admin refresh not implemented");
          return Promise.reject(new Error("Admin refresh not implemented"));
        });

        // Initialize other services in parallel
        await Promise.all([
          fetchGeoLocation(),
          useCurrencyStore.getState().initializeCurrency(),
          fetchLogo(setLogoImage),
        ]);

        console.log("App initialization completed");
      } catch (error) {
        console.error("App initialization error:", error);
      } finally {
        setAppInitialized(true);
      }
    };

    initializeApp();
  }, []); // Empty dependency array - run once

  // Handle currency changes
  const handleCurrencyChange = (currency) => {
    const rate = currencyRates[currency] || 1;
    setConversionRate(rate);
    setSelectedCurrency(currency, rate);
    localStorage.setItem("selectedCurrency", currency);
  };

  // Handle cart quantity updates
  const handleSubmit = (e, itemId) => {
    e.preventDefault();
    const input = e.target.querySelector('input[name="quantity"]');
    const inputValue = input ? input.value.trim() : "1";

    let quantity = parseInt(inputValue, 10);
    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
    }

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

  // Calculate cart item count
  const cartItemCount =
    Object.values(selectedQuantities).reduce((total, quantity) => {
      if (quantity === "10+") {
        return total + 1;
      }
      return total + parseInt(quantity || 0);
    }, 0) + (selectedQuantities["Quantity 10+"] || 0);

  // Render appropriate navbar
  const renderNavbar = () => {
    if (location.pathname === "/checkout") {
      return (
        <CheckoutNavbar cartItemCount={cartItemCount} logoImage={logoImage} />
      );
    }

    return (
      <Navbar
        cartItemCount={cartItemCount}
        user={user}
        selectedCurrency={selectedCurrency}
        currencyRates={currencyRates}
        onCurrencyChange={handleCurrencyChange}
        isLoading={!appInitialized}
        logoImage={logoImage}
        geoLocation={geoLocation}
      />
    );
  };

  // Show loading spinner while critical components initialize
  if (!appInitialized || !authInitialized || !isAuthReady) {
    return <LoadingSpinner />;
  }

  // Debug logging for auth state (remove in production)
  console.log("App render - Auth state:", {
    user: !!user,
    isAuthenticated,
    accessToken: !!accessToken,
    isAuthReady,
    authInitialized,
    appInitialized,
  });

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="custom-toast"
      />

      {location.pathname.includes("/admin") ? (
        <Admin count={5} logo={logoImage} />
      ) : (
        <>
          {renderNavbar()}
          <main className="main">
            <AppRoutes
              addToCart={addToCart}
              cartItems={cartItems}
              selectedQuantities={selectedQuantities}
              setSelectedQuantities={setSelectedQuantities}
              quantityTenPlus={quantityTenPlus}
              setQuantityTenPlus={setQuantityTenPlus}
              handleSubmit={handleSubmit}
              setCartItems={setCartItems}
              handleDelete={handleDelete}
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

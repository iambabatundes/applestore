import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import "./fonts/MacanPanWeb-Medium.ttf";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";

import Home from "./components/Home";
import SinglePost from "./components/singlePost";
import Product from "./components/Product";
import Footer from "./components/footer/footer";
import Cart from "./components/cart";
import SingleProducts from "./components/home/singleProduct";
import Checkout from "./components/checkout";
import CheckoutNavbar from "./components/checkoutNavbar";
import Admin from "./components/backend/admin";
import Navbar from "./components/home/navbar";
import Login from "./components/home/login";
import Register from "./components/home/register";
import UserProfile from "./components/home/userProfile";
import Logout from "./components/home/logout";
import NotFound from "./components/home/notFound";
import useUser from "./components/home/hooks/useUser";
import RequireAuth from "./components/home/common/requireAuth";
import LoadingSpinner from "./components/common/loadingSpinner";
import { useCurrency } from "./components/home/hooks/useCurrency";
import { useGeoLocation } from "./components/home/hooks/useGeoLocation";
import fetchLogo from "./utils/fetchLogo";
import { useCart } from "./hook/useCart";

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
  } = useCart();

  const [loadingApp, setLoadingApp] = useState(false);
  const [logoImage, setLogoImage] = useState("");

  const location = useLocation();

  const {
    conversionRate,
    selectedCurrency,
    setSelectedCurrency,
    setConversionRate,
    currencyRates,
  } = useCurrency();

  const { geoLocation } = useGeoLocation();

  useEffect(() => {
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
    const inputValue = e.target[0].value.trim(); // Get the value entered in the input field

    const quantity = parseInt(inputValue);
    if (quantity >= 1 && quantity <= 9) {
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: quantity,
      }));
      setQuantityTenPlus((prevQuantityTenPlus) => ({
        ...prevQuantityTenPlus,
        [itemId]: undefined,
      }));
    } else {
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: isNaN(quantity) ? 1 : quantity,
      }));
    }
  };

  const cartItemCount =
    Object.values(selectedQuantities).reduce((total, quantity) => {
      if (quantity === "10+") {
        return total + 1; // Increment count by 1 "Quantity 10+"
      }
      return total + parseInt(quantity);
    }, 0) + (selectedQuantities["Quantity 10+"] || 0);

  const isAdminMode = location.pathname.includes("/admin");
  const countComment = 5;
  const companyName = "AppStore";

  const renderNavbar = () => {
    if (location.pathname === "/checkout") {
      return (
        <CheckoutNavbar cartItemCount={cartItemCount} logoImage={logoImage} />
      );
    } else {
      return (
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
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingApp(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loadingApp) {
    return <LoadingSpinner />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ToastContainer />
      {isAdminMode ? (
        <Admin
          companyName={companyName}
          count={countComment}
          logo={logoImage}
        />
      ) : (
        <>
          {renderNavbar()}
          <main className="main">
            <Routes>
              <Route
                path="/"
                exact
                element={
                  <Home
                    addToCart={addToCart}
                    cartItems={cartItems}
                    user={user}
                    selectedCurrency={selectedCurrency}
                    conversionRate={conversionRate}
                  />
                }
              />

              <Route
                path="/product"
                element={
                  <Product addToCart={addToCart} cartItems={cartItems} />
                }
              />
              <Route
                path="/blog/:title"
                element={
                  <SinglePost
                  // blogPosts={blogPosts}
                  // setBlogPosts={setBlogPosts}
                  />
                }
              />
              <Route
                path="/:name"
                exact
                element={
                  <SingleProducts
                    conversionRate={conversionRate}
                    selectedCurrency={selectedCurrency}
                  />
                }
              />

              <Route path="/register" element={<Register user={user} />} />
              <Route
                path="/login"
                element={<Login companyName={companyName} user={user} />}
              />
              <Route path="/logout" element={<Logout />} />
              <Route
                path="users/*"
                element={
                  <RequireAuth user={user}>
                    <UserProfile
                      user={user}
                      setUser={setUser}
                      handleProfileSubmit={handleProfileSubmit}
                      addToCart={addToCart}
                      cartItems={cartItems}
                    />
                  </RequireAuth>
                }
              />

              <Route
                path="/checkout"
                element={<Checkout cartItem={cartItems} />}
              />
              <Route
                path="/cart"
                element={
                  <Cart
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
                }
              />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
              {/* <Route path="*" element={<Navigate to="/not-found" replace />} /> */}
            </Routes>
          </main>
          <Footer logoImage={logoImage} />
        </>
      )}
    </>
  );
}

export default App;

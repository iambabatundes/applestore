import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import "./fonts/MacanPanWeb-Medium.ttf";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import SinglePost from "./components/singlePost";
import Home from "./components/Home";
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
import { getUploads } from "./services/logoService";
import { useCurrency } from "./components/home/hooks/useCurrency";
import { useGeoLocation } from "./components/home/hooks/useGeoLocation";

function App() {
  const { user, loading, setUser, handleProfileSubmit } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [quantityTenPlus, setQuantityTenPlus] = useState({});
  // const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  // const [conversionRate, setConversionRate] = useState(1);
  const [loadingApp, setLoadingApp] = useState(false);
  const [logoImage, setLogoImage] = useState("");

  const location = useLocation();
  const mediaLogo = process.env.REACT_APP_API_URL;

  const {
    conversionRate,
    selectedCurrency,
    setSelectedCurrency,
    setConversionRate,
    currencyRates,
  } = useCurrency();

  const { geoLocation } = useGeoLocation();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await getUploads();
        if (data && data.logoImage) {
          setLogoImage(`${mediaLogo}/uploads/${data.logoImage.filename}`);
        } else {
          console.log("No logo found.");
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchLogo();
  }, [mediaLogo]);

  // useEffect(() => {
  //   const savedCurrency = localStorage.getItem("selectedCurrency");
  //   const savedRate = localStorage.getItem("conversionRate");

  //   if (savedCurrency && savedRate) {
  //     setSelectedCurrency(savedCurrency);
  //     setConversionRate(parseFloat(savedRate));
  //   }
  // }, []);

  // const handleCurrencyChange = (currency, rate) => {
  //   setSelectedCurrency(currency);
  //   setConversionRate(rate);
  //   localStorage.setItem("selectedCurrency", currency);
  //   localStorage.setItem("conversionRate", rate);
  // };
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

  const addToCart = (product) => {
    // Check if the product already exists in the cart
    const existingProduct = cartItems.find((item) => item._id === product._id);

    if (existingProduct) {
      // Product already in the cart, increase the quantity
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Product not in the cart, add it with quantity 1
      setCartItems((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    }
  };

  const handleDelete = (itemId) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => item._id !== itemId
      );
      return updatedCartItems;
    });

    setSelectedQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[itemId];
      return updatedQuantities;
    });

    setQuantityTenPlus((prevQuantityTenPlus) => {
      const updatedQuantityTenPlus = { ...prevQuantityTenPlus };
      delete updatedQuantityTenPlus[itemId];
      return updatedQuantityTenPlus;
    });

    // Reset the selected quantity and QuantityTenPlus for the deleted item
    setSelectedQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      updatedQuantities[itemId] = 1; // Reset the quantity to default (1)
      return updatedQuantities;
    });
    setQuantityTenPlus((prevQuantityTenPlus) => {
      const updatedQuantityTenPlus = { ...prevQuantityTenPlus };
      updatedQuantityTenPlus[itemId] = undefined; // Reset QuantityTenPlus to default
      return updatedQuantityTenPlus;
    });
  };

  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach((item) => {
      if (!initialQuantities.hasOwnProperty(item._id)) {
        initialQuantities[item._id] = selectedQuantities[item._id] || 1;
      }
    });
    setSelectedQuantities(initialQuantities);
  }, [cartItems]);

  const cartItemCount =
    Object.values(selectedQuantities).reduce((total, quantity) => {
      if (quantity === "10+") {
        return total + 1; // Increment count by 1 "Quantity 10+"
      }
      return total + parseInt(quantity);
    }, 0) + (selectedQuantities["Quantity 10+"] || 0);

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

  const isAdminMode = location.pathname.includes("/admin");
  const countComment = 5;
  const companyName = "AppStore";

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingApp(false);
    }, 300); // Delay spinner for 300ms to avoid flicker

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

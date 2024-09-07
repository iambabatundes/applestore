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
import SingleProduct from "./components/singleProduct";
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

function App() {
  const { user, loading, setUser, handleProfileSubmit } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [quantityTenPlus, setQuantityTenPlus] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("₦");
  const [conversionRate, setConversionRate] = useState(1);

  const location = useLocation();

  // Function to update currency and conversion rate
  const handleCurrencyChange = (currency, rate) => {
    setSelectedCurrency(currency);
    setConversionRate(rate);
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
    const existingProduct = cartItems.find((item) => item.id === product.id);

    if (existingProduct) {
      // Product already in the cart, increase the quantity
      setCartItems((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id
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
        (item) => item.id !== itemId
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
      if (!initialQuantities.hasOwnProperty(item.id)) {
        initialQuantities[item.id] = selectedQuantities[item.id] || 1;
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
      return <CheckoutNavbar cartItemCount={cartItemCount} />;
    } else {
      return (
        <Navbar
          cartItemCount={cartItemCount}
          user={user}
          onCurrencyChange={handleCurrencyChange}
        />
      );
    }
  };

  const isAdminMode = location.pathname.includes("/admin");
  const countComment = 5;
  const companyName = "AppStore";

  if (loading) {
    return <p>Loading...</p>; // Or a loading spinner
  }

  return (
    <>
      <ToastContainer />
      {isAdminMode ? (
        <Admin companyName={companyName} count={countComment} />
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
                    // blogPosts={blogPosts}
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
              <Route path="/:name" exact element={<SingleProduct />} />
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
                  />
                }
              />
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
              {/* <Route path="*" element={<Navigate to="/not-found" replace />} /> */}
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;

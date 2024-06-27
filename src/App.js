import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import "./fonts/MacanPanWeb-Medium.ttf";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import About from "./components/About";
import SinglePost from "./components/singlePost";
import NavBar from "./components/navBar";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Product from "./components/Product";
import Contact from "./components/Contact";
import Footer from "./components/footer/footer";
import Cart from "./components/cart";
import SingleProduct from "./components/singleProduct";
import Checkout from "./components/checkout";
import CheckoutNavbar from "./components/checkoutNavbar";
import Admin from "./components/backend/admin";
import Blog from "./components/blog";
import Navbar from "./components/home/navbar";
import Login from "./components/home/login";
import Register from "./components/home/register";
import UserProfile from "./components/home/userProfile";

function App() {
  const [blogPosts, setBlogPosts] = useState([]); // Add this state variable
  const [cartItems, setCartItems] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [quantityTenPlus, setQuantityTenPlus] = useState({}); // State variable for "Quantity 10+"

  const location = useLocation();

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
        // <NavBar
        //   cartItemCount={cartItemCount}
        //   cartItems={cartItems}
        //   selectedQuantities={selectedQuantities}
        //   setSelectedQuantities={setSelectedQuantities}
        // />
        <Navbar cartItemCount={cartItemCount} />
      );
    }
  };

  const isAdminMode = location.pathname.includes("/admin");
  const countComment = 5;
  const companyName = "AppStore";

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
                    blogPosts={blogPosts}
                  />
                }
              />
              <Route path="/shop" element={<Shop />} />
              <Route path="/blog" element={<Blog />} />
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
                    blogPosts={blogPosts}
                    setBlogPosts={setBlogPosts}
                  />
                }
              />
              <Route path="/:title" exact element={<SingleProduct />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<UserProfile />} />
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
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;

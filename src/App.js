import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./fonts/MacanPanWeb-Medium.ttf";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import NavBar from "./components/navBar";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Product from "./components/Product";
import Contact from "./components/Contact";
import About from "./components/About";
import SinglePost from "./components/singlePost";
import Footer from "./components/footer/footer";
import Cart from "./components/cart";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});

  const addToCart = (item, quantity) => {
    const updatedQuantities = {
      ...selectedQuantities,
      [item.id]: (selectedQuantities[item.id] || 0) + parseInt(quantity),
    };

    setCartItems((prevCartItems) => [
      ...prevCartItems,
      { ...item, quantity: parseInt(quantity) },
    ]);
    setSelectedQuantities(updatedQuantities);
  };

  const cartItemCount =
    Object.values(selectedQuantities).reduce((total, quantity) => {
      if (quantity === "10+") {
        return total + 1; // Increment count by 1 "Quantity 10+"
      }
      return total + parseInt(quantity);
    }, 0) + (selectedQuantities["Quantity 10+"] || 0);

  return (
    <>
      <NavBar
        cartItemCount={cartItemCount}
        cartItems={cartItems}
        selectedQuantities={selectedQuantities}
        setSelectedQuantities={setSelectedQuantities}
      />
      <main className="main">
        <Routes>
          <Route path="/" exact element={<Home addToCart={addToCart} />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product" element={<Product addToCart={addToCart} />} />
          <Route path="/:title" element={<SinglePost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                selectedQuantities={selectedQuantities}
                setSelectedQuantities={setSelectedQuantities}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;

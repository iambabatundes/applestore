import React, { useState, useEffect } from "react";
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
import SingleProduct from "./components/singleProduct";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [quantityTenPlus, setQuantityTenPlus] = useState({}); // State variable for "Quantity 10+"

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

    // Reset QuantityTenPlus to default when an item is added
    setQuantityTenPlus((prevQuantityTenPlus) => {
      const updatedQuantityTenPlus = { ...prevQuantityTenPlus };
      updatedQuantityTenPlus[item.id] = undefined; // Reset QuantityTenPlus to default
      return updatedQuantityTenPlus;
    });
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
          <Route path="/blog/:title" element={<SinglePost />} />
          <Route path="/:title" exact element={<SingleProduct />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
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
  );
}

export default App;

import { useState, useEffect } from "react";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [quantityTenPlus, setQuantityTenPlus] = useState({});

  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach((item) => {
      if (!initialQuantities.hasOwnProperty(item._id)) {
        initialQuantities[item._id] = selectedQuantities[item._id] || 1;
      }
    });
    setSelectedQuantities(initialQuantities);
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleDelete = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    setSelectedQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[itemId];
      return newQuantities;
    });
    setQuantityTenPlus((prev) => {
      const newQuantityTenPlus = { ...prev };
      delete newQuantityTenPlus[itemId];
      return newQuantityTenPlus;
    });
  };

  return {
    cartItems,
    setCartItems,
    selectedQuantities,
    setSelectedQuantities,
    quantityTenPlus,
    setQuantityTenPlus,
    addToCart,
    handleDelete,
  };
};

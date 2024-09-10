import { useState, useEffect, useCallback } from "react";

// Unified hook to manage cart status and actions
export function useCart(item, cartItems, addToCart) {
  const [added, setAdded] = useState(false);

  // Sync with localStorage on mount
  useEffect(() => {
    const addedStatus = localStorage.getItem(`added_${item.id}`);
    if (addedStatus === "true") {
      setAdded(true);
    }
  }, [item.id]);

  // Sync with cartItems array to check if the item is in the cart
  useEffect(() => {
    if (cartItems.some((cartItem) => cartItem.id === item.id)) {
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [cartItems, item.id]);

  // Handle adding item to cart, optimized with useCallback
  const handleAddToCart = useCallback(() => {
    addToCart(item);
    setAdded(true);
    localStorage.setItem(`added_${item.id}`, "true");
  }, [item, addToCart]);

  return { added, handleAddToCart };
}

import { useState } from "react";

export function useCartActions(item, cartItems, addToCart) {
  const [added, setAdded] = useState(
    cartItems.some((cartItem) => cartItem._id === item._id)
  );

  const handleAddToCart = () => {
    addToCart(item);
    setAdded(true);
    localStorage.setItem(`added_${item._id}`, "true");
  };

  return { added, handleAddToCart };
}

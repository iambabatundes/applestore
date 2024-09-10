import { useState } from "react";

export function useCartActions(item, cartItems, addToCart) {
  const [added, setAdded] = useState(
    cartItems.some((cartItem) => cartItem.id === item.id)
  );

  const handleAddToCart = () => {
    addToCart(item);
    setAdded(true);
    localStorage.setItem(`added_${item.id}`, "true");
  };

  return { added, handleAddToCart };
}

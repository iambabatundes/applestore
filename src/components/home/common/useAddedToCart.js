import { useState, useEffect } from "react";

export const useAddedToCart = (itemId, cartItems) => {
  const [added, setIAdded] = useState(false);

  useEffect(() => {
    const addedStatus = localStorage.getItem(`added_${itemId}`);
    if (addedStatus === "true") {
      setIAdded(true);
    }
  }, [itemId]);

  useEffect(() => {
    if (cartItems && cartItems.some((cartItem) => cartItem._id === itemId)) {
      setIAdded(true);
    } else {
      setIAdded(false);
    }
  }, [cartItems, itemId]);

  return [added, setIAdded];
};

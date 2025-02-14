// import { useState, useEffect, useCallback } from "react";

// export function useCart(item, cartItems, addToCart) {
//   const [added, setAdded] = useState(false);

//   useEffect(() => {
//     const addedStatus = localStorage.getItem(`added_${item.id}`);
//     if (addedStatus === "true") {
//       setAdded(true);
//     }
//   }, [item.id]);

//   useEffect(() => {
//     if (cartItems.some((cartItem) => cartItem.id === item.id)) {
//       setAdded(true);
//     } else {
//       setAdded(false);
//     }
//   }, [cartItems, item.id]);

//   const handleAddToCart = useCallback(() => {
//     addToCart(item);
//     setAdded(true);
//     localStorage.setItem(`added_${item.id}`, "true");
//   }, [item, addToCart]);

//   return { added, handleAddToCart };
// }

import { useState, useEffect, useCallback } from "react";

export function useCart(item, cartItems, addToCart) {
  const [added, setAdded] = useState({});

  // Load 'added' state from localStorage on mount
  useEffect(() => {
    const storedAddedState =
      JSON.parse(localStorage.getItem("addedItems")) || {};
    setAdded(storedAddedState);
  }, []);

  useEffect(() => {
    setAdded((prev) => ({
      ...prev,
      [item._id]: cartItems.some((cartItem) => cartItem._id === item._id),
    }));
  }, [cartItems, item._id]);

  const handleAddToCart = useCallback(() => {
    addToCart(item);

    setAdded((prev) => {
      const updatedAdded = { ...prev, [item._id]: true };
      localStorage.setItem("addedItems", JSON.stringify(updatedAdded));
      return updatedAdded;
    });
  }, [item, addToCart]);

  return { added: added[item._id] || false, handleAddToCart };
}

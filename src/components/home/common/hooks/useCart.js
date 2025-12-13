// hooks/useCart.js
import { useCallback, useState } from "react";
import { useCartStore } from "../../../store/cartStore";

export default function useCart(item) {
  const { cartItems, addToCart, isPending } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const productId = item?._id || item?.id;
  const added = cartItems.some(
    (cartItem) => (cartItem._id || cartItem.product?._id) === productId
  );
  const pending = isPending ? isPending(productId) : false;

  const handleAddToCart = useCallback(async () => {
    if (!item || isAdding || pending) return;

    setIsAdding(true);

    try {
      // This now returns instantly with optimistic update
      await addToCart(item, 1, "");

      // Brief delay for visual feedback
      setTimeout(() => {
        setIsAdding(false);
      }, 300);
    } catch (error) {
      console.error("Add to cart failed:", error);
      setIsAdding(false);
    }
  }, [item, addToCart, isAdding, pending]);

  return {
    added,
    handleAddToCart,
    isAdding: isAdding || pending,
    isPending: pending,
  };
}

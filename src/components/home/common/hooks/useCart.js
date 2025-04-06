import { useCallback } from "react";
import { useCartStore } from "../../../store/cartStore";

export function useCart(item) {
  const { cartItems, addToCart } = useCartStore();

  const added = cartItems.some((cartItem) => cartItem._id === item._id);

  const handleAddToCart = useCallback(() => {
    addToCart(item);
  }, [item, addToCart]);

  return { added, handleAddToCart };
}

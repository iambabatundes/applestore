import { useCartStore } from "hook/useCartStore";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, onClose }) {
  const cartItems = useCartStore((state) => state.cartItems);
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    setTimeout(() => navigate("/checkout"), 200);
  };

  if (!isOpen) return null;

  return (
    <div className="mobileCartDrawer">
      <div className="mobileCartHeader">
        <span>My Cart</span>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="mobileCartItems">
        {cartItems.length ? (
          cartItems.map((item) => (
            <div className="mobileCartItem" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <span>
                  ${item.price} × {item.quantity}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <div className="mobileCartFooter">
        <button onClick={handleCheckout} className="mobileCartCheckoutBtn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

import "./styles/cart.css";
import { calculateTotalPrice } from "./utils/utils";
import { Link } from "react-router-dom";
import CartSummary from "./cart/CartSummary";
import EmptyCart from "./cart/emptyCart";
import NotLoginCart from "./cart/notLoginCart";
import config from "../config.json";
import { useCartStore } from "../components/store/cartStore";

export default function Cart({
  cartItems,
  isLoggedIn,
  handleSubmit,
  handleDelete,
  conversionRate,
  selectedCurrency,
}) {
  const { updateQuantity, selectedQuantities, quantityTenPlus } =
    useCartStore();

  const handleQuantityChange = (itemId, quantity) => {
    updateQuantity(itemId, quantity);
  };

  const handleQuantityTenPlusChange = (e, itemId) => {
    const inputValue = parseInt(e.target.value, 10);
    if (!isNaN(inputValue) && inputValue >= 1) {
      useCartStore.setState((state) => ({
        quantityTenPlus: {
          ...state.quantityTenPlus,
          [itemId]: inputValue,
        },
        selectedQuantities: {
          ...state.selectedQuantities,
          [itemId]: inputValue,
        },
      }));
    }
  };

  const totalItem = cartItems.reduce((total, item) => {
    const itemQuantity =
      quantityTenPlus[item._id] ?? selectedQuantities[item._id] ?? 1;
    return total + itemQuantity;
  }, 0);

  const price = calculateTotalPrice(
    cartItems,
    selectedQuantities,
    quantityTenPlus,
    conversionRate
  );

  if (cartItems.length === 0) {
    return isLoggedIn ? <EmptyCart /> : <NotLoginCart />;
  }

  function formatPermalink(name) {
    return name.toLowerCase().replaceAll(" ", "-");
  }

  return (
    <section className="cart cart-main">
      <section className="cart-left">
        <header>Shopping Cart</header>
        <h3>Price</h3>

        {cartItems.map((item) => {
          const selectedQuantity = selectedQuantities[item._id] || 1;
          const isQuantityTenPlus = quantityTenPlus[item._id] !== undefined;

          // const itemPrice = item.discountPrice || item.price;
          // const convertedPrice = (itemPrice * conversionRate).toFixed(2);

          const convertedPrice = (item.price * conversionRate).toFixed(2);

          return (
            <section className="cart-item" key={item._id}>
              <article className="cart-item__main">
                {/* <img src={item.image} alt={item.name} width={100} /> */}
                <img
                  src={
                    item.featureImage && item.featureImage.filename
                      ? `${config.mediaUrl}/uploads/${item.featureImage.filename}`
                      : "/default-image.jpg"
                  }
                  alt={item.name}
                  width={100}
                />
                <div className="cart-item__content">
                  <div className="item-details">
                    <Link to={`/${formatPermalink(item.name)}`}>
                      <h1>{item.name}</h1>
                    </Link>
                    <span className="cart-item__price">
                      {selectedCurrency} {convertedPrice}
                    </span>
                    <p>In Stock: {item.inStock}</p>
                  </div>
                  <div className="item-actions">
                    {isQuantityTenPlus ? (
                      <div className="cart-item__form">
                        <form onSubmit={(e) => handleSubmit(e, item._id)}>
                          <input
                            type="number"
                            name="quantity"
                            className="cart-item__input"
                            min="1"
                            value={
                              quantityTenPlus[item._id] ??
                              selectedQuantities[item._id] ??
                              1
                            }
                            onChange={(e) =>
                              handleQuantityTenPlusChange(e, item._id)
                            }
                          />

                          <button
                            className="cart-quantity10__btn"
                            type="submit"
                          >
                            Update
                          </button>
                        </form>
                      </div>
                    ) : (
                      <select
                        value={selectedQuantity}
                        className="cart-item__select"
                        onChange={(e) =>
                          handleQuantityChange(item._id, e.target.value)
                        }
                      >
                        {selectedQuantity === 1 ? (
                          <option className="cart-item__qty" value="1">
                            Qty: 1
                          </option>
                        ) : (
                          <option className="cart-item__qty" value="1">
                            1
                          </option>
                        )}
                        {Array.from({ length: 8 }, (_, index) => (
                          <option
                            className="cart-item__qty"
                            key={index + 2}
                            value={index + 2}
                          >
                            {selectedQuantity === index + 2
                              ? `Qty: ${index + 2}`
                              : index + 2}
                          </option>
                        ))}
                        <option
                          className="cart-item__qty cart-item-qty"
                          value="10+"
                        >
                          10+
                        </option>
                      </select>
                    )}

                    <span
                      className="cart-item__span"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </span>
                    <span className="cart-item__span">Save for Later</span>
                    <span className="cart-item__span">Share</span>
                  </div>
                </div>
              </article>
            </section>
          );
        })}
        <span className="cart-item__subTotal">
          Subtotal ({totalItem} {totalItem === 1 ? "item" : "items"}):{" "}
          {selectedCurrency}
          {price}
        </span>
      </section>

      <CartSummary
        totalItem={totalItem}
        price={price}
        selectedCurrency={selectedCurrency}
      />
    </section>
  );
}

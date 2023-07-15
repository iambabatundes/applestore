import React, { useEffect } from "react";
// import Select from "react-select";
import "./styles/cart.css";
import { calculateTotalPrice } from "./utils/utils";

export default function Cart({
  cartItems,
  isLoggedIn,
  selectedQuantities,
  setSelectedQuantities,
  handleSubmit,
  quantityTenPlus,
  setQuantityTenPlus,
  handleDelete,
}) {
  useEffect(() => {
    const storedQuantities = localStorage.getItem("selectedQuantities");
    const storedQuantityTenPlus = localStorage.getItem("quantityTenPlus");

    if (storedQuantities) {
      setSelectedQuantities(JSON.parse(storedQuantities));
    } else {
      const initialQuantities = {};
      cartItems.forEach((item) => {
        initialQuantities[item.id] = 1;
      });
      setSelectedQuantities(initialQuantities);
    }

    if (storedQuantityTenPlus) {
      setQuantityTenPlus(JSON.parse(storedQuantityTenPlus));
    } else {
      const initialQuantityTenPlus = {};
      cartItems.forEach((item) => {
        initialQuantityTenPlus[item.id] = 1; // Set the initial value to false
      });
      setQuantityTenPlus(initialQuantityTenPlus); // Update the state with the initial values
    }
  }, [cartItems, setSelectedQuantities, setQuantityTenPlus]);

  useEffect(() => {
    localStorage.setItem(
      "selectedQuantities",
      JSON.stringify(selectedQuantities)
    );
    localStorage.setItem("quantityTenPlus", JSON.stringify(quantityTenPlus));
  }, [selectedQuantities, quantityTenPlus]);

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity === "10+") {
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: quantity,
      }));
      setQuantityTenPlus((prevQuantityTenPlus) => ({
        ...prevQuantityTenPlus,
        [itemId]: 1,
      }));
    } else {
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: parseInt(quantity) || 1,
      }));
      setQuantityTenPlus((prevQuantityTenPlus) => ({
        ...prevQuantityTenPlus,
        [itemId]: undefined,
      }));
    }
  };

  const handleQuantityTenPlusChange = (e, itemId) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 1 && inputValue <= 9) {
      setQuantityTenPlus((prevQuantityTenPlus) => ({
        ...prevQuantityTenPlus,
        [itemId]: inputValue,
      }));
    } else {
      setQuantityTenPlus((prevQuantityTenPlus) => ({
        ...prevQuantityTenPlus,
        [itemId]: inputValue || 1,
      }));
    }
  };

  const totalItem = Object.values(selectedQuantities).reduce(
    (total, quantity) => {
      if (quantity === "10+") {
        return total + 1;
      }
      return total + parseInt(quantity);
    },
    0
  );

  const price = calculateTotalPrice(
    cartItems,
    selectedQuantities,
    quantityTenPlus
  );

  if (cartItems.length === 0 && !isLoggedIn) {
    return (
      <section className="cart cart-main">
        <section className="cart-right">
          <img src="/apple.png" alt="Apple" width={50} />
          <h2>Your AppleStore Cart is empty</h2>
          <h3>Shop today's deals</h3>

          <button>Login to your account</button>
          <button>Sign up</button>
        </section>

        <section className="cart-left">
          <section className="cart-product">
            <h1>Cart Product</h1>
          </section>
        </section>
      </section>
    );
  }

  if (cartItems.length === 0 && isLoggedIn) {
    return (
      <section className="cart cart-main">
        <section className="cart-right">
          <img src="/apple.png" alt="Apple" width={50} />
          <h2>Your AppleStore Cart is empty</h2>
          <h3>Shop today's deals</h3>
        </section>

        <section className="cart-left">
          <section className="cart-product">
            <h1>Cart Product</h1>
          </section>
        </section>
      </section>
    );
  }

  return (
    <section className="cart cart-main">
      <section className="cart-left">
        <header>Shopping Cart</header>
        <h3>Price</h3>

        {cartItems.map((item) => {
          const selectedQuantity = selectedQuantities[item.id] || 1;
          const isQuantityTenPlus = quantityTenPlus[item.id] !== undefined;

          return (
            <section className="cart-item" key={item.id}>
              <article className="cart-item__main">
                <img src={item.image} alt={item.title} width={100} />
                <div className="cart-item__content">
                  <div className="item-details">
                    <h2>{item.title}</h2>
                    <span className="cart-item__price">${item.price}</span>
                    <p>In Stock: {item.inStock}</p>
                  </div>
                  <div className="item-actions">
                    {isQuantityTenPlus ? (
                      <div className="cart-item__form">
                        <form onSubmit={(e) => handleSubmit(e, item.id)}>
                          <input
                            type="number"
                            className="cart-item__input"
                            min="1"
                            value={quantityTenPlus[item.id] || 1}
                            onChange={(e) =>
                              handleQuantityTenPlusChange(e, item.id)
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
                          handleQuantityChange(item.id, e.target.value)
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
                      onClick={() => handleDelete(item.id)}
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
          Subtotal ({totalItem} {totalItem === 1 ? "item" : "items"}): ${price}
        </span>
      </section>

      <section className="cart-right">
        <div className="cart-subtotal">
          <h2>Your AppleStore Cart</h2>
          <h3>
            Subtotal ({totalItem} {totalItem === 1 ? "item" : "items"}): $
            {price}
          </h3>
          <button>Proceed to checkout</button>
        </div>

        <section className="cart-product">
          <h1>Cart Product</h1>
        </section>
      </section>
    </section>
  );
}

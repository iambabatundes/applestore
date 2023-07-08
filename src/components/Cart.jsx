import React, { useEffect } from "react";
import "./styles/cart.css";
import calculateTotalPrice from "./utils/utils";

export default function Cart({
  cartItems,
  isLoggedIn,
  selectedQuantities,
  setSelectedQuantities,
  handleSubmit,
  quantityTenPlus,
  setQuantityTenPlus,
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
    const quantity = isNaN(inputValue) ? 1 : inputValue;
    setQuantityTenPlus((prevQuantityTenPlus) => ({
      ...prevQuantityTenPlus,
      [itemId]: quantity,
    }));
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
      <section className="cart-right">
        <header>Shopping Cart</header>
        <span>Price</span>

        {cartItems.map((item) => {
          const selectedQuantity = selectedQuantities[item.id] || 1;
          const isQuantityTenPlus = quantityTenPlus[item.id] !== undefined;

          return (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.title} width={100} />
              <div className="item-details">
                <h2>{item.title}</h2>
                <p>Price: {item.price}</p>
                <p>In Stock: {item.inStock}</p>
              </div>
              <div className="item-actions">
                {isQuantityTenPlus ? (
                  <div className="cart-item">
                    <form onSubmit={(e) => handleSubmit(e, item.id)}>
                      <input
                        type="number"
                        min="1"
                        value={quantityTenPlus[item.id] || 1}
                        onChange={(e) =>
                          handleQuantityTenPlusChange(e, item.id)
                        }
                      />
                      <button className="cart-quantity10+__btn" type="submit">
                        Update
                      </button>
                    </form>
                  </div>
                ) : (
                  <select
                    value={selectedQuantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                  >
                    {Array.from({ length: 9 }, (_, index) => (
                      <option key={index} value={index + 1}>
                        Quantity {index + 1}
                      </option>
                    ))}
                    <option value="10+">Quantity 10+</option>
                  </select>
                )}

                <button>Delete</button>
                <button>Save for Later</button>
                <button>Share</button>
              </div>
            </div>
          );
        })}
      </section>

      <section className="cart-left">
        <div className="cart-subtotal">
          <h2>Your AppleStore Cart</h2>
          <h3>
            Subtotal ({totalItem} items): ${price}
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

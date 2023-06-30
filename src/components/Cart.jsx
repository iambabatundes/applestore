import React, { useState, useEffect } from "react";
import "./styles/cart.css";
import calculateTotalPrice from "./utils/utils";

export default function Cart({
  cartItems,
  isLoggedIn,
  selectedQuantities,
  setSelectedQuantities,
}) {
  const [quantityTenPlus, setQuantityTenPlus] = useState(); // State variable for "Quantity 10+"

  useEffect(() => {
    const storedQuantities = () => {
      const storedQuantities = localStorage.getItem("selectedQuantities");
      if (storedQuantities) {
        setSelectedQuantities(JSON.parse(storedQuantities));
      } else {
        const initialQuantities = {};
        cartItems.forEach((item) => {
          initialQuantities[item.id] = 1;
        });
        setSelectedQuantities(initialQuantities);
      }
    };

    storedQuantities();
  }, [cartItems, setSelectedQuantities]);

  useEffect(() => {
    localStorage.setItem(
      "selectedQuantities",
      JSON.stringify(selectedQuantities)
    );
  }, [selectedQuantities]);

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity === "10+") {
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: quantity,
      }));
      setQuantityTenPlus(10); // Set the value of quantityTenPlus to 10 when "Quantity 10+" is selected
    } else {
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: parseInt(quantity) || 1, // Ensure a fallback value of 1 if parsing fails
      }));
      setQuantityTenPlus(undefined); // Reset the value of quantityTenPlus when a specific quantity is selected
    }
  };

  const handleQuantityTenPlusChange = (e) => {
    const inputValue = parseInt(e.target.value);
    setQuantityTenPlus(isNaN(inputValue) ? undefined : inputValue); // Update the value for "Quantity 10+"
  };

  const totalItem = Object.values(selectedQuantities).reduce(
    (total, quantity) => {
      if (quantity === "10+") {
        return total + 1; // Increment count by 1 for "Quantity 10+"
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

          return (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.title} width={100} />
              <div className="item-details">
                <h2>{item.title}</h2>
                <p>Price: {item.price}</p>
                <p>In Stock: {item.inStock}</p>
              </div>
              <div className="item-actions">
                {selectedQuantity === "10+" ? (
                  <div className="cart-item">
                    <form>
                      <input
                        type="number"
                        min="1"
                        value={quantityTenPlus || 1}
                        onChange={handleQuantityTenPlusChange}
                      />
                      <button
                        className="cart-quantity10+__btn"
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            quantityTenPlus !== ""
                              ? quantityTenPlus.toString()
                              : "" // Handle the case where the input is empty
                          )
                        }
                      >
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

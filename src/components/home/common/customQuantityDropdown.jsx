import React, { useState } from "react";

const CustomQuantityDropdown = ({ availableQuantity }) => {
  const [quantity, setQuantity] = useState(1); // Default quantity
  const [showInput, setShowInput] = useState(false);
  const [inputQuantity, setInputQuantity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const maxDisplayQuantity = availableQuantity > 10 ? 10 : availableQuantity;

  const handleQuantityChange = (value) => {
    if (value === "10+") {
      setShowInput(true);
    } else {
      setShowInput(false);
      setQuantity(value);
      setErrorMessage("");
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const customQuantity = parseInt(inputQuantity, 10);
    if (customQuantity > availableQuantity) {
      setErrorMessage(`Only ${availableQuantity} items are available.`);
    } else {
      setQuantity(customQuantity);
      setShowInput(false);
      setErrorMessage("");
    }
  };

  return (
    <div className="custom-quantity-dropdown">
      <label htmlFor="quantity">Quantity:</label>
      <div className="dropdown-wrapper">
        <select
          id="quantity"
          value={quantity > 10 ? "10+" : quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
        >
          {[...Array(maxDisplayQuantity)].map((_, index) => (
            <option key={index} value={index + 1}>
              {`Quantity ${index + 1}`}
            </option>
          ))}
          {availableQuantity > 10 && <option value="10+">10+</option>}
        </select>

        {showInput && (
          <form onSubmit={handleInputSubmit} className="custom-quantity-input">
            <input
              type="number"
              value={inputQuantity}
              onChange={(e) => setInputQuantity(e.target.value)}
              placeholder="Enter quantity"
              min="21"
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default CustomQuantityDropdown;

import React, { useState } from "react";
import "../styles/shippingDetails.css";
import Details from "./details";

export default function ShippingDetails() {
  // Mock data
  const shippingCost = "$51.94";
  const deliveryDateRange = "September 23 - October 4";
  const fastestDeliveryDate = "Monday, September 16";
  const location = "Nigeria";
  const stockStatus = "In Stock";
  const price = "$39.99";
  const listPrice = "$59.99";

  // Mock available quantity for the product
  const availableQuantity = 5;

  // State to manage the selected quantity and whether to show the input field
  const [quantity, setQuantity] = useState(1);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCustomQuantity, setIsCustomQuantity] = useState(false);
  const [customQuantity, setCustomQuantity] = useState(10);

  const handleQuantityChange = (value) => {
    if (value > availableQuantity) {
      alert(`Only ${availableQuantity} units are available.`);
      setQuantity(availableQuantity);
    } else {
      setQuantity(value);
    }
    setIsCustomQuantity(false);
    setDropdownOpen(false); // Close dropdown after selection
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleCustomQuantityClick = () => {
    setIsCustomQuantity(true);
    setDropdownOpen(false); // Close dropdown when input is shown
  };

  const handleCustomQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setCustomQuantity(value);
  };

  const handleCustomQuantitySubmit = () => {
    if (customQuantity > availableQuantity) {
      alert(`Only ${availableQuantity} units are available.`);
      setQuantity(availableQuantity);
    } else {
      setQuantity(customQuantity);
    }
    setIsCustomQuantity(false);
  };

  return (
    <section className="shippingDetails__main">
      <div className="shipping__location">
        <span className="">Deliver to</span>
        <span>{location}</span>
      </div>

      <div className="shippingDetails__container">
        <div className="shippingDetails__price">
          <span className="shippingDetails__price--discount">-33%</span>
          <span className="shippingDetails__price--current">{price}</span>
          <span className="shippingDetails__price--list">
            List Price: {listPrice}
          </span>
        </div>

        <div className="shippingDetails__fees">
          <span>
            {shippingCost} Shipping & Import Fees Deposit to {location}
          </span>
          <a href="/" className="shippingDetails__detailsLink">
            Details
          </a>
        </div>

        <div className="shippingDetails__info">
          <i
            className="fa fa-exclamation-circle shippingDetails__infoIcon"
            aria-hidden="true"
          ></i>
          <span>Sales taxes may apply at checkout</span>
        </div>

        <div className="shippingDetails__delivery">
          <span>Delivery {deliveryDateRange}</span>
        </div>
        <div className="shippingDetails__fastestDelivery">
          <span>
            Or fastest delivery <strong>{fastestDeliveryDate}</strong>. Order
            within <strong>12 hrs 50 mins</strong>
          </span>
        </div>
        <div className="shippingDetails__location">
          <span>Deliver to</span>
          <span className="shippingDetails__locationName">{location}</span>
        </div>
        <div
          className={`shippingDetails__stock ${
            stockStatus === "In Stock" ? "inStock" : "outOfStock"
          }`}
        >
          <span>{stockStatus}</span>
        </div>

        {/* Quantity Selector */}
        <div className="shippingDetails__quantity">
          <div className="customDropdown">
            {!isCustomQuantity ? (
              <button
                onClick={toggleDropdown}
                className="customDropdown__button"
              >
                {`Quantity: ${quantity > 10 ? quantity : quantity}`}
                <i className="fa fa-chevron-down customDropdown__arrow"></i>
              </button>
            ) : (
              <div className="customQuantityInput">
                <input
                  type="number"
                  value={customQuantity}
                  onChange={handleCustomQuantityChange}
                  min="1"
                  max={availableQuantity}
                />
                <button onClick={handleCustomQuantitySubmit}>Submit</button>
              </div>
            )}

            {isDropdownOpen && (
              <ul className="customDropdown__list">
                {[...Array(Math.min(availableQuantity, 9))].map((_, index) => (
                  <li
                    key={index}
                    onClick={() => handleQuantityChange(index + 1)}
                    className={`customDropdown__item ${
                      quantity === index + 1 ? "selected" : ""
                    }`}
                  >
                    {index + 1}
                  </li>
                ))}
                {availableQuantity > 10 && (
                  <li
                    onClick={handleCustomQuantityClick}
                    className="customDropdown__item"
                  >
                    10+
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart and Buy Now Buttons */}
      <div className="shippingDetails__actions">
        <button className="shippingDetails__addToCart">Add to Cart</button>
        <button className="shippingDetails__buyNow">Buy Now</button>
      </div>

      <Details />
    </section>
  );
}

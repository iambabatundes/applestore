import React, { useState } from "react";
import "./styles/checkout.css";

export default function Checkout() {
  const [hasAddress, setHasAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
  };

  return (
    <section className="checkout-main">
      <div>
        <div className="address-main">
          <span>1</span>
          <h1>
            {hasAddress
              ? "Choose a shipping address"
              : "Enter a new shipping address"}
          </h1>
          {hasAddress ? (
            <div className="address-selection">
              <label>
                <input
                  type="radio"
                  value="address1"
                  checked={selectedAddress === "address1"}
                  onChange={() => handleAddressChange("address1")}
                />
                Address 1
              </label>
              <label>
                <input
                  type="radio"
                  value="address2"
                  checked={selectedAddress === "address2"}
                  onChange={() => handleAddressChange("address2")}
                />
                Address 2
              </label>
              {/* Add more address options here */}
            </div>
          ) : (
            <div className="address-form">
              {/* Implement your new address form here */}
              <form>{/* Form fields for new address */}</form>
            </div>
          )}
        </div>
        <div className="address-main">
          <span>2</span>
          <h1>Payment Method</h1>
        </div>
        <div className="address-main">
          <span>3</span>
          <h1>Items and Shipping</h1>
        </div>
      </div>
      <article>
        <h2>this is the price page</h2>
      </article>
    </section>
  );
}

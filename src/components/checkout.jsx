import React, { useState } from "react";
import "./styles/checkout.css";
// import Countr from "country-list";
import Select from "react-select";
import { Country } from "country-state-city";
import { AddressSchema } from "../components/checkout/utils/validation";
import EditAddress from "./checkout/editAddress";
import AddNewAddress from "./checkout/addNewAddress";
import AddAddress from "./checkout/addAddress";

export default function Checkout() {
  const [step, setStep] = useState(1); // Initialize with step 1
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [autofillError, setAutofillError] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(
    JSON.parse(localStorage.getItem("defaultAddress")) || null
  ); // Initialize with the default address from localStorage
  const [formattedAddress, setFormattedAddress] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddNewAddress = () => {
    // setAddNewAddress(address);
    // setSelectedAddress(null);
    setIsAddModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const handleUpdateAddress = (newAddress) => {
    const updatedAddress = { ...selectedAddress, ...newAddress };
    setSelectedAddress(updatedAddress);

    // Close the modal
    setIsEditModalOpen(false);
  };

  const handleEditAddressClose = () => {
    setIsEditModalOpen(false);
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setStep(3); // Move to step 3 after selecting payment method
  };

  const handleAutofill = async (setFieldValue) => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();

        const address = data.display_name;
        const country = data.address.country;
        const state = data.address.state;
        const city = data.address.city;
        const zipCode = data.address.postcode;

        setFieldValue("country", country);
        setFieldValue("state", state);
        setFieldValue("city", city);
        setFieldValue("address", address);
        setFieldValue("zipCode", zipCode);

        setAutofillError(null);
      } catch (error) {
        console.log("Error fetching or processing location data:", error);
        setAutofillError("Error fetching or processing location data.");
      }
    } else {
      setAutofillError(
        "Geolocation is not supported by your browser. Please fill in the fields manually."
      );
    }
  };

  const handleAddressChange = (address) => {
    // Format the selected address
    const formatted = `${address.fullName} ${address.address}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`;

    // Save the selected address to localStorage
    localStorage.setItem("selectedAddress", JSON.stringify(address));

    setSelectedAddress(address);
    setFormattedAddress(formatted); // Update the formatted address
    setStep(2); // Move to step 2 after selecting address
  };

  const handleChangeAddress = () => {
    setIsAddModalOpen(false);
    // setAddNewAddress(null);

    setStep(1);
  };

  return (
    <section className="checkout-main">
      <div className="steps-container">
        <div className={`checkout-step ${step === 1 ? "active" : ""}`}>
          <article className="address-main">
            <div className="address__title">
              <span className="checkout-number">1</span>
              <h1 className="checkout-heading">
                {selectedAddress
                  ? "Shipping Address"
                  : defaultAddress
                  ? "Choose a shipping address"
                  : "Enter a new shipping address"}
              </h1>
            </div>
            {selectedAddress && step !== 1 && (
              <div className="address__selected">
                <ul>
                  <li>{selectedAddress.fullName}</li>
                  <li>
                    {selectedAddress.address} {selectedAddress.city},
                    {selectedAddress.state}, {selectedAddress.country}
                  </li>
                </ul>
                {/* <span>{formattedAddress}</span> */}
              </div>
            )}

            {selectedAddress && step !== 1 && (
              <div className="address-change">
                <span onClick={handleChangeAddress}>Change Address</span>
              </div>
            )}
          </article>
          {step === 1 && (
            <div className="address-content">
              {defaultAddress ? (
                <div className="address-selected">
                  <label>
                    <input
                      type="radio"
                      value="address"
                      checked={defaultAddress.formattedAddress}
                      onChange={() => handleAddressChange("address")}
                    />
                    {defaultAddress.formattedAddress}
                  </label>
                  {/* <p>Selected Address: {selectedAddress}</p> */}

                  <button onClick={() => setStep(2)}>Use this address</button>
                </div>
              ) : selectedAddress ? (
                <div className="address-selected">
                  <h1>Your Address</h1>
                  <section className="address__selection">
                    <label>
                      <input
                        type="radio"
                        value="address1"
                        checked={selectedAddress.address}
                        onChange={() => handleAddressChange("address1")}
                      />
                    </label>
                    <div>
                      <span style={{ fontWeight: 600, paddingRight: 5 }}>
                        {selectedAddress.fullName}
                      </span>
                      {selectedAddress.address} {selectedAddress.city},{" "}
                      {selectedAddress.state}, {selectedAddress.zipCode},{" "}
                      {selectedAddress.country}
                      <span
                        className="address__edit"
                        onClick={() => handleEditAddress(selectedAddress)}
                      >
                        Edit address
                      </span>
                    </div>

                    <EditAddress
                      AddressSchema={AddressSchema}
                      editingAddress={editingAddress}
                      isEditModalOpen={isEditModalOpen}
                      onClose={handleEditAddressClose}
                      setIsEditModalOpen={setIsEditModalOpen}
                      autofillError={autofillError}
                      handleAutofill={handleAutofill}
                      onUpdateAddress={handleUpdateAddress}
                    />
                  </section>

                  <div>
                    <span className="address-new" onClick={handleAddNewAddress}>
                      <i className="fa fa-plus" aria-hidden="true"></i>
                      Add new address
                    </span>

                    <AddNewAddress
                      AddressSchema={AddressSchema}
                      autofillError={autofillError}
                      handleAutofill={handleAutofill}
                      handleAddressChange={handleAddressChange}
                      isAddModalOpen={isAddModalOpen}
                      setIsAddModalOpen={setIsAddModalOpen}
                      setStep={setStep}
                    />
                  </div>

                  <button className="address-btn" onClick={() => setStep(2)}>
                    Use this address
                  </button>
                </div>
              ) : (
                <AddAddress
                  autofillError={autofillError}
                  handleAddressChange={handleAddressChange}
                  handleAutofill={handleAutofill}
                  setStep={setStep}
                />
              )}
            </div>
          )}
        </div>
        <div className={`checkout-step ${step === 2 ? "active" : ""}`}>
          <article className="address-main">
            <span className="checkout-number">2</span>
            <h1 className="checkout-heading">Payment Method</h1>
          </article>
          {step === 2 && (
            <div className="payment-content">
              {/* Implement payment method selection */}
              <label>
                <input
                  type="radio"
                  value="creditCard"
                  checked={selectedPaymentMethod === "creditCard"}
                  onChange={() => handlePaymentMethodChange("creditCard")}
                />
                Credit Card
              </label>
              {/* ... */}
              <button onClick={() => setStep(3)}>
                Use this payment method
              </button>
            </div>
          )}
        </div>
        <div className={`checkout-step ${step === 3 ? "active" : ""}`}>
          <article className="address-main">
            <span className="checkout-number">3</span>
            <h1 className="checkout-heading">Items and Shipping</h1>
          </article>
          {step === 3 && (
            <div className="items-and-shipping-content">
              {/* Implement items and shipping details */}
              {/* ... */}
            </div>
          )}
        </div>
      </div>
      <article>
        <h2>This is the price page</h2>
      </article>
    </section>
  );
}

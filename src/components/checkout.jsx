import React, { useState, useEffect } from "react";
import "./styles/checkout.css";
import { AddressSchema } from "../components/checkout/utils/validation";
import EditAddress from "./checkout/editAddress";
import AddNewAddress from "./checkout/addNewAddress";
import AddAddress from "./checkout/addAddress";

export default function Checkout() {
  const [addresses, setAddresses] = useState([]);
  const [step, setStep] = useState(1); // Initialize with step 1
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [autofillError, setAutofillError] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(
    JSON.parse(localStorage.getItem("defaultAddress")) || null
  ); // Initialize with the default address from localStorage
  const [formattedAddress, setFormattedAddress] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // const handleAutofill = async (setFieldValue) => {
  //   setLoading(true);
  //   setAutofillError(""); // Clear previous error

  //   if ("geolocation" in navigator) {
  //     try {
  //       const position = await new Promise((resolve, reject) => {
  //         navigator.geolocation.getCurrentPosition(resolve, reject);
  //       });

  //       const { latitude, longitude } = position.coords;

  //       const response = await fetch(
  //         `https://api.ipgeolocation.io/ipgeo?apiKey=74d7025b99284e5ab87ede8a6b623e9b&lat=${latitude}&long=${longitude}`
  //       );
  //       const data = await response.json();

  //       const address = data.display_name;
  //       const country = data.address.country;
  //       const state = data.address.state;
  //       const city = data.address.city;
  //       const zipCode = data.address.postcode;

  //       setFieldValue("country", country);
  //       setFieldValue("state", state);
  //       setFieldValue("city", city);
  //       setFieldValue("address", address);
  //       setFieldValue("zipCode", zipCode);

  //       setAutofillError(null);
  //     } catch (error) {
  //       console.log("Error fetching or processing location data:", error);
  //       setAutofillError("Error fetching or processing location data.");
  //     }
  //   } else {
  //     setAutofillError(
  //       "Geolocation is not supported by your browser. Please fill in the fields manually."
  //     );
  //   }
  // };

  const handleAutofill = async (setFieldValue) => {
    setLoading(true);
    setAutofillError(""); // Clear previous error

    try {
      const response = await fetch(
        "https://api.ipgeolocation.io/ipgeo?apiKey=74d7025b99284e5ab87ede8a6b623e9b"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data.");
      }

      const data = await response.json();

      const address = {
        country: data.country_name || "",
        fullName: "",
        phoneNumber: "",
        address: data.address || "",
        city: data.city || "",
        state: data.state_prov || "",
        zipCode: data.zipcode || "",
        makeDefault: false,
      };

      Object.entries(address).forEach(([key, value]) => {
        setFieldValue(key, value);
      });
    } catch (error) {
      setAutofillError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewAddress = () => {
    setIsAddModalOpen(true);
  };

  const handleUpdateAddresss = (updatedAddress) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === updatedAddress.id ? updatedAddress : address
    );

    setAddresses(updatedAddresses);
    setSelectedAddress(updatedAddress); // Update selectedAddress if needed
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    setIsEditModalOpen(false);
  };

  const handleUpdateAddress = (updatedAddress) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === updatedAddress.id ? updatedAddress : address
    );

    setAddresses(updatedAddresses);
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));

    // Check if the updated address is the same as the selected address
    if (selectedAddress && selectedAddress.id === updatedAddress.id) {
      setSelectedAddress(updatedAddress);
    }

    setIsEditModalOpen(false);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const handleEditAddressClose = () => {
    setIsEditModalOpen(false);
  };

  const handleNewAddressAdded = (newAddress) => {
    const newId = Date.now();
    const addNewAddress = [...addresses, { ...newAddress, id: newId }];

    // Set the newly added address as the selected address
    setSelectedAddress({ ...newAddress, id: newId });

    setAddresses(addNewAddress);
    localStorage.setItem("addresses", JSON.stringify(addNewAddress));

    setStep(2); // Move to step 2 after selecting the new address
    setIsAddModalOpen(false); // Close the modal
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setStep(3); // Move to step 3 after selecting payment method
  };

  const handleAddressChange = (address) => {
    // Save the selected address to localStorage
    localStorage.setItem("selectedAddress", JSON.stringify(address));

    setSelectedAddress(address);
    setStep(2); // Move to step 2 after selecting address
  };

  const handleChangeAddress = () => {
    setIsAddModalOpen(false);
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
                      value={defaultAddress}
                      checked={defaultAddress.formattedAddress}
                      onChange={() => setSelectedAddress(defaultAddress)}
                    />
                    {defaultAddress.formattedAddress}
                  </label>

                  <button onClick={() => setStep(2)}>Use this address</button>
                </div>
              ) : selectedAddress ? (
                <div className="address-selected">
                  <h1>Your Addresses</h1>
                  <section className="address__selection">
                    {addresses.map((address) => (
                      <div key={address.id} className="address-item">
                        <label>
                          <input
                            type="radio"
                            // defaultChecked={address.id}
                            value={address.id}
                            checked={
                              selectedAddress &&
                              selectedAddress.id === address.id
                            }
                            onChange={() => handleAddressChange(address)}
                          />
                        </label>
                        <div>
                          <ul className="selectedAddresses">
                            <li>{address.fullName}</li>
                            <li>
                              {address.address} {address.city}
                              {address.state} {address.country}
                            </li>
                          </ul>

                          <span
                            className="checkout-address__btn"
                            onClick={() => handleEditAddress(address)}
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
                      </div>
                    ))}
                  </section>

                  <div>
                    <span className="address-new" onClick={handleAddNewAddress}>
                      <i className="fa fa-plus" aria-hidden="true"></i>
                      Add new address
                    </span>

                    <AddNewAddress
                      AddressSchema={AddressSchema}
                      autofillError={autofillError}
                      // handleAutofill={handleAutofill}
                      // handleAddressChange={handleAddressChange}
                      isAddModalOpen={isAddModalOpen}
                      setIsAddModalOpen={setIsAddModalOpen}
                      setStep={setStep}
                      onNewAddressAdded={handleNewAddressAdded}
                      handleAutofill={(setFieldValue) =>
                        handleAutofill(setFieldValue)
                      }
                    />
                  </div>

                  <span className="address-new" onClick={() => setStep(2)}>
                    Use this address
                  </span>
                </div>
              ) : (
                <AddAddress
                  autofillError={autofillError}
                  // handleAutofill={(setFieldValue) =>
                  //   handleAutofill(setFieldValue)
                  // }
                  // handleAddressChange={handleNewAddressAdded}
                  handleAutofill={handleAutofill}
                  setStep={setStep}
                  onNewAddressAdded={handleNewAddressAdded}
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

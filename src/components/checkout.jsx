import React, { useState } from "react";
import "./styles/checkout.css";
// import Countr from "country-list";
import Select from "react-select";
import { Country } from "country-state-city";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AddressSchema } from "../components/checkout/utils/validation";
import EditAddress from "./checkout/editAddress";

export default function Checkout() {
  const [step, setStep] = useState(1); // Initialize with step 1
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [autofillError, setAutofillError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [defaultAddress, setDefaultAddress] = useState(
    JSON.parse(localStorage.getItem("defaultAddress")) || null
  ); // Initialize with the default address from localStorage
  const [formattedAddress, setFormattedAddress] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
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
                <span onClick={() => setStep(1)}>Change Address</span>
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
                    />
                  </section>

                  <div>
                    <span className="address-new">
                      <i class="fa fa-plus" aria-hidden="true"></i>
                      Add new address
                    </span>
                  </div>

                  <button className="address-btn" onClick={() => setStep(2)}>
                    Use this address
                  </button>
                </div>
              ) : (
                <div className="address-form">
                  {/* Implement your new address form here */}
                  <h1>Add a new address</h1>
                  <span className="address-save">
                    Save time. Autofill your current location.
                    <button type="button" onClick={handleAutofill}>
                      Autofill
                    </button>
                  </span>
                  {autofillError && (
                    <div className="error-message">
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                      {autofillError}
                    </div>
                  )}
                  <Formik
                    initialValues={{
                      country: "",
                      fullName: "",
                      phoneNumber: "",
                      address: "",
                      city: "",
                      state: "",
                      zipCode: "",
                      makeDefault: false,
                    }}
                    validationSchema={AddressSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                      handleAddressChange(values);
                      setStep(2); // Move to step 2 after selecting address
                      setSubmitting(false);
                    }}
                  >
                    {({ isSubmitting, setFieldValue }) => (
                      <Form>
                        <div className="checkout-address">
                          <label htmlFor="country">Country/Region</label>
                          <Field name="country">
                            {({ field, meta }) => (
                              <div>
                                <input
                                  className={`address__country ${
                                    meta.touched && meta.error
                                      ? "active-input"
                                      : ""
                                  }`}
                                  {...field}
                                  type="country"
                                  id="country"
                                  name="country"
                                />
                                <ErrorMessage name="country" component="div" />
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="checkout-form">
                          <label htmlFor="fullName">
                            Full name (First and Last name)
                          </label>
                          <Field name="fullName">
                            {({ field, meta }) => (
                              <div>
                                <input
                                  className={`${
                                    meta.touched && meta.error
                                      ? "error-input"
                                      : "active-input"
                                  }`}
                                  type="text"
                                  id="fullName"
                                  name="fullName"
                                  {...field}
                                />
                                <ErrorMessage name="fullName" component="div" />
                              </div>
                            )}
                          </Field>
                        </div>

                        <div className="checkout-form">
                          <label htmlFor="phoneNumber">Phone Number</label>
                          <Field name="phoneNumber">
                            {({ field, meta }) => (
                              <div className="phoneNumber">
                                <input
                                  className={`${
                                    meta.touched && meta.error
                                      ? "error-input"
                                      : "active-input"
                                  }`}
                                  type="text"
                                  id="phoneNumber"
                                  name="phoneNumber"
                                  {...field}
                                />
                                <span className="phoneNumber-tooltip">
                                  May be used to assist delivery
                                </span>
                                <ErrorMessage
                                  name="phoneNumber"
                                  component="div"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="checkout-form">
                          <label htmlFor="address">Address</label>
                          <Field name="address">
                            {({ field, meta }) => (
                              <div className="address-input">
                                <input
                                  className={`${
                                    meta.touched && meta.error
                                      ? "error-input"
                                      : "active-input"
                                  }`}
                                  type="text"
                                  id="address"
                                  name="address"
                                  placeholder="Street Address, P.O. Box or company name, c/o"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e); // This line is necessary for Formik's handleChange to work
                                    handleAutofill(setFieldValue); // Call handleAutofill and pass the setFieldValue function
                                  }}
                                />
                                <ErrorMessage name="address" component="div" />
                                <input
                                  type="text"
                                  id="adress"
                                  name="adress"
                                  placeholder="Apt, suite, unit, building, floor, etc."
                                />
                              </div>
                            )}
                          </Field>
                        </div>

                        {/* State */}
                        <div className="checkout-form">
                          <label htmlFor="state">
                            State / Province / Region
                          </label>
                          <Field name="state">
                            {({ field, meta }) => (
                              <div>
                                {/* <label htmlFor="state">State</label> */}
                                <input
                                  className={`${
                                    meta.touched && meta.error
                                      ? "error-input"
                                      : "active-input"
                                  }`}
                                  type="text"
                                  id="state"
                                  name="state"
                                  {...field}
                                  // onChange={(e) => {
                                  //   field.onChange(e); // This line is necessary for Formik's handleChange to work
                                  //   handleAutofill(setFieldValue); // Call handleAutofill and pass the setFieldValue function
                                  // }}
                                />
                                <ErrorMessage name="state" component="div" />
                              </div>
                            )}
                          </Field>
                        </div>
                        {/* City */}
                        <div className="checkout-form">
                          <label htmlFor="city">City</label>
                          <Field name="city">
                            {({ field, meta }) => (
                              <div>
                                {/* <label htmlFor="city">City</label> */}
                                <input
                                  className={`${
                                    meta.touched && meta.error
                                      ? "error-input"
                                      : "active-input"
                                  }`}
                                  type="text"
                                  id="city"
                                  name="city"
                                  {...field}
                                  // onChange={(e) => {
                                  //   field.onChange(e); // This line is necessary for Formik's handleChange to work
                                  //   handleAutofill(setFieldValue); // Call handleAutofill and pass the setFieldValue function
                                  // }}
                                />
                                <ErrorMessage name="city" component="div" />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div className="checkout-form">
                          <label htmlFor="city">Zip Code</label>
                          <Field name="zipCode">
                            {({ field, meta }) => (
                              <div>
                                {/* <label htmlFor="city">City</label> */}
                                <input
                                  className={`${
                                    meta.touched && meta.error
                                      ? "error-input"
                                      : "active-input"
                                  }`}
                                  type="text"
                                  id="zipCode"
                                  name="zipCode"
                                  {...field}
                                  // onChange={(e) => {
                                  //   field.onChange(e); // This line is necessary for Formik's handleChange to work
                                  //   handleAutofill(setFieldValue("zipCode")); // Call handleAutofill and pass the setFieldValue function
                                  // }}
                                />
                                <ErrorMessage name="zipCode" component="div" />
                              </div>
                            )}
                          </Field>
                        </div>
                        {/* Add more fields here */}

                        <div className="makeDefault-main">
                          <input
                            id="makeDefault"
                            className="makeDefault"
                            type="checkbox"
                            name="makeDefault"
                          />
                          <label htmlFor="makeDefault">
                            Make this my default address
                          </label>
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                          Use this address
                        </button>
                      </Form>
                    )}
                  </Formik>
                  {/* ... */}
                </div>
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

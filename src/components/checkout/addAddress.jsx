import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AddressSchema } from "./utils/validation";
import AutoFillForm from "./autoFillForm";
import "../../components/styles/checkout.css";
import Button from "../common/button";

export default function AddAddress({
  autofillError,
  handleAutofill,
  //   AddressSchema,
  handleAddressChange,
  setStep,
}) {
  return (
    <section>
      <div className="address-form">
        <h1>Add a new address</h1>
        {/* Implement your new address form here */}
        <AutoFillForm
          autofillError={autofillError}
          handleAutofill={handleAutofill}
        />

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
                    <div className="checkout-add__address">
                      <input
                        className={` ${
                          meta.touched && meta.error ? "active-input" : ""
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
                    <div className="checkout-add__address">
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
                    <div className="checkout-add__address phoneNumber">
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
                      <ErrorMessage name="phoneNumber" component="div" />
                    </div>
                  )}
                </Field>
              </div>
              <div className="checkout-form">
                <label htmlFor="address">Address</label>
                <Field name="address">
                  {({ field, meta }) => (
                    <div className="checkout-add__address address-input">
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
                <label htmlFor="state">State / Province / Region</label>
                <Field name="state">
                  {({ field, meta }) => (
                    <div className="checkout-add__address">
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
                        onChange={(e) => {
                          field.onChange(e); // This line is necessary for Formik's handleChange to work
                          handleAutofill(setFieldValue); // Call handleAutofill and pass the setFieldValue function
                        }}
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
                    <div className="checkout-add__address">
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
                        onChange={(e) => {
                          field.onChange(e); // This line is necessary for Formik's handleChange to work
                          handleAutofill(setFieldValue, e); // Pass setFieldValue and the event to handleAutofill
                        }}
                      />
                      <ErrorMessage name="city" component="div" />
                    </div>
                  )}
                </Field>
              </div>
              <div className="checkout-form">
                <label htmlFor="zipCode">Zip Code</label>
                <Field name="zipCode">
                  {({ field, meta }) => (
                    <div className="checkout-add__address">
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
                        onChange={(e) => {
                          field.onChange(e); // This line is necessary for Formik's handleChange to work
                          handleAutofill(setFieldValue()); // Call handleAutofill and pass the setFieldValue function
                        }}
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

              <Button
                className="addAddress-btn"
                type="submit"
                disabled={isSubmitting}
              >
                Use this address
              </Button>
            </Form>
          )}
        </Formik>
        {/* ... */}
      </div>
    </section>
  );
}

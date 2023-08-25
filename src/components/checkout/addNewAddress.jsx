import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import AutoFillForm from "./autoFillForm";
import Icon from "../icon";
import Button from "../common/button";

export default function AddNewAddress({
  AddressSchema,
  setIsAddModalOpen,
  isAddModalOpen,
  handleAutofill,
  autofillError,
  handleAddressChange,
  setStep,
  onNewAddressAdded,
}) {
  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  return (
    <section>
      {isAddModalOpen && (
        <section className="editAddress-modal" onClick={handleFormClick}>
          <div className="editAddress-container">
            <article className="editAddress-cancel">
              <h2>Add a new shipping address</h2>
              <Icon
                cancel
                className="editAddress-icon"
                onClick={() => setIsAddModalOpen(false)}
              />
            </article>
            <div className="editAddress-content">
              <div>
                <h2>Add a new address</h2>
                <AutoFillForm
                  handleAutofill={handleAutofill}
                  autofillError={autofillError}
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
                  onSubmit={onNewAddressAdded}
                >
                  {({ isSubmitting, setFieldValue }) => (
                    <Form>
                      <div className="editAddress-address">
                        <label htmlFor="country">Country/Region</label>
                        <Field name="country">
                          {({ field, meta }) => (
                            <div className="editAddress">
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

                      <div className="editAddress-form">
                        <label htmlFor="fullName">
                          Full name (First and Last name)
                        </label>
                        <Field name="fullName">
                          {({ field, meta }) => (
                            <div className="editAddress">
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

                      <div className="editAddress-form">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <Field name="phoneNumber">
                          {({ field, meta }) => (
                            <div className="editAddress">
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
                      <div className="editAddress-form">
                        <label htmlFor="address">Address</label>
                        <Field name="address">
                          {({ field, meta }) => (
                            <div className="editAddress">
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
                              />
                              <ErrorMessage name="address" component="div" />
                              <input
                                className="address-input"
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
                      <div className="editAddress-form">
                        <label htmlFor="state">State / Province / Region</label>
                        <Field name="state">
                          {({ field, meta }) => (
                            <div className="editAddress">
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
                              />
                              <ErrorMessage name="state" component="div" />
                            </div>
                          )}
                        </Field>
                      </div>
                      {/* City */}
                      <div className="editAddress-form">
                        <label htmlFor="city">City</label>
                        <Field name="city">
                          {({ field, meta }) => (
                            <div className="editAddress">
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
                      <div className="editAddress-form">
                        <label htmlFor="city">Zip Code</label>
                        <Field name="zipCode">
                          {({ field, meta }) => (
                            <div className="editAddress">
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

                      <div className="editMakeDefault">
                        <input
                          id="makeDefault"
                          className="editMakeDefault"
                          type="checkbox"
                          name="makeDefault"
                        />
                        <label htmlFor="makeDefault">
                          Make this my default address
                        </label>
                      </div>

                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        className="editAddress-btn"
                      >
                        Use this address
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

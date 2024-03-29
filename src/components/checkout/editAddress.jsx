import React from "react";
import Icon from "../icon";
import "./style/editAddress.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import AutoFillForm from "./autoFillForm";
import Button from "../common/button";

export default function EditAddress({
  editingAddress,
  AddressSchema,
  setIsEditModalOpen,
  isEditModalOpen,
  handleAutofill,
  autofillError,
  onUpdateAddress,
}) {
  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      {isEditModalOpen && (
        <section className="editAddress-modal" onClick={handleFormClick}>
          <div className="editAddress-container">
            <article className="editAddress-cancel">
              <h2>Update your shipping address</h2>
              <Icon
                cancel
                className="editAddress-icon"
                onClick={() => setIsEditModalOpen(false)}
              />
            </article>
            <div className="editAddress-content">
              <div>
                <h2>Edit your Address</h2>
                <AutoFillForm
                  handleAutofill={handleAutofill}
                  autofillError={autofillError}
                />
                <Formik
                  initialValues={{
                    // Pre-fill the form with the editingAddress details
                    country: editingAddress.country,
                    fullName: editingAddress.fullName,
                    address: editingAddress.address,
                    city: editingAddress.city,
                    phoneNumber: editingAddress.phoneNumber,
                    state: editingAddress.state,
                    zipCode: editingAddress.zipCode,
                    makeDefault: editingAddress.makeDefault,
                    // ...other fields...
                  }}
                  validationSchema={AddressSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    // Handle address update logic
                    onUpdateAddress(values);
                    setIsEditModalOpen(false); // Close the modal after submission
                    setSubmitting(false);
                  }}
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
                                // onChange={(e) => {
                                //   field.onChange(e); // This line is necessary for Formik's handleChange to work
                                //   handleAutofill(setFieldValue); // Call handleAutofill and pass the setFieldValue function
                                // }}
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
                        className="editAddress-btn"
                        // type="button"
                        disabled={isSubmitting}
                      >
                        Update Address
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AddressSchema } from "./utils/validation";
import AutoFillForm from "./autoFillForm";
import "../../components/styles/checkout.css";
import Button from "../common/button";
import InputForm from "../common/inputForm";
import InputText from "../common/inputText";
import InputField from "../common/inputField";

export default function AddAddress({
  autofillError,
  handleAutofill,
  // handleAddressChange,
  onNewAddressAdded,
  setStep,
}) {
  return (
    <section>
      <div className="address-form">
        <h1>Add a shipping address</h1>
        {/* Implement your new address form here */}
        <AutoFillForm
          autofillError={autofillError}
          handleAutofill={handleAutofill}
        />

        <InputForm
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
            onNewAddressAdded(values);
            setStep(2); // Move to step 2 after selecting address
            setSubmitting(false);
          }}
        >
          {(values, isSubmitting, setFieldValue) => (
            <>
              <InputText
                name="country"
                labelTitle="Country/Region"
                className="checkout-address"
              />
              <InputField name="country" type="country" />
              <ErrorMessage name="country" />

              <InputText
                name="fullName"
                labelTitle="Full name (First and Last name)"
                className="checkout-address"
              />
              <InputField name="fullName" type="text" />

              <InputText
                name="phoneNumber"
                labelTitle="Phone Number"
                className="checkout-address"
              />
              <InputField
                name="phoneNumber"
                tooltip
                tooltipTitle="May be used to assist delivery"
                type="number"
                className="phoneNumbers"
              />

              <InputText
                name="address"
                labelTitle="Address"
                className="checkout-address"
              />
              <InputField
                name="address"
                placeholder="Street Address, P.O. Box or company name, c/o"
                input
                type="text"
                className="address__field"
              />

              <InputText
                name="state"
                labelTitle="State / Province / Region"
                className="checkout-address"
              />
              <InputField name="state" type="state" />

              <InputText
                name="city"
                labelTitle="City"
                className="checkout-address"
              />
              <InputField name="city" />

              <InputText
                name="zipCode"
                labelTitle="Zip Code"
                className="checkout-address"
              />
              <InputField name="zipCode" />

              <InputField
                name="makeDefault"
                type="checkbox"
                className="makeDefault"
              />
              <InputText
                name="makeDefault"
                labelTitle="Make this my default address"
                className="makeDefault-label"
              />

              <Button
                className="addAddress-btn"
                type="submit"
                disabled={isSubmitting}
              >
                Use this address
              </Button>
            </>
          )}
        </InputForm>

        {/* ... */}
      </div>
    </section>
  );
}

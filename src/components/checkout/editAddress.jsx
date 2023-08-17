import React from "react";
import Icon from "../icon";
import "./style/editAddress.css";
import { Formik, Form } from "formik";

export default function EditAddress({
  editingAddress,
  AddressSchema,
  setIsEditModalOpen,
  isEditModalOpen,
  onClose,
}) {
  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      {isEditModalOpen && (
        <section className="editAddress-modal" onClick={handleFormClick}>
          <div className="editAddress-container" onClick={handleFormClick}>
            <article className="editAddress-cancel">
              <h1>Update your shipping address</h1>
              <Icon
                cancel
                className=""
                onClick={() => setIsEditModalOpen(false)}
              />
            </article>
            <div>
              <div>
                <h2>Edit Address</h2>
                <Formik
                  initialValues={{
                    // Pre-fill the form with the editingAddress details
                    country: editingAddress.country,
                    fullName: editingAddress.fullName,
                    address: editingAddress.address,
                    // ...other fields...
                  }}
                  validationSchema={AddressSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    // Handle address update logic
                    // ...
                    setIsEditModalOpen(false); // Close the modal after submission
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting, setFieldValue }) => (
                    <Form>
                      {/* Form fields */}
                      {/* ... */}

                      <button type="submit" disabled={isSubmitting}>
                        Update Address
                      </button>
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

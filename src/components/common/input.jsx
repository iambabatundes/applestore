import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "./button";

export default function Input({
  buttonTitle,
  initialValues,
  children,
  name,
  onSubmit,
  validationSchema,
  otherProps,
}) {
  return (
    <section>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div>
              <label htmlFor={name}>{children}</label>
              <Field
                name={name} // Set the Field name to the htmlFor prop
                render={({ field, meta }) => (
                  <div>
                    <input
                      className={`${
                        meta.touched && meta.error
                          ? "error-input"
                          : "active-input"
                      }`}
                      {...field}
                      type={name} // You can customize the input type as needed
                      id={name}
                      name={name}
                      value={values[name]}
                      onChange={(text) => setFieldValue(name, text)}
                      {...otherProps}
                    />
                    <ErrorMessage name={name} component="div" />
                  </div>
                )}
              />
            </div>
            <Button
              disabled={isSubmitting}
              type="submit"
              className="editAddress-btn"
            >
              {buttonTitle}
            </Button>
          </Form>
        )}
      </Formik>
    </section>
  );
}

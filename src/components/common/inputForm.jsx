import React from "react";
import { Formik, Form } from "formik";

export default function InputForm({
  initialValues,
  children,
  validationSchema,
  onSubmit,
}) {
  return (
    <section>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>{children(values, isSubmitting, setFieldValue)}</Form>
        )}
      </Formik>
    </section>
  );
}

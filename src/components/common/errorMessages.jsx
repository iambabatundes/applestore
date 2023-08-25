import React from "react";
import { ErrorMessage } from "formik";

export default function ErrorMessages({ name }) {
  return (
    <section>
      <ErrorMessage name={name} component="div" />
    </section>
  );
}

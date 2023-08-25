import React from "react";
import { Field, ErrorMessage } from "formik";
import InputText from "./inputText";
import Input from "./input";

export default function InputField({
  name,
  tooltip,
  tooltipTitle,
  placeholder,
  input,
  type,
  className,
}) {
  return (
    <section>
      <Field name={name}>
        {({ field, meta, form }) => (
          <div>
            <Input
              name={name}
              meta={meta}
              className={`${className}`}
              setFieldValue={form.setFieldValue}
              value={field.value}
              tooltip={tooltip}
              tooltipTitle={tooltipTitle}
              placeholder={placeholder}
              input={input}
              type={type}
            />
            <ErrorMessage name={name} component="div" />
          </div>
        )}
      </Field>
    </section>
  );
}

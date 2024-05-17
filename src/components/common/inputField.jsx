import React from "react";
import { Field, ErrorMessage } from "formik";
import Input from "./input";

export default function InputField({
  name,
  tooltip,
  tooltipTitle,
  placeholder,
  input,
  type,
  className,
  textarea,
  fieldInput,
  select,
  options,
  onChange,
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
              onChange={onChange}
              setFieldValue={form.setFieldValue}
              value={field.value}
              // value={value}
              fieldInput={fieldInput}
              tooltip={tooltip}
              tooltipTitle={tooltipTitle}
              placeholder={placeholder}
              input={input}
              type={type}
              textarea={textarea}
              select={select}
              options={options}
            />

            <ErrorMessage name={name} component="div" />
          </div>
        )}
      </Field>
    </section>
  );
}

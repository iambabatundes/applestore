import React, { useState } from "react";

export function useForm({ schema, doSubmit }) {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  function validate() {
    const { error } = schema.validate(data, { abortEarly: false });
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  }

  function validateProperty({ name, value }) {
    if (value.trim().length === 0) return name + " is required";
    const obj = { [name]: value };
    const subSchema = { [name]: schema[name] };
    const { error } = schema.validate(obj, subSchema);
    return error ? error.details[0].message : null;
  }

  //   function validateProperty({ name, value }) {
  //     const obj = { [name]: value };
  //     const subSchema = { [name]: schema[name] };
  //     const { error } = schema.validate(obj, subSchema);
  //     return error ? error.details[0].message : null;
  //   }

  function handleSubmit(event) {
    event.preventDefault();

    const errors = validate();
    console.log(errors);

    setErrors(errors || {});
    if (errors) return null;

    // doSubmit();
  }

  function handleChange({ target: input }) {
    const error = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) error[input.name] = errorMessage;
    else error[input.name] = "";

    const updatedData =
      input.name === "email"
        ? { ...data, email: input.value }
        : { ...data, username: input.value };

    setData(updatedData);
    setErrors(error);
  }

  //   function handleChange({ target: input }) {
  //     const error = { ...errors };
  //     const errorMessage = validateProperty(input);
  //     if (errorMessage) error[input.name] = errorMessage;
  //     else error[input.name] = "";

  //     setData({
  //       ...data,
  //       [input.name]: input.value,
  //     });
  //     setErrors(error);
  //   }

  return { handleChange, validate, handleSubmit };
}

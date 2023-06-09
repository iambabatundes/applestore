import React, { useState } from "react";
import Joi from "joi";
import Input from "./forms/input";
import "./styles/newsletter.css";

export default function Newsletter() {
  const [data, setData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    name: Joi.string().min(3).label("Name"),
    email: Joi.string()
      .label("Email")
      .email({ tlds: { allow: false } })
      .required(),
  });

  function validate() {
    const { error } = schema.validate(data, { abortEarly: false });
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const errors = validate();
    setData(data);
    setErrors(errors || {});
    if (errors) return null;

    // api calling
  }

  function validateProperty({ name, value }) {
    const obj = { [name]: value };
    const subSchema = { [name]: schema[name] };
    const { error } = schema.validate(obj, subSchema);
    return error ? error.details[0].message : null;
  }

  function handleChange({ target: input }) {
    const error = { ...errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) error[input.name] = errorMessage;
    else error[input.name] = null;

    setData({
      ...data,
      [input.name]: input.value,
    });

    setErrors(error);
  }

  return (
    <section className="newsletter">
      <div className="newsletter__main">
        <article className="newsletter__heading">
          <h1>Subscribe to our Newsletter</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Dignissimos, voluptates.
          </p>
        </article>
        <form onSubmit={handleSubmit} className="newsletter__form">
          <Input
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Name"
            type="name"
            alertDanger="alertDanger"
            error={errors.name}
          />

          <Input
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            alertDanger="alertDanger"
            error={errors.email}
          />

          <button disabled={validate()} className="newsletter__submit">
            Subcribe
          </button>
        </form>
      </div>
    </section>
  );
}

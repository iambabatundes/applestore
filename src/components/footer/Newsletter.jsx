import React, { useState } from "react";
import Joi from "joi";
import Input from "../forms/input";
import Icon from "../icon";

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
    <div className="footer__newsletter">
      <h1>Newsletter</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      <form onSubmit={handleSubmit} className="footer_newsletter-form">
        <Input
          name="email"
          value={data.email}
          onChange={handleChange}
          // label="Email"
          placeholder="Email"
          type="email"
          error={errors.email}
        />

        <button disabled={validate()} className="footer-newsletter__submit">
          <Icon search className="search-icon" />
        </button>
      </form>
    </div>
  );
}

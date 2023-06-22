import React, { useState } from "react";
import Joi from "joi";
import "./modal.css";
import ModalHeading from "./modalHeading";
import Icon from "../icon";
import Input from "./input";

export default function GetStated({ onClose, navigateToJoin }) {
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
    const obj = { [name]: value };
    const subSchema = { [name]: schema[name] };
    const { error } = schema.validate(obj, subSchema);
    return error ? error.details[0].message : null;
  }

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
    if (errorMessage) {
      error[input.name] = errorMessage;
    } else {
      delete error[input.name]; // Clear the error message for the input field
    }

    setData({
      ...data,
      [input.name]: input.value,
    });

    setErrors(error);
  }

  const schema = Joi.object({
    username: Joi.string().required().label("Username"),
  });

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  const handleGoBack = () => {
    navigateToJoin();
  };

  return (
    <section className="modal">
      <div className="modal-container">
        <img src="/brandNew.webp" alt="Apple for sell" />
        <div className="modal-content" onClick={handleFormClick}>
          <div className="modal-function">
            <section className="goBack" onClick={handleGoBack}>
              <Icon goBack />
              <p>Back</p>
            </section>
            <Icon cancel className="modal-function-cancel" onClick={onClose} />
          </div>
          <ModalHeading title="Get your profile stated" subtitle="" />

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              name="username"
              value={data.username}
              placeholder="Username"
              label="Username"
              onChange={handleChange}
              type="text"
              className="login-form-control form-label"
              alert="alert"
              error={errors.username}
            />
          </form>
        </div>
      </div>
    </section>
  );
}

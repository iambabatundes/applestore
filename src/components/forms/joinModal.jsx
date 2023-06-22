import React, { useState } from "react";
import Joi from "joi";
import "./modal.css";
import ModalHeading from "./modalHeading";
import Icon from "../icon";
import Input from "./input";

export default function JoinModal({ onClose, onOpen, navigateToRegister }) {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

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

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  const handleGoBack = () => {
    navigateToRegister();
  };

  // const navigateToSignIn = () => {
  //   setShowForgetModal(false); // Close the ForgetPassword modal
  // };

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .label("Email")
      .min(3)
      .max(225),
    // .required(),
    // username: Joi.string().required().label("Username"),
    password: Joi.string()
      .min(8)
      .max(25)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,25}$"
        )
      )
      .label("Password"),
    // .required(),
  }).messages({
    "string.pattern.base":
      "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number",
  });

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
          <ModalHeading title="Continue with your email" />

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              name="email"
              value={data.email}
              placeholder="Email"
              label="Email"
              onChange={handleChange}
              type="email"
              className="login-form-control form-label"
              alert="alert"
              error={errors.email}
            />

            <div className="password-input">
              <Input
                name="password"
                value={data.password}
                placeholder="Password"
                label="Password"
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                className="login-form-control login-password form-label"
                alert="alert"
                error={errors.password}
              />
              {showPassword ? (
                <Icon eye className="icon" onClick={handleTogglePassword} />
              ) : (
                <Icon
                  eyeCancel
                  className="icon"
                  onClick={handleTogglePassword}
                />
              )}
            </div>

            {errors.password && (
              <div className="password-requirement">
                {errors.password.message}
              </div>
            )}
          </form>

          <button className="login-btn-login" disabled={validate()}>
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}

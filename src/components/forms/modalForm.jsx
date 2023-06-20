import React, { useState } from "react";
import Joi from "joi";
// import "./styles/modalForm.css";
import "./modal.css";
import Input from "./input";
import { useForm } from "./useForms";
import Icon from "../icon";

export default function ModalForm({
  forget,
  onClick,
  title,
  password,
  label,
  placeholder,
  submit,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    username: Joi.string().required(),
  });

  const { handleChange, validate, handleSubmit } = useForm({ schema: schema });

  return (
    <section>
      <form onSubmit={handleSubmit} className="login-form">
        <Input
          label={label}
          placeholder={placeholder}
          autoFocus
          onChange={handleChange}
          name="email"
          className="login-form-control form-label"
        />

        {password && (
          <div className="password-input">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              name="password"
              className="login-form-control login-password form-label"
            />
            {showPassword ? (
              <Icon eye className="icon" onClick={handleTogglePassword} />
            ) : (
              <Icon eyeCancel className="icon" onClick={handleTogglePassword} />
            )}
          </div>
        )}

        {forget && (
          <div className="form-check">
            <span onClick={onClick} className="forget">
              Forget Password?
            </span>
          </div>
        )}

        {submit && (
          <button className="login-btn-login" disabled={validate()}>
            {title}
          </button>
        )}
      </form>
    </section>
  );
}

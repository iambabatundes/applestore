import React from "react";
import "./styles/search.css";

function Button({ children }) {
  return <button className={`nav-btn`}>{children}</button>;
}

export default Button;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../../../services/authService";
import AddProduct from "../addProduct";

function RequireAuth({ children }) {
  const location = useLocation();

  if (getCurrentUser() === null)
    return (
      <Navigate
        to={{ pathname: "/admin/login" }}
        state={{ path: location.pathname }}
      />
    );
  return <AddProduct />;
}

export default RequireAuth;

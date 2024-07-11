import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ user, children }) {
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={{ pathname: "/login" }}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

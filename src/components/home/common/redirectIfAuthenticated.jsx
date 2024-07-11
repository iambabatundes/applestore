import React from "react";
import { Navigate } from "react-router-dom";

export default function RedirectIfAuthenticated({ user, children }) {
  if (user) {
    return <Navigate to="/users/my-dashboard" replace />;
  }

  return children;
}

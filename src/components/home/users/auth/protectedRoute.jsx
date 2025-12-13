// auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStore } from "zustand";
import { authStore } from "../../../../services/authService";
import LoadingSpinner from "../common/loadingSpinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthReady } = useStore(authStore);
  const location = useLocation();

  if (!isAuthReady) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

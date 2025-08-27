import { useStore } from "zustand";
import { Navigate, useLocation } from "react-router-dom";
import { authStore } from "../../../services/authService";
import LoadingSpinner from "../../common/loadingSpinner";

export default function RequireAuth({ children }) {
  const { isAuthenticated, user, isAuthReady, isLoading, isRefreshing } =
    useStore(authStore);
  const location = useLocation();

  if (!isAuthReady || isLoading || isRefreshing) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

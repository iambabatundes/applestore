import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../store/useAdminAuthStore";
import AdminLogin from "../adminLogin";
import AdminPasswordReset from "../AdminPasswordReset";
import AdminInviteRegistration from "../AdminInviteRegistration";
import Admin from "../admin";

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, initialized, loading } = useAdminAuthStore();

  if (!initialized || loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const PublicAdminRoute = ({ children }) => {
  const { isAuthenticated, initialized } = useAdminAuthStore();

  if (initialized && isAuthenticated) {
    return <Navigate to="/admin/home" replace />;
  }

  return children;
};

export default function AdminRoutes({ count, logo }) {
  return (
    <Routes>
      <Route
        path="/admin/login"
        element={
          // <PublicAdminRoute>
          <AdminLogin />
          // </PublicAdminRoute>
        }
      />

      <Route
        path="/admin/password-reset"
        element={
          // <PublicAdminRoute>
          <AdminPasswordReset />
          // </PublicAdminRoute>
        }
      />
      <Route path="/admin/register" element={<AdminInviteRegistration />} />

      <Route
        path="/*"
        element={
          // <ProtectedAdminRoute>
          <Admin count={count} logo={logo} />
          // </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}

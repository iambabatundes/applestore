import React, { useEffect } from "react";
import { logout } from "../../services/authService";

export default function Logout() {
  useEffect(() => {
    logout();
    window.location = "/";
  }, []);
  return null;
}

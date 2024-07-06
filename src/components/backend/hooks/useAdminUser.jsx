// hooks/useAdminUser.js
import { useState, useEffect } from "react";
import { getAdminUser } from "../../../services/adminService";
import { adminlogout } from "../../../services/adminAuthService";

export default function useAdminUser(navigate) {
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminUser() {
      try {
        const userData = await getAdminUser();
        setAdminUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setIsAuthenticated(false);
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      setLoading(false);
      return;
    }

    fetchAdminUser();
  }, [navigate]);

  const handleLogout = () => {
    adminlogout();
    setIsAuthenticated(false);
    setAdminUser(null);
    navigate("/admin/login");
  };

  return {
    adminUser,
    isAuthenticated,
    loading,
    handleLogout,
  };
}

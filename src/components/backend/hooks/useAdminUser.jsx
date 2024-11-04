import { useState, useEffect } from "react";
import { getAdminUser } from "../../../services/adminService";
import { adminlogout } from "../../../services/adminAuthService";

export default function useAdminUser(navigate) {
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // const timeoutDuration = 3600000; // 1 hour = 3600000 milliseconds
  const timeoutDuration = 1800000; // 30 minutes
  let logoutTimer = null;

  useEffect(() => {
    async function fetchAdminUser() {
      try {
        const userData = await getAdminUser();
        setAdminUser(userData);
        setIsAuthenticated(true);
        resetLogoutTimer();
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

    window.addEventListener("beforeunload", handleLogout);

    return () => {
      clearTimeout(logoutTimer);
      window.removeEventListener("beforeunload", handleLogout);
    };
  }, [navigate]);

  // Reset the inactivity timer
  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      handleLogout("Session expired due to inactivity. Please log in again."); // Log out after 30 minutes of inactivity
    }, timeoutDuration);
  };

  const handleLogout = (message) => {
    if (message) {
      localStorage.setItem("logoutMessage", message); // Store logout message
    }
    adminlogout();
    setIsAuthenticated(false);
    setAdminUser(null);
    navigate("/admin/login");
  };

  // Reset the timer on user activity
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "keypress", "scroll"];
    const resetActivity = () => resetLogoutTimer();

    // Attach event listeners
    events.forEach((event) => window.addEventListener(event, resetActivity));

    return () => {
      // Clean up event listeners
      events.forEach((event) =>
        window.removeEventListener(event, resetActivity)
      );
    };
  }, []);

  return {
    adminUser,
    isAuthenticated,
    loading,
    handleLogout,
  };
}

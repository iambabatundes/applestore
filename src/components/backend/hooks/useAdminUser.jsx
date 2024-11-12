import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { getAdminUser } from "../../../services/adminService";
import { adminlogout } from "../../../services/adminAuthService";
import axios from "axios";

export default function useAdminUser(navigate) {
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const timeoutDuration = 3600000; // 1 hour
  const logoutTimer = useRef(null);

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    try {
      const { data } = await axios.post(
        "/admin/auth/refresh",
        {},
        { withCredentials: true }
      );
      localStorage.setItem("token", data.accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to refresh token", error);
      handleLogout("Session expired. Please log in again.", true); // Automatic logout on refresh failure
    }
  };

  // Function to fetch the logged-in admin user
  const fetchAdminUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          await refreshAccessToken(); // Refresh token if it's expired
        }
      }
      const userData = await getAdminUser(); // Fetch user data
      setAdminUser(userData);
      setIsAuthenticated(true);
      resetLogoutTimer(); // Reset inactivity logout timer
    } catch (err) {
      console.error("Failed to fetch user", err);
      setIsAuthenticated(false);
      navigate("/admin/login"); // Redirect to login on failure
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Function to reset the inactivity logout timer
  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer.current); // Clear existing timer
    logoutTimer.current = setTimeout(() => {
      handleLogout(
        "Session expired due to inactivity. Please log in again.",
        true
      ); // Automatic logout on inactivity
    }, timeoutDuration); // 1 hour inactivity duration
  };

  // Function to handle logout (both manual and automatic)
  // const handleLogout = async (message = null, isAutomatic = false) => {
  //   if (isAutomatic && message) {
  //     localStorage.setItem("logoutMessage", message); // Set the inactivity message for automatic logout
  //   } else if (!isAutomatic) {
  //     localStorage.setItem("logoutMessage", "You have successfully logged out"); // Set manual logout message
  //   }

  //   await adminlogout(); // Call the logout service
  //   localStorage.removeItem("token"); // Clear the token from localStorage
  //   setIsAuthenticated(false); // Update authentication state
  //   setAdminUser(null); // Clear the admin user data
  //   navigate("/admin/login"); // Redirect to login
  // };

  const handleLogout = async (message = null, isAutomatic = false) => {
    if (isAutomatic && message) {
      localStorage.setItem("logoutMessage", message); // Set the inactivity message for automatic logout
      localStorage.setItem("logoutType", "automatic"); // Store type of logout (automatic)
    } else if (!isAutomatic) {
      localStorage.setItem("logoutMessage", "You have successfully logged out"); // Set manual logout message
      localStorage.setItem("logoutType", "manual"); // Store type of logout (manual)
    }

    await adminlogout(); // Call the logout service
    localStorage.removeItem("token"); // Clear the token from localStorage
    setIsAuthenticated(false); // Update authentication state
    setAdminUser(null); // Clear the admin user data
    navigate("/admin/login"); // Redirect to login
  };

  // Event listeners for user activity (to reset inactivity timer)
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "keypress", "scroll"];
    const resetActivity = () => resetLogoutTimer(); // Reset the logout timer on user activity

    events.forEach((event) => window.addEventListener(event, resetActivity));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetActivity)
      );
      clearTimeout(logoutTimer.current); // Clear the logout timer when component unmounts
    };
  }, []);

  // Fetch the admin user data when the component mounts
  useEffect(() => {
    fetchAdminUser();
  }, []);

  return {
    adminUser,
    isAuthenticated,
    loading,
    handleLogout, // Expose the logout handler for manual logout
  };
}

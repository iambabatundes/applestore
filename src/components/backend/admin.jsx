import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import AdminNavbar from "./adminNavbar";
import "./styles/admin.css";
import "../backend/common/styles/darkMode.css";
import Dashboard from "./dashboard";
import CreatePost from "./createPost";
import AddProduct from "./addProduct";
import AdminSidebar from "./adminSidebar";
import AdminLogin from "./adminLogin";
import AdminSetup from "./admin/adminSetup";
import AdminSkeleton from "./skeleton/adminSkeleton";
import { sidebarLinks } from "./config/adminRoutesConfig";
import useAdminStore from "./admin/useAdminStore";
import { useAdminSidebarStore } from "./store/adminSideBarStore";
import { useAdminAuthStore } from "./store/useAdminAuthStore";
import { useSetupStatus } from "../../hooks/useSetupStatus"; // The hook we created above

const SetupLoadingScreen = ({ darkMode }) => (
  <div className={`setup-loading-screen ${darkMode ? "dark-mode" : ""}`}>
    <div className="setup-loading-content">
      <div className="setup-loading-spinner"></div>
      <h2>Checking System Status...</h2>
      <p>Please wait while we verify the admin panel setup.</p>
    </div>
  </div>
);

const SetupRequiredScreen = ({ onContinueSetup, darkMode }) => (
  <div className={`setup-required-screen ${darkMode ? "dark-mode" : ""}`}>
    <div className="setup-required-content">
      <div className="setup-required-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9H21ZM19 21H5V3H13V9H19V21Z" />
        </svg>
      </div>
      <h2>Admin Panel Setup Required</h2>
      <p>
        This appears to be your first time accessing the admin panel. You'll
        need to set up an initial super administrator account to get started.
      </p>
      <div className="setup-features">
        <div className="setup-feature">
          <span className="setup-feature-icon">👤</span>
          <span>Create Super Admin Account</span>
        </div>
        <div className="setup-feature">
          <span className="setup-feature-icon">🔐</span>
          <span>Configure Two-Factor Authentication</span>
        </div>
        <div className="setup-feature">
          <span className="setup-feature-icon">🔑</span>
          <span>Generate Backup Access Codes</span>
        </div>
        <div className="setup-feature">
          <span className="setup-feature-icon">✅</span>
          <span>Verify Email & Security Settings</span>
        </div>
      </div>
      <button onClick={onContinueSetup} className="btn btn--primary btn--large">
        Begin Setup Process
      </button>
      <p className="setup-help-text">
        This process takes about 5-10 minutes and ensures your admin panel is
        secure.
      </p>
    </div>
  </div>
);

const Admin = ({ companyName, count, userName, logo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSetupFlow, setShowSetupFlow] = useState(false);
  const [setupInitialized, setSetupInitialized] = useState(false);

  const { adminUser, isAuthenticated, loading, fetchAdminUser, logout } =
    useAdminAuthStore();

  const {
    selectedLink,
    setSelectedLink,
    isMobileMenuOpen,
    toggleMobileMenu,
    selectedDropdownLink,
    setSelectedDropdownLink,
    darkMode,
    toggleDarkMode,
  } = useAdminStore();

  const { isCollapsed, isHidden } = useAdminSidebarStore();

  const {
    setupStatus,
    isLoading: setupLoading,
    error: setupError,
    needsSetup,
    isSetupComplete,
    refreshStatus,
  } = useSetupStatus();

  const handleSetupComplete = async () => {
    try {
      console.log("[Admin] Setup completed, refreshing status...");
      await refreshStatus();
      setShowSetupFlow(false);
      setSetupInitialized(true);

      navigate("/admin/login", {
        replace: true,
        state: {
          message:
            "Setup completed successfully! Please log in with your new admin account.",
          type: "success",
        },
      });
    } catch (error) {
      console.error("[Admin] Error after setup completion:", error);
    }
  };

  // Initialize setup flow
  const handleInitiateSetup = () => {
    setShowSetupFlow(true);
  };

  // Effect to handle authentication flow
  useEffect(() => {
    // Skip auth check if we're in setup mode or setup is needed
    if (setupLoading || needsSetup || showSetupFlow) {
      return;
    }

    if (!isAuthenticated && !loading && isSetupComplete) {
      fetchAdminUser(navigate);
    }
  }, [
    isAuthenticated,
    loading,
    fetchAdminUser,
    navigate,
    setupLoading,
    needsSetup,
    showSetupFlow,
    isSetupComplete,
  ]);

  // Effect to handle dark mode persistence
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Handle setup routing
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");
    const isLoginRoute = location.pathname === "/admin/login";

    if (isAdminRoute && !isLoginRoute && needsSetup && !setupInitialized) {
      console.log("[Admin] Setup required, redirecting to setup flow");
      // Don't redirect immediately, show the setup required screen
    }
  }, [location.pathname, needsSetup, setupInitialized]);

  // Loading states
  if (setupLoading && !setupInitialized) {
    return <SetupLoadingScreen darkMode={darkMode} />;
  }

  // Setup required state
  if (needsSetup && !showSetupFlow && !setupInitialized) {
    return (
      <SetupRequiredScreen
        onContinueSetup={handleInitiateSetup}
        darkMode={darkMode}
      />
    );
  }

  // Setup flow state
  if (showSetupFlow || (needsSetup && !isSetupComplete)) {
    return (
      <div className={`admin-setup-wrapper ${darkMode ? "dark-mode" : ""}`}>
        <AdminSetup onSetupComplete={handleSetupComplete} darkMode={darkMode} />
      </div>
    );
  }

  // Setup error state
  if (setupError && !setupInitialized) {
    return (
      <div className={`admin-error-screen ${darkMode ? "dark-mode" : ""}`}>
        <div className="admin-error-content">
          <h2>Setup Check Failed</h2>
          <p>Unable to verify admin panel setup status.</p>
          <p className="error-details">{setupError}</p>
          <div className="admin-error-actions">
            <button
              onClick={() => window.location.reload()}
              className="btn btn--secondary"
            >
              Retry
            </button>
            <button onClick={handleInitiateSetup} className="btn btn--primary">
              Force Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authentication loading state
  if (loading) {
    return <AdminSkeleton darkMode={darkMode} />;
  }

  // Not authenticated - show login
  if (!isAuthenticated && isSetupComplete) {
    return <AdminLogin setAuth={() => {}} />;
  }

  // Main admin interface (authenticated and setup complete)
  const notifications = () => {
    console.log("notification");
  };

  const links = sidebarLinks(darkMode, adminUser);

  return (
    <section className={darkMode ? "admin-wrapper dark-mode" : "admin-wrapper"}>
      <AdminNavbar
        companyName={companyName}
        count={count}
        handleToggle={toggleMobileMenu}
        userName={userName}
        handleLogout={logout}
        user={adminUser}
        darkMode={darkMode}
        logo={logo}
        toggleDarkMode={toggleDarkMode}
      />
      <section
        className={`admin-container ${
          isHidden
            ? "sidebar-hidden"
            : isCollapsed
            ? "sidebar-collapsed"
            : isMobileMenuOpen
            ? ""
            : "sidebar-closed"
        }`}
      >
        <AdminSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
          sidebarLinks={links}
          selectedDropdownLink={selectedDropdownLink}
          setSelectedDropdownLink={setSelectedDropdownLink}
          darkMode={darkMode}
          count={count}
          toggleDarkMode={toggleDarkMode}
          notifications={notifications}
          handleLogout={logout}
          setIsMobileMenuOpen={toggleMobileMenu}
        />
        <section
          className={`admin-main-content ${
            isMobileMenuOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            {links.map((link) => (
              <Route key={link.to} path={link.to} element={link.content} />
            ))}
            {links.flatMap((link) =>
              link.dropdown.map((submenu) => (
                <Route
                  key={submenu.to}
                  path={submenu.to}
                  element={submenu.content}
                />
              ))
            )}
            <Route
              path="/admin/add-product/:id"
              element={<AddProduct user={adminUser} />}
            />
            <Route path="/admin/create/:id" element={<CreatePost />} />
          </Routes>
        </section>
      </section>
    </section>
  );
};

export default Admin;

import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import AdminNavbar from "./adminNavbar";
import "./styles/admin.css";
import "./admin/styles/adminSetupScreens.css";
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
import { useSetupStatus } from "../backend/admin/hooks/useSetupStatus";
import SetupRequiredScreen from "./common/SetupRequiredScreen";
import SetupLoadingScreen from "./common/SetupLoadingScreen";

const Admin = ({ companyName, count, userName, logo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // STATE-BASED SETUP FLOW MANAGEMENT
  const [setupFlowState, setSetupFlowState] = useState({
    showSetupFlow: false,
    setupInitialized: false,
    authCheckComplete: false,
    setupForced: false, // For manual setup forcing
  });

  // SETUP STATUS HOOK
  const {
    setupStatus,
    isLoading: setupLoading,
    error: setupError,
    needsSetup,
    isSetupComplete,
    refreshStatus,
  } = useSetupStatus();

  // ADMIN AUTH STORE
  const {
    adminUser,
    isAuthenticated,
    loading: authLoading,
    fetchAdminUser,
    logout,
    shouldRedirectToLogin,
    initialized: authInitialized,
  } = useAdminAuthStore();

  // ADMIN UI STORES
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

  // ROUTE ANALYSIS (but not for routing decisions)
  const isLoginRoute = location.pathname === "/admin/login";
  const isAdminRoute = location.pathname.startsWith("/admin");

  // ENHANCED SETUP STATE DETERMINATION
  const actuallyNeedsSetup =
    setupStatus &&
    ((setupStatus.adminCount === 0 &&
      setupStatus.superAdminCount === 0 &&
      !setupStatus.setupLocked) ||
      setupStatus.needsSetup === true);

  const actuallySetupComplete =
    setupStatus &&
    (setupStatus.setupCompleted === true ||
      setupStatus.adminCount > 0 ||
      setupStatus.superAdminCount > 0 ||
      setupStatus.setupLocked === true);

  console.log("[Admin] Setup state analysis:", {
    actuallyNeedsSetup,
    actuallySetupComplete,
    setupStatus,
    setupFlowState,
  });

  // SETUP FLOW HANDLERS
  const handleInitiateSetup = () => {
    console.log("[Admin] Initiating setup flow via state");
    setSetupFlowState((prev) => ({
      ...prev,
      showSetupFlow: true,
      setupForced: true,
    }));
  };

  const handleSetupComplete = async () => {
    try {
      console.log("[Admin] Setup completed, refreshing status...");
      await refreshStatus();

      // Update setup flow state
      setSetupFlowState((prev) => ({
        ...prev,
        showSetupFlow: false,
        setupInitialized: true,
        setupForced: false,
      }));

      // Navigate to login with success message
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

  const handleForceSetup = () => {
    console.log("[Admin] Forcing setup flow");
    setSetupFlowState((prev) => ({
      ...prev,
      showSetupFlow: true,
      setupForced: true,
    }));
  };

  // AUTHENTICATION LOGIC - Only when setup is complete
  useEffect(() => {
    const checkAuthentication = async () => {
      // Skip auth check if setup is not complete or we're in setup flow
      if (
        !actuallySetupComplete ||
        setupFlowState.showSetupFlow ||
        setupFlowState.authCheckComplete ||
        isLoginRoute ||
        !isAdminRoute ||
        authLoading ||
        setupLoading
      ) {
        console.log("[Admin] Skipping auth check:", {
          actuallySetupComplete,
          showSetupFlow: setupFlowState.showSetupFlow,
          authCheckComplete: setupFlowState.authCheckComplete,
          isLoginRoute,
          isAdminRoute,
          authLoading,
          setupLoading,
        });
        return;
      }

      try {
        console.log("[Admin] Performing authentication check...");

        if (!adminUser && !isAuthenticated && authInitialized) {
          const user = await fetchAdminUser();

          if (!user && shouldRedirectToLogin()) {
            console.log(
              "[Admin] No authenticated user found, redirecting to login"
            );
            navigate("/admin/login", { replace: true });
          }
        }
      } catch (error) {
        console.error("[Admin] Auth check error:", error);
        if (shouldRedirectToLogin()) {
          navigate("/admin/login", { replace: true });
        }
      } finally {
        setSetupFlowState((prev) => ({
          ...prev,
          authCheckComplete: true,
        }));
      }
    };

    if (isAdminRoute && !isLoginRoute && actuallySetupComplete) {
      checkAuthentication();
    }
  }, [
    actuallySetupComplete,
    setupFlowState.showSetupFlow,
    setupFlowState.authCheckComplete,
    isLoginRoute,
    isAdminRoute,
    authLoading,
    setupLoading,
    adminUser,
    isAuthenticated,
    authInitialized,
    fetchAdminUser,
    shouldRedirectToLogin,
    navigate,
  ]);

  // SETUP FLOW LOGIC - Determine when to show setup
  useEffect(() => {
    // Don't make decisions while loading
    if (setupLoading || !setupStatus) {
      return;
    }

    // If setup is actually complete but we're showing setup flow, hide it
    if (
      actuallySetupComplete &&
      setupFlowState.showSetupFlow &&
      !setupFlowState.setupForced
    ) {
      console.log("[Admin] Setup complete detected, hiding setup flow");
      setSetupFlowState((prev) => ({
        ...prev,
        showSetupFlow: false,
        setupInitialized: true,
      }));
      return;
    }

    // If setup is needed and we haven't initialized setup flow, prepare to show it
    if (
      actuallyNeedsSetup &&
      !setupFlowState.setupInitialized &&
      !setupFlowState.showSetupFlow
    ) {
      console.log("[Admin] Setup needed, ready to show setup flow");
      // Don't automatically show setup flow, wait for user action
    }
  }, [
    setupLoading,
    setupStatus,
    actuallyNeedsSetup,
    actuallySetupComplete,
    setupFlowState.showSetupFlow,
    setupFlowState.setupInitialized,
    setupFlowState.setupForced,
  ]);

  // Reset auth check when route changes
  useEffect(() => {
    setSetupFlowState((prev) => ({
      ...prev,
      authCheckComplete: false,
    }));
  }, [location.pathname]);

  // Dark mode persistence
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // SECURITY: Prevent setup access when setup is complete (unless forced)
  useEffect(() => {
    if (
      actuallySetupComplete &&
      setupFlowState.showSetupFlow &&
      !setupFlowState.setupForced &&
      !setupError
    ) {
      console.warn(
        "[Admin] Security: Blocking setup access - setup already complete"
      );
      setSetupFlowState((prev) => ({
        ...prev,
        showSetupFlow: false,
      }));

      navigate("/admin/login", {
        replace: true,
        state: {
          message:
            "System setup is already complete. Please log in with your admin credentials.",
          type: "info",
        },
      });
    }
  }, [
    actuallySetupComplete,
    setupFlowState.showSetupFlow,
    setupFlowState.setupForced,
    setupError,
    navigate,
  ]);

  console.log("[Admin] Current render state:", {
    setupLoading,
    setupError,
    actuallyNeedsSetup,
    actuallySetupComplete,
    setupFlowState,
    isAuthenticated,
    adminUser: !!adminUser,
    authLoading,
    pathname: location.pathname,
  });

  // RENDER LOGIC - State-based decisions (no routing)

  // 1. LOADING STATE
  if (setupLoading && !setupFlowState.setupInitialized) {
    return <SetupLoadingScreen darkMode={darkMode} />;
  }

  // 2. SETUP ERROR STATE
  if (setupError && !setupFlowState.setupInitialized) {
    return (
      <div className={`admin-error-screen ${darkMode ? "dark-mode" : ""}`}>
        <div className="admin-error-content">
          <h2>Setup Verification Failed</h2>
          <p>Unable to verify system setup status.</p>
          <p className="error-details">{setupError}</p>
          <div className="admin-error-actions">
            <button
              onClick={() => window.location.reload()}
              className="btn btn--secondary"
            >
              Retry
            </button>
            <button onClick={handleForceSetup} className="btn btn--primary">
              Force Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. SETUP FLOW STATE
  if (setupFlowState.showSetupFlow) {
    return (
      <div className={`admin-setup-wrapper ${darkMode ? "dark-mode" : ""}`}>
        <AdminSetup onSetupComplete={handleSetupComplete} darkMode={darkMode} />
      </div>
    );
  }

  // 4. SETUP REQUIRED SCREEN
  if (
    actuallyNeedsSetup &&
    !setupFlowState.setupInitialized &&
    !setupFlowState.showSetupFlow
  ) {
    return (
      <SetupRequiredScreen
        onContinueSetup={handleInitiateSetup}
        darkMode={darkMode}
      />
    );
  }

  // 5. LOGIN SCREEN
  if (
    isLoginRoute ||
    (!isAuthenticated && actuallySetupComplete && !authLoading)
  ) {
    return <AdminLogin setAuth={() => {}} />;
  }

  // 6. AUTHENTICATION LOADING
  if (authLoading || !setupFlowState.authCheckComplete) {
    return <AdminSkeleton darkMode={darkMode} />;
  }

  // 7. UNAUTHENTICATED STATE
  if (!isAuthenticated && actuallySetupComplete) {
    return <AdminSkeleton darkMode={darkMode} />;
  }

  // 8. MAIN ADMIN INTERFACE
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

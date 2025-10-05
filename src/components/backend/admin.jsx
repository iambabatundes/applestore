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
import { useLogo } from "./hooks/useLogo";

const Admin = ({ companyName, count, userName, logo: initialLogo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    logo: currentLogo,
    refreshLogo,
    loading: logoLoading,
  } = useLogo(initialLogo);

  const logoToDisplay = currentLogo || initialLogo || "";

  // Setup flow state management
  const [setupFlowState, setSetupFlowState] = useState({
    showSetupFlow: false,
    setupInitialized: false,
    setupForced: false,
  });

  const [isInitializing, setIsInitializing] = useState(true);

  const {
    setupStatus,
    isLoading: setupLoading,
    error: setupError,
    needsSetup,
    isSetupComplete,
    refreshStatus,
  } = useSetupStatus();

  const {
    adminUser,
    isAuthenticated,
    loading: authLoading,
    fetchAdminUser,
    logout,
    shouldRedirectToLogin,
    initialized: authInitialized,
    initialize: initializeAuth,
  } = useAdminAuthStore();

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

  const isLoginRoute = location.pathname === "/admin/login";
  const isAdminRoute = location.pathname.startsWith("/admin");

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

  useEffect(() => {
    let isMounted = true;
    let initTimeout;

    const performInitialization = async () => {
      if (!isMounted) return;

      try {
        console.log("🚀 Starting admin initialization process");

        // Set initialization timeout (30 seconds)
        initTimeout = setTimeout(() => {
          if (isMounted) {
            console.error("❌ Admin initialization timed out");
            setIsInitializing(false);
          }
        }, 30000);

        // Step 1: Initialize auth store if not already done
        if (!authInitialized && actuallySetupComplete) {
          console.log("🔐 Initializing admin authentication...");
          try {
            await initializeAuth();
            console.log("✅ Admin authentication initialized");
          } catch (authError) {
            console.error("❌ Admin auth initialization failed:", authError);
            // Don't fail completely, let the user try to login
          }
        }

        // Step 2: If setup is complete and we're not authenticated, try to fetch user
        if (
          actuallySetupComplete &&
          authInitialized &&
          !adminUser &&
          !authLoading
        ) {
          console.log("👤 Attempting to fetch admin user...");
          try {
            const user = await fetchAdminUser();
            if (user) {
              console.log("✅ Admin user fetched successfully:", user.email);
            } else {
              console.log("ℹ️ No authenticated admin user found");
            }
          } catch (fetchError) {
            console.warn("⚠️ Failed to fetch admin user:", fetchError);
            // This is expected if user isn't logged in
          }
        }

        console.log("🏁 Admin initialization completed");
      } catch (error) {
        console.error("❌ Admin initialization error:", error);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
          if (initTimeout) {
            clearTimeout(initTimeout);
          }
        }
      }
    };

    // Only initialize if we have setup status
    if (setupStatus && !setupLoading) {
      performInitialization();
    } else if (!setupLoading && setupError) {
      // If there's a setup error and we're not loading, stop initializing
      setIsInitializing(false);
    }

    // Cleanup
    return () => {
      isMounted = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
    };
  }, [
    setupStatus,
    setupLoading,
    setupError,
    actuallySetupComplete,
    authInitialized,
    adminUser,
    authLoading,
    initializeAuth,
    fetchAdminUser,
  ]);

  // NAVIGATION EFFECT - Handle redirects after auth state changes
  useEffect(() => {
    // Only handle navigation if we're done initializing
    if (isInitializing || setupLoading) return;

    // If setup is complete and we should redirect to login
    if (
      actuallySetupComplete &&
      !setupFlowState.showSetupFlow &&
      shouldRedirectToLogin() &&
      !isLoginRoute &&
      isAdminRoute
    ) {
      console.log("🔄 Redirecting to admin login - not authenticated");
      navigate("/admin/login", { replace: true });
    }
  }, [
    isInitializing,
    setupLoading,
    actuallySetupComplete,
    setupFlowState.showSetupFlow,
    shouldRedirectToLogin,
    isLoginRoute,
    isAdminRoute,
    navigate,
  ]);

  // SETUP FLOW HANDLERS
  const handleInitiateSetup = () => {
    setSetupFlowState((prev) => ({
      ...prev,
      showSetupFlow: true,
      setupForced: true,
    }));
  };

  const handleSetupComplete = async () => {
    try {
      await refreshStatus();
      setSetupFlowState((prev) => ({
        ...prev,
        showSetupFlow: false,
        setupInitialized: true,
        setupForced: false,
      }));

      navigate("/admin/login", {
        replace: true,
        state: {
          message:
            "Setup completed successfully! Please log in with your new admin account.",
          type: "success",
        },
      });
    } catch (error) {
      console.error("Setup completion error:", error);
    }
  };

  const handleForceSetup = () => {
    setSetupFlowState((prev) => ({
      ...prev,
      showSetupFlow: true,
      setupForced: true,
    }));
  };

  // Dark mode persistence
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // SECURITY: Prevent setup access when setup is complete
  useEffect(() => {
    if (
      actuallySetupComplete &&
      setupFlowState.showSetupFlow &&
      !setupFlowState.setupForced &&
      !setupError
    ) {
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

  // DEBUGGING (Development only)
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Admin Component State:", {
      isInitializing,
      setupLoading,
      authLoading,
      authInitialized,
      isAuthenticated,
      adminUser: !!adminUser,
      actuallySetupComplete,
      actuallyNeedsSetup,
      isLoginRoute,
      location: location.pathname,
      setupFlowShow: setupFlowState.showSetupFlow,
    });
  }

  // RENDER LOGIC WITH IMPROVED CONDITIONS

  // 1. SETUP LOADING
  if (setupLoading && !setupFlowState.setupInitialized) {
    return <SetupLoadingScreen darkMode={darkMode} />;
  }

  // 2. SETUP ERROR
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

  // 5. INITIALIZATION LOADING
  if (isInitializing) {
    return <AdminSkeleton darkMode={darkMode} />;
  }

  // 6. LOGIN SCREEN - Show if on login route OR if should redirect to login
  if (isLoginRoute || (actuallySetupComplete && shouldRedirectToLogin())) {
    return <AdminLogin setAuth={() => {}} />;
  }

  // 7. MAIN ADMIN INTERFACE
  // Only render if we're authenticated and setup is complete
  if (actuallySetupComplete && isAuthenticated && adminUser) {
    const notifications = () => {
      console.log("notification");
    };

    const links = sidebarLinks(darkMode, adminUser);

    return (
      <section
        className={darkMode ? "admin-wrapper dark-mode" : "admin-wrapper"}
      >
        <AdminNavbar
          companyName={companyName}
          count={count}
          handleToggle={toggleMobileMenu}
          userName={userName}
          handleLogout={logout}
          user={adminUser}
          darkMode={darkMode}
          logo={logoToDisplay}
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
  }

  // 8. FALLBACK - Show skeleton while determining state
  return <AdminSkeleton darkMode={darkMode} />;
};

export default Admin;

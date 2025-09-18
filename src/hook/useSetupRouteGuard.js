import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSetupStatus } from "../components/backend/admin/hooks/useSetupStatus";

export const useSetupRouteGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [guardInitialized, setGuardInitialized] = useState(false);
  const [redirectHandled, setRedirectHandled] = useState(false);

  const {
    setupStatus,
    isLoading: setupLoading,
    error: setupError,
    refreshStatus,
  } = useSetupStatus();

  // Enhanced setup state determination - centralized logic
  const determineSetupState = () => {
    if (!setupStatus || setupLoading) {
      return {
        state: "loading",
        needsSetup: false,
        isComplete: false,
        shouldAllowSetup: false,
        shouldBlockSetup: false,
      };
    }

    // Explicit checks for setup completion - SINGLE SOURCE OF TRUTH
    const hasAdmins = (setupStatus.adminCount || 0) > 0;
    const hasSuperAdmins = (setupStatus.superAdminCount || 0) > 0;
    const isExplicitlyLocked =
      setupStatus.setupLocked || setupStatus.setupCompleted;

    // CLEAR LOGIC: Setup is complete if we have ANY admin OR it's explicitly locked
    const actuallyComplete = hasAdmins || hasSuperAdmins || isExplicitlyLocked;

    // CLEAR LOGIC: Setup is needed ONLY if we have NO admins AND it's not locked
    const actuallyNeedsSetup =
      !hasAdmins && !hasSuperAdmins && !isExplicitlyLocked;

    console.log("[SetupRouteGuard] CENTRALIZED Setup state analysis:", {
      hasAdmins,
      hasSuperAdmins,
      isExplicitlyLocked,
      actuallyComplete,
      actuallyNeedsSetup,
      setupStatus,
    });

    return {
      state: actuallyComplete
        ? "complete"
        : actuallyNeedsSetup
        ? "needed"
        : "unknown",
      needsSetup: actuallyNeedsSetup,
      isComplete: actuallyComplete,
      shouldAllowSetup: actuallyNeedsSetup,
      shouldBlockSetup: actuallyComplete,
    };
  };

  const {
    state: setupState,
    needsSetup: actuallyNeedsSetup,
    isComplete: actuallyComplete,
    shouldAllowSetup,
    shouldBlockSetup,
  } = determineSetupState();

  // Current route analysis
  const isAdminRoute = location.pathname.startsWith("/admins");
  const isLoginRoute = location.pathname === "/admins/login";
  const isSetupRoute =
    location.pathname.includes("/admins/setup/initial-admin") ||
    location.pathname === "/admins/";
  const isDashboardRoute =
    location.pathname === "/admins" || location.pathname === "/admins/";

  // MAIN ROUTE GUARD LOGIC
  useEffect(() => {
    // Don't process redirects until we have definitive setup status
    if (setupLoading || setupState === "loading" || redirectHandled) {
      console.log(
        "[SetupRouteGuard] Waiting - not ready for routing decisions:",
        {
          setupLoading,
          setupState,
          redirectHandled,
        }
      );
      return;
    }

    // Handle setup error - allow manual setup initiation ONLY if no admins exist
    if (setupError && isAdminRoute) {
      console.warn("[SetupRouteGuard] Setup error detected:", setupError);

      // If we can't determine status but user is trying to access admin routes
      // Default to redirecting to setup (safer than login)
      if (!isSetupRoute) {
        console.log(
          "[SetupRouteGuard] Setup error - redirecting to setup for safety"
        );
        navigate("/admins/setup", {
          replace: true,
          state: {
            message:
              "Unable to verify system status. Please complete setup if this is a new installation.",
            type: "warning",
            allowSetup: true,
          },
        });
        setRedirectHandled(true);
      }
      return;
    }

    // CORE ROUTING LOGIC - Only process admin routes
    if (isAdminRoute) {
      // SCENARIO 1: Setup is needed (no admins exist)
      if (actuallyNeedsSetup) {
        console.log("[SetupRouteGuard] Setup needed - no admins exist");

        // Allow setup routes, redirect everything else to setup
        if (!isSetupRoute) {
          console.log(
            "[SetupRouteGuard] Redirecting to setup - no admins exist"
          );
          navigate("/admins/setup", {
            replace: true,
            state: {
              message:
                "System setup required. Please create your initial administrator account.",
              type: "info",
            },
          });
          setRedirectHandled(true);
          return;
        }

        // If already on setup route and setup is needed, allow it
        console.log("[SetupRouteGuard] Allowing setup route - setup needed");
      }
      // SCENARIO 2: Setup is complete (admins exist)
      else if (actuallyComplete) {
        console.log("[SetupRouteGuard] Setup complete - admins exist");

        // BLOCK all setup routes when setup is complete
        if (isSetupRoute) {
          console.log(
            "[SetupRouteGuard] BLOCKING setup route - setup already complete"
          );
          navigate("/admins/login", {
            replace: true,
            state: {
              message:
                "System setup is already complete. Please log in with your admin credentials.",
              type: "info",
            },
          });
          setRedirectHandled(true);
          return;
        }

        // Allow login and dashboard routes when setup is complete
        console.log("[SetupRouteGuard] Allowing admin routes - setup complete");
      }
      // SCENARIO 3: Unknown state - be conservative
      else {
        console.warn(
          "[SetupRouteGuard] Unknown setup state - being conservative"
        );

        // In unknown state, redirect to setup for safety
        if (!isSetupRoute) {
          navigate("/admins/setup", {
            replace: true,
            state: {
              message: "Please verify system setup status.",
              type: "warning",
            },
          });
          setRedirectHandled(true);
          return;
        }
      }
    }

    // Mark guard as initialized after processing
    setGuardInitialized(true);
  }, [
    setupLoading,
    setupState,
    actuallyNeedsSetup,
    actuallyComplete,
    setupError,
    isAdminRoute,
    isLoginRoute,
    isSetupRoute,
    isDashboardRoute,
    location.pathname,
    navigate,
    redirectHandled,
  ]);

  // Reset redirect flag when route changes
  useEffect(() => {
    setRedirectHandled(false);
    setGuardInitialized(false); // Reset guard when route changes
  }, [location.pathname]);

  return {
    // Status
    setupLoading,
    setupError,
    setupState,
    guardInitialized,

    // Computed states - SINGLE SOURCE OF TRUTH
    needsSetup: actuallyNeedsSetup,
    isSetupComplete: actuallyComplete,
    shouldAllowSetup,
    shouldBlockSetup,

    // Route states
    isAdminRoute,
    isLoginRoute,
    isSetupRoute,
    isDashboardRoute,

    // Actions
    refreshStatus,

    // Render decision flags
    shouldShowSetupFlow:
      actuallyNeedsSetup && (isSetupRoute || !guardInitialized),
    shouldShowAdminInterface:
      actuallyComplete && guardInitialized && !isSetupRoute,
    shouldShowLoading: setupLoading || (!guardInitialized && !setupError),
  };
};

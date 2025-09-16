import { useState, useEffect, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import "./fonts/MacanPanWeb-Medium.ttf";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";

// Lazy load components for better performance
const AppRoutes = lazy(() => import("./routes/AppRoutes"));
const CheckoutNavbar = lazy(() => import("./components/checkoutNavbar"));
const Admin = lazy(() => import("./components/backend/admin"));
const Navbar = lazy(() => import("./components/home/navbar"));
const Footer = lazy(() => import("./components/footer/footer"));

// Import components and utilities
import AppSkeleton from "./appSkeleton/appSkeleton";
import ErrorFallback from "./components/common/ErrorFallback";
import AppLoading from "./components/loading/appLoading";
import fetchLogo from "./utils/fetchLogo";
import { logger } from "./components/utils/logger";

// Import store hooks
import { useCartStore } from "../src/components/store/cartStore";
import { useCurrencyStore } from "../src/components/store/currencyStore";
import { useGeoLocationStore } from "../src/components/store/geoLocationStore";
import { useStore } from "zustand";
import { authStore, initializeAuth } from "./services/authService";
import { userHttpService, adminHttpService } from "./services/http/index";
import { useAdminAuthStore } from "./components/backend/store/useAdminAuthStore";
import { useSetupStatus } from "./components/backend/admin/hooks/useSetupStatus";

// Import constants
import {
  TOAST_CONFIG,
  INITIALIZATION_TIMEOUT,
  RETRY_CONFIG,
  LOADING_MESSAGES,
  ERROR_MESSAGES,
  DEFAULTS,
} from "./config/constants";
import { useSetupStatus } from "./components/backend/admin/hooks/useSetupStatus";

function App() {
  const { user, isAuthReady, accessToken, isAuthenticated } =
    useStore(authStore);
  const [appInitialized, setAppInitialized] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState(null);

  const {
    cartItems,
    addToCart,
    selectedQuantities,
    setSelectedQuantities,
    quantityTenPlus,
    setQuantityTenPlus,
    handleDelete,
    setCartItems,
  } = useCartStore();

  const [logoImage, setLogoImage] = useState("");
  const location = useLocation();

  const {
    conversionRate,
    selectedCurrency,
    setSelectedCurrency,
    setConversionRate,
    currencyRates,
  } = useCurrencyStore();

  const { geoLocation, fetchGeoLocation } = useGeoLocationStore();

  const {
    setupStatus,
    isLoading: setupLoading,
    needsSetup,
    isSetupComplete,
    error: setupError,
  } = useSetupStatus();

  const isAdminRoute = location.pathname.startsWith("/admin");

  // Enhanced initialization with timeout and better error handling
  useEffect(() => {
    let isInitialized = false;
    let timeoutId;

    const initializeApp = async () => {
      if (isInitialized) return;
      isInitialized = true;

      try {
        logger.info("Starting app initialization...");

        // Set initialization timeout
        timeoutId = setTimeout(() => {
          throw new Error(ERROR_MESSAGES.INITIALIZATION_TIMEOUT);
        }, INITIALIZATION_TIMEOUT);

        // Initialize auth first
        await initializeAuth();
        setAuthInitialized(true);
        logger.info("Authentication initialized successfully");

        // Enhanced token refresh setup
        userHttpService.setRefreshFunction(async (refreshToken) => {
          try {
            const result = await authStore.getState().refreshAccessToken();
            logger.info("User token refreshed successfully");
            return {
              accessToken: result.accessToken,
              refreshToken: result.refreshToken || refreshToken,
              expiresIn: result.expiresIn || DEFAULTS.TOKEN_EXPIRY,
            };
          } catch (error) {
            logger.error("User token refresh failed:", error);
            authStore.getState().logout();
            throw error;
          }
        });

        adminHttpService.setRefreshFunction(async (refreshToken) => {
          try {
            const adminAuth = useAdminAuthStore.getState();
            if (adminAuth.refreshToken) {
              const result = await adminAuth.refreshToken();
              logger.info("Admin token refreshed successfully");
              return {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken || refreshToken,
                expiresIn: result.expiresIn || DEFAULTS.TOKEN_EXPIRY,
              };
            }
            throw new Error(ERROR_MESSAGES.ADMIN_REFRESH_UNAVAILABLE);
          } catch (error) {
            logger.error("Admin token refresh failed:", error);
            const adminAuth = useAdminAuthStore.getState();
            if (adminAuth.logout) {
              adminAuth.logout();
            }
            throw error;
          }
        });

        // Initialize services with retry mechanism
        const initializeWithRetry = async (
          fn,
          name,
          maxRetries = RETRY_CONFIG.maxRetries
        ) => {
          for (let i = 0; i < maxRetries; i++) {
            try {
              await fn();
              logger.info(`${name} initialized successfully`);
              return;
            } catch (error) {
              logger.warn(
                `${name} initialization attempt ${i + 1} failed:`,
                error
              );
              if (i === maxRetries - 1) throw error;
              await new Promise((resolve) =>
                setTimeout(resolve, RETRY_CONFIG.baseDelay * (i + 1))
              );
            }
          }
        };

        await Promise.allSettled([
          initializeWithRetry(fetchGeoLocation, "Geolocation"),
          initializeWithRetry(
            () => useCurrencyStore.getState().initializeCurrency(),
            "Currency"
          ),
          initializeWithRetry(() => fetchLogo(setLogoImage), "Logo"),
        ]);

        clearTimeout(timeoutId);
        logger.info("App initialization completed successfully");
      } catch (error) {
        clearTimeout(timeoutId);
        logger.error("App initialization error:", error);
        setInitializationError(error);
      } finally {
        setAppInitialized(true);
      }
    };

    initializeApp();

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Enhanced currency change handler
  const handleCurrencyChange = (currency) => {
    try {
      const rate = currencyRates[currency] || DEFAULTS.CURRENCY_RATE;
      setConversionRate(rate);
      setSelectedCurrency(currency, rate);
      localStorage.setItem("selectedCurrency", currency);
      logger.info(`Currency changed to ${currency} with rate ${rate}`);
    } catch (error) {
      logger.error(ERROR_MESSAGES.CURRENCY_CHANGE_FAILED, error);
    }
  };

  // Enhanced cart submit handler
  const handleSubmit = (e, itemId) => {
    e.preventDefault();

    try {
      const input = e.target.querySelector('input[name="quantity"]');
      const inputValue = input ? input.value.trim() : String(DEFAULTS.QUANTITY);

      let quantity = parseInt(inputValue, 10);
      if (isNaN(quantity) || quantity < 1) {
        quantity = DEFAULTS.QUANTITY;
      }

      useCartStore.setState((state) => ({
        selectedQuantities: {
          ...state.selectedQuantities,
          [itemId]: quantity,
        },
        quantityTenPlus: {
          ...state.quantityTenPlus,
          [itemId]: quantity > 9 ? quantity : undefined,
        },
        cartItems: state.cartItems.map((item) =>
          item._id === itemId
            ? { ...item, quantity, total: item.price * quantity }
            : item
        ),
      }));

      logger.debug(`Cart quantity updated for item ${itemId}: ${quantity}`);
    } catch (error) {
      logger.error(ERROR_MESSAGES.CART_UPDATE_FAILED, error);
    }
  };

  // Calculate cart item count with error handling
  const cartItemCount = (() => {
    try {
      return (
        Object.values(selectedQuantities).reduce((total, quantity) => {
          if (quantity === "10+") {
            return total + 1;
          }
          return total + parseInt(quantity || 0);
        }, 0) + (selectedQuantities["Quantity 10+"] || 0)
      );
    } catch (error) {
      logger.error(ERROR_MESSAGES.CART_COUNT_CALCULATION_FAILED, error);
      return DEFAULTS.CART_COUNT;
    }
  })();

  // Enhanced navbar renderer
  const renderNavbar = () => {
    if (location.pathname === "/checkout") {
      return (
        <Suspense fallback={<div className="navbar-skeleton" />}>
          <CheckoutNavbar cartItemCount={cartItemCount} logoImage={logoImage} />
        </Suspense>
      );
    }

    if (isAdminRoute && needsSetup) {
      return null;
    }

    return (
      <Suspense fallback={<div className="navbar-skeleton" />}>
        <Navbar
          cartItemCount={cartItemCount}
          user={user}
          selectedCurrency={selectedCurrency}
          currencyRates={currencyRates}
          onCurrencyChange={handleCurrencyChange}
          isLoading={!appInitialized}
          logoImage={logoImage}
          geoLocation={geoLocation}
        />
      </Suspense>
    );
  };

  // Handle initialization errors
  if (initializationError) {
    return (
      <ErrorFallback
        error={initializationError}
        resetError={() => {
          setInitializationError(null);
          window.location.reload();
        }}
      />
    );
  }

  // Show loading spinner while critical components initialize
  if (!authInitialized || !isAuthReady) {
    return <AppSkeleton message={LOADING_MESSAGES.AUTH} />;
  }

  // For admin routes, show loading while checking setup status
  if (isAdminRoute && setupLoading && !appInitialized) {
    return <AppSkeleton message={LOADING_MESSAGES.SYSTEM_SETUP} />;
  }

  // Handle admin setup flow
  if (isAdminRoute && needsSetup) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense
          fallback={<AppSkeleton message={LOADING_MESSAGES.ADMIN_SETUP} />}
        >
          <Admin count={5} logo={logoImage} />
        </Suspense>
        <ToastContainer {...TOAST_CONFIG} />
      </ErrorBoundary>
    );
  }

  // Regular app loading state for non-admin routes
  if (!appInitialized && !isAdminRoute) {
    return (
      <AppLoading
        renderNavbar={renderNavbar}
        Footer={Footer}
        logoImage={logoImage}
        toastConfig={TOAST_CONFIG}
      />
    );
  }

  // Debug logging for development
  if (process.env.NODE_ENV === "development") {
    logger.debug("App render - Auth state:", {
      user: !!user,
      isAuthenticated,
      accessToken: !!accessToken,
      isAuthReady,
      authInitialized,
      appInitialized,
      isAdminRoute,
      needsSetup,
      setupLoading,
    });
  }

  // Main application render
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ToastContainer {...TOAST_CONFIG} />

      {location.pathname.includes("/admin") ? (
        <Suspense
          fallback={<AppSkeleton message={LOADING_MESSAGES.ADMIN_INTERFACE} />}
        >
          <Admin count={5} logo={logoImage} />
        </Suspense>
      ) : (
        <>
          {renderNavbar()}
          <main className="main">
            <Suspense
              fallback={<AppSkeleton message={LOADING_MESSAGES.APPLICATION} />}
            >
              <AppRoutes
                addToCart={addToCart}
                cartItems={cartItems}
                selectedQuantities={selectedQuantities}
                setSelectedQuantities={setSelectedQuantities}
                quantityTenPlus={quantityTenPlus}
                setQuantityTenPlus={setQuantityTenPlus}
                handleSubmit={handleSubmit}
                setCartItems={setCartItems}
                handleDelete={handleDelete}
                selectedCurrency={selectedCurrency}
                conversionRate={conversionRate}
              />
            </Suspense>
          </main>
          <Suspense fallback={<div className="footer-skeleton" />}>
            <Footer logoImage={logoImage} />
          </Suspense>
        </>
      )}
    </ErrorBoundary>
  );
}

export default App;

import { useState, useEffect, Suspense, lazy, useCallback } from "react";
import { useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "react-error-boundary";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import "./fonts/MacanPanWeb-Medium.ttf";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";

const AppRoutes = lazy(() => import("./routes/AppRoutes.js"));
const CheckoutNavbar = lazy(() =>
  import("./components/home/checkout/checkoutNavbar.jsx")
);

const AdminRoutes = lazy(() =>
  import("./components/backend/routes/AdminRoutes.js")
);
const Navbar = lazy(() => import("./components/home/navbar.jsx"));
const Footer = lazy(() => import("./components/footer/footer.jsx"));

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
import {
  TOAST_CONFIG,
  INITIALIZATION_TIMEOUT,
  RETRY_CONFIG,
  LOADING_MESSAGES,
  ERROR_MESSAGES,
  DEFAULTS,
} from "./config/constants";
import AdminSkeleton from "./components/backend/skeleton/adminSkeleton";

function App() {
  const { user, isAuthReady, accessToken, isAuthenticated } =
    useStore(authStore);
  const [appInitialized, setAppInitialized] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState(null);

  const {
    cartItems,
    savedItems,
    addToCart,
    selectedQuantities,
    quantityTenPlus,
    removeItem,
    updateQuantity,
    updateCustomQuantity,
    setCartItems,
    clearError,
    error: cartError,
    saveForLater,
    moveToCart,
    removeFromSaved,
  } = useCartStore();

  const [logoImage, setLogoImage] = useState("");
  const [companyName, setCompanyName] = useState("AppleStore");
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

  // Logo refresh functionality
  const refreshLogo = useCallback(async () => {
    try {
      logger.debug("Refreshing logo...");
      const result = await fetchLogo(setLogoImage);
      if (result && result.companyName) {
        setCompanyName(result.companyName);
      }
    } catch (error) {
      logger.error("Failed to refresh logo:", error);
    }
  }, []);

  useEffect(() => {
    window.refreshAppLogo = refreshLogo;
    return () => {
      delete window.refreshAppLogo;
    };
  }, [refreshLogo]);

  useEffect(() => {
    const handleLogoUpdate = async (event) => {
      logger.debug("Logo update event received:", event.detail);
      await refreshLogo();
    };

    window.addEventListener("logoUpdated", handleLogoUpdate);
    return () => {
      window.removeEventListener("logoUpdated", handleLogoUpdate);
    };
  }, [refreshLogo]);

  // In App.jsx, add this useEffect
  useEffect(() => {
    const initializeCart = async () => {
      if (isAuthenticated && appInitialized) {
        try {
          logger.info("Syncing cart for authenticated user...");
          await useCartStore.getState().syncCart({ force: true });
          logger.info("Cart synced successfully");
        } catch (error) {
          logger.error("Failed to sync cart:", error);
        }
      }
    };

    initializeCart();
  }, [isAuthenticated, appInitialized]);

  // Initialize app
  useEffect(() => {
    let isInitialized = false;
    let timeoutId;

    const initializeApp = async () => {
      if (isInitialized) return;
      isInitialized = true;

      try {
        logger.info("Starting app initialization...");

        timeoutId = setTimeout(() => {
          throw new Error(ERROR_MESSAGES.INITIALIZATION_TIMEOUT);
        }, INITIALIZATION_TIMEOUT);

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

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Enhanced currency change handler
  const handleCurrencyChange = useCallback(
    (currency) => {
      try {
        const rate = currencyRates[currency] || DEFAULTS.CURRENCY_RATE;
        setConversionRate(rate);
        setSelectedCurrency(currency, rate);
        localStorage.setItem("selectedCurrency", currency);
        logger.info(`Currency changed to ${currency} with rate ${rate}`);
      } catch (error) {
        logger.error(ERROR_MESSAGES.CURRENCY_CHANGE_FAILED, error);
      }
    },
    [currencyRates, setConversionRate, setSelectedCurrency]
  );

  const handleSubmit = useCallback(
    (e, itemId) => {
      e.preventDefault();

      try {
        const input = e.target.querySelector('input[name="quantity"]');
        const inputValue = input
          ? input.value.trim()
          : String(DEFAULTS.QUANTITY);

        let quantity = parseInt(inputValue, 10);
        if (isNaN(quantity) || quantity < 1) {
          quantity = DEFAULTS.QUANTITY;
        }

        // Use the enhanced updateCustomQuantity method from the store
        if (quantity >= 10) {
          updateCustomQuantity(itemId, quantity);
        } else {
          updateQuantity(itemId, quantity);
        }

        logger.debug(`Cart quantity updated for item ${itemId}: ${quantity}`);
      } catch (error) {
        logger.error(ERROR_MESSAGES.CART_UPDATE_FAILED, error);
        // Error is already handled by the store and will show in notifications
      }
    },
    [updateQuantity, updateCustomQuantity]
  );

  const handleDelete = useCallback(
    async (itemId) => {
      try {
        removeItem(itemId);
        logger.debug(`Item ${itemId} removed from cart`);
      } catch (error) {
        logger.error("Failed to remove item from cart:", error);
      }
    },
    [removeItem]
  );

  const cartItemCount = (() => {
    try {
      return cartItems.reduce((total, item) => {
        const quantity =
          quantityTenPlus[item._id] ?? selectedQuantities[item._id] ?? 1;
        return total + (typeof quantity === "number" ? quantity : 1);
      }, 0);
    } catch (error) {
      logger.error(ERROR_MESSAGES.CART_COUNT_CALCULATION_FAILED, error);
      return DEFAULTS.CART_COUNT;
    }
  })();

  // Enhanced navbar renderer
  const renderNavbar = useCallback(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      return null;
    }

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
  }, [
    location.pathname,
    cartItemCount,
    logoImage,
    isAdminRoute,
    needsSetup,
    user,
    selectedCurrency,
    currencyRates,
    handleCurrencyChange,
    appInitialized,
    geoLocation,
  ]);

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

  if (!authInitialized || !isAuthReady) {
    return <AppSkeleton message={LOADING_MESSAGES.AUTH} />;
  }

  if (isAdminRoute && setupLoading && !appInitialized) {
    return <AdminSkeleton />;
  }

  // Handle admin setup flow
  if (isAdminRoute && needsSetup) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<AdminSkeleton />}>
          <AdminRoutes count={5} logo={logoImage} />
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
      cartItemsCount: cartItems.length,
      cartError: !!cartError,
    });
  }

  // Main application render
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ToastContainer {...TOAST_CONFIG} />

      {location.pathname.includes("/admin") ? (
        <Suspense fallback={<AdminSkeleton />}>
          <AdminRoutes count={5} logo={logoImage} />
        </Suspense>
      ) : (
        <>
          {renderNavbar()}
          <main className="main">
            <Suspense>
              <AppRoutes
                addToCart={addToCart}
                cartItems={cartItems}
                selectedQuantities={selectedQuantities}
                quantityTenPlus={quantityTenPlus}
                handleSubmit={handleSubmit}
                setCartItems={setCartItems}
                handleDelete={handleDelete}
                selectedCurrency={selectedCurrency}
                conversionRate={conversionRate}
                isAuthenticated={isAuthenticated}
                user={user}
                isLoggedIn={user}
                companyName={companyName}
              />
            </Suspense>
          </main>

          {location.pathname !== "/login" &&
            location.pathname !== "/register" && (
              <Suspense fallback={<div className="footer-skeleton" />}>
                <Footer logoImage={logoImage} />
              </Suspense>
            )}
        </>
      )}
    </ErrorBoundary>
  );
}

export default App;

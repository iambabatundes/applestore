// /store/currencyStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { logger } from "../utils/logger";

// Configuration
const CURRENCY_CONFIG = {
  API_URL: import.meta.env.VITE_CURRENCY_API,
  FALLBACK_RATES: {
    NGN: 1,
    USD: 0.0011,
    GBP: 0.00087,
    EUR: 0.001,
    CNY: 0.008,
  },
  ALLOWED_CURRENCIES: ["NGN", "USD", "GBP", "EUR", "CNY"],
  CACHE_DURATION: 3600000, // 1 hour in milliseconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 10000, // 10 seconds
};

// Validation helpers
const validateCurrencyCode = (code) => {
  return CURRENCY_CONFIG.ALLOWED_CURRENCIES.includes(code?.toUpperCase());
};

const validateExchangeRates = (rates) => {
  if (!rates || typeof rates !== "object") {
    throw new Error("Invalid exchange rates format");
  }

  // Check required base rates
  const requiredCurrencies = CURRENCY_CONFIG.ALLOWED_CURRENCIES;
  const missingCurrencies = requiredCurrencies.filter(
    (currency) => rates[currency] === undefined
  );

  if (missingCurrencies.length > 0) {
    logger.warn(
      `Missing rates for currencies: ${missingCurrencies.join(", ")}`
    );
  }

  // Validate rate values
  for (const [currency, rate] of Object.entries(rates)) {
    if (typeof rate !== "number" || rate <= 0 || !isFinite(rate)) {
      throw new Error(`Invalid rate for ${currency}: ${rate}`);
    }
  }

  return true;
};

// API service with retry logic
const fetchCurrencyRatesWithRetry = async (retryCount = 0) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CURRENCY_CONFIG.TIMEOUT
    );

    const response = await fetch(CURRENCY_CONFIG.API_URL, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Validate API response structure
    if (!data.conversion_rates || typeof data.conversion_rates !== "object") {
      throw new Error("Invalid API response structure");
    }

    validateExchangeRates(data.conversion_rates);

    return {
      success: true,
      data: data.conversion_rates,
      timestamp: Date.now(),
      source: "api",
    };
  } catch (error) {
    logger.error(`Currency API attempt ${retryCount + 1} failed:`, error);

    if (retryCount < CURRENCY_CONFIG.MAX_RETRIES) {
      await new Promise((resolve) =>
        setTimeout(resolve, CURRENCY_CONFIG.RETRY_DELAY * (retryCount + 1))
      );
      return fetchCurrencyRatesWithRetry(retryCount + 1);
    }

    return {
      success: false,
      error: error.message,
      data: CURRENCY_CONFIG.FALLBACK_RATES,
      timestamp: Date.now(),
      source: "fallback",
    };
  }
};

// Cache management
const isCacheValid = (timestamp) => {
  if (!timestamp) return false;
  return Date.now() - timestamp < CURRENCY_CONFIG.CACHE_DURATION;
};

export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      // State
      currencyRates: CURRENCY_CONFIG.FALLBACK_RATES,
      selectedCurrency: "NGN",
      conversionRate: 1,
      error: null,
      loading: false,
      lastUpdated: null,
      ratesSource: "initial", // "api", "cache", "fallback"
      isOnline: true,
      userPreferences: {
        autoDetect: true,
        showSymbols: true,
        formatStyle: "standard", // "standard", "compact", "locale"
      },

      // Actions
      setOnlineStatus: (isOnline) => set({ isOnline }),

      setUserPreferences: (preferences) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        })),

      fetchCurrencyRates: async (forceRefresh = false) => {
        const state = get();

        // Check cache validity
        if (!forceRefresh && isCacheValid(state.lastUpdated)) {
          logger.info("Using cached currency rates");
          return { success: true, source: "cache" };
        }

        set({ loading: true, error: null });

        try {
          const result = await fetchCurrencyRatesWithRetry();

          if (result.success) {
            const filteredRates = Object.fromEntries(
              Object.entries(result.data).filter(([currency]) =>
                CURRENCY_CONFIG.ALLOWED_CURRENCIES.includes(currency)
              )
            );

            // Merge with fallback rates for any missing currencies
            const mergedRates = {
              ...CURRENCY_CONFIG.FALLBACK_RATES,
              ...filteredRates,
            };

            set({
              currencyRates: mergedRates,
              lastUpdated: result.timestamp,
              ratesSource: result.source,
              loading: false,
              error: null,
            });

            // Update conversion rate for selected currency
            get().updateConversionRate();

            logger.info(`Currency rates updated from ${result.source}`);
            return { success: true, source: result.source };
          } else {
            // Use fallback rates
            set({
              currencyRates: result.data,
              lastUpdated: result.timestamp,
              ratesSource: "fallback",
              loading: false,
              error: "Using fallback rates: " + result.error,
            });

            logger.warn("Using fallback currency rates:", result.error);
            return { success: false, source: "fallback", error: result.error };
          }
        } catch (error) {
          logger.error("Critical currency fetch error:", error);

          set({
            error: "Failed to fetch currency rates",
            loading: false,
            ratesSource: "error",
          });

          return { success: false, source: "error", error: error.message };
        }
      },

      setSelectedCurrency: (currency) => {
        if (!validateCurrencyCode(currency)) {
          logger.error(`Attempted to set invalid currency: ${currency}`);
          return false;
        }

        const state = get();
        const rate = state.currencyRates[currency] || 1;

        set({
          selectedCurrency: currency,
          conversionRate: rate,
        });

        // Persist user preference
        localStorage.setItem("selectedCurrency", currency);

        logger.info(`Currency changed to: ${currency} (rate: ${rate})`);
        return true;
      },

      updateConversionRate: () => {
        const state = get();
        const rate = state.currencyRates[state.selectedCurrency] || 1;

        if (state.conversionRate !== rate) {
          set({ conversionRate: rate });
        }
      },

      convertAmount: (amount, fromCurrency = "NGN", toCurrency = null) => {
        const state = get();
        const targetCurrency = toCurrency || state.selectedCurrency;

        if (
          !validateCurrencyCode(fromCurrency) ||
          !validateCurrencyCode(targetCurrency)
        ) {
          logger.error(
            `Invalid currency conversion: ${fromCurrency} -> ${targetCurrency}`
          );
          return amount;
        }

        const fromRate = state.currencyRates[fromCurrency] || 1;
        const toRate = state.currencyRates[targetCurrency] || 1;

        if (fromRate === 0) {
          logger.error(`Zero rate for currency: ${fromCurrency}`);
          return amount;
        }

        // Convert from source currency to NGN (base), then to target currency
        const amountInNGN = amount / fromRate;
        const convertedAmount = amountInNGN * toRate;

        return parseFloat(convertedAmount.toFixed(4));
      },

      formatCurrency: (amount, currency = null, options = {}) => {
        const state = get();
        const targetCurrency = currency || state.selectedCurrency;

        if (!validateCurrencyCode(targetCurrency)) {
          return `${amount}`;
        }

        const {
          showSymbol = state.userPreferences.showSymbols,
          decimals = 2,
          locale = "en-US",
          compact = false,
        } = options;

        const convertedAmount = get().convertAmount(
          amount,
          "NGN",
          targetCurrency
        );

        // Use Intl.NumberFormat for proper locale formatting
        try {
          const formatter = new Intl.NumberFormat(locale, {
            style: showSymbol ? "currency" : "decimal",
            currency: targetCurrency,
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            notation: compact ? "compact" : "standard",
          });

          return formatter.format(convertedAmount);
        } catch (error) {
          logger.warn("Intl formatting failed, using fallback:", error);

          // Fallback formatting
          const formattedAmount = convertedAmount.toLocaleString(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });

          if (showSymbol) {
            const symbols = {
              NGN: "₦",
              USD: "$",
              GBP: "£",
              EUR: "€",
              CNY: "¥",
            };
            const symbol = symbols[targetCurrency] || targetCurrency;
            return `${symbol}${formattedAmount}`;
          }

          return formattedAmount;
        }
      },

      getCurrencyInfo: (currency = null) => {
        const targetCurrency = currency || get().selectedCurrency;

        if (!validateCurrencyCode(targetCurrency)) {
          return null;
        }

        const state = get();
        const rate = state.currencyRates[targetCurrency] || 1;

        return {
          code: targetCurrency,
          symbol:
            { NGN: "₦", USD: "$", GBP: "£", EUR: "€", CNY: "¥" }[
              targetCurrency
            ] || targetCurrency,
          rate: rate,
          lastUpdated: state.lastUpdated,
          source: state.ratesSource,
          isFallback: state.ratesSource === "fallback",
          formattedRate: `1 NGN = ${rate.toFixed(4)} ${targetCurrency}`,
        };
      },

      initializeCurrency: async () => {
        const geoLocation =
          JSON.parse(localStorage.getItem("geoLocation")) || {};
        const geoCurrency = geoLocation.currency;
        const storedCurrency = localStorage.getItem("selectedCurrency");

        // Determine initial currency
        let initialCurrency = storedCurrency || "NGN";

        if (
          get().userPreferences.autoDetect &&
          geoCurrency &&
          validateCurrencyCode(geoCurrency)
        ) {
          initialCurrency = geoCurrency;
        }

        // Set initial currency
        set({ selectedCurrency: initialCurrency });

        // Fetch rates (with cache check)
        const fetchResult = await get().fetchCurrencyRates();

        if (!fetchResult.success && fetchResult.source === "error") {
          logger.error("Failed to initialize currency store");
        }

        // Set up periodic refresh (every hour)
        if (typeof window !== "undefined") {
          setInterval(() => {
            if (get().isOnline) {
              get().fetchCurrencyRates(true); // Force refresh
            }
          }, CURRENCY_CONFIG.CACHE_DURATION);
        }

        // Monitor online status
        if (typeof window !== "undefined") {
          window.addEventListener("online", () => {
            set({ isOnline: true });
            get().fetchCurrencyRates(true);
          });

          window.addEventListener("offline", () => {
            set({ isOnline: false });
          });
        }

        return {
          currency: initialCurrency,
          source: fetchResult.source,
          ratesAvailable: fetchResult.success,
        };
      },

      // Utility methods
      getAllCurrencies: () => {
        return CURRENCY_CONFIG.ALLOWED_CURRENCIES.map((code) => ({
          code,
          name: {
            NGN: "Nigerian Naira",
            USD: "US Dollar",
            GBP: "British Pound",
            EUR: "Euro",
            CNY: "Chinese Yuan",
          }[code],
          symbol: { NGN: "₦", USD: "$", GBP: "£", EUR: "€", CNY: "¥" }[code],
          rate: get().currencyRates[code] || 1,
        }));
      },

      getExchangeRate: (fromCurrency, toCurrency) => {
        if (
          !validateCurrencyCode(fromCurrency) ||
          !validateCurrencyCode(toCurrency)
        ) {
          return 1;
        }

        const rates = get().currencyRates;
        const fromRate = rates[fromCurrency] || 1;
        const toRate = rates[toCurrency] || 1;

        return fromRate === 0 ? 1 : toRate / fromRate;
      },

      // Reset to defaults
      resetCurrencyStore: () => {
        set({
          selectedCurrency: "NGN",
          conversionRate: 1,
          userPreferences: {
            autoDetect: true,
            showSymbols: true,
            formatStyle: "standard",
          },
        });

        localStorage.removeItem("selectedCurrency");
        get().fetchCurrencyRates(true);
      },
    }),
    {
      name: "currency-store",
      version: 2,
      getStorage: () => localStorage,
      migrate: (persistedState, version) => {
        if (version === 0 || version === 1) {
          return {
            ...persistedState,
            userPreferences: {
              autoDetect: true,
              showSymbols: true,
              formatStyle: "standard",
            },
            ratesSource: "initial",
            isOnline: true,
            lastUpdated: Date.now(),
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        selectedCurrency: state.selectedCurrency,
        currencyRates: state.currencyRates,
        userPreferences: state.userPreferences,
        lastUpdated: state.lastUpdated,
        ratesSource: state.ratesSource,
      }),
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGeoLocationStore } from "./geoLocationStore";

const currencyApi = import.meta.env.VITE_CURRENCY_API;

const allowedCurrencies = ["NGN", "USD", "GBP", "EUR", "CNY"];

export const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currencyRates: {},
      selectedCurrency: "NGN",
      conversionRate: 1,
      errorCurrency: null,
      loadingCurrency: true,

      fetchCurrencyRates: async () => {
        set({ loadingCurrency: true });
        try {
          const response = await fetch(currencyApi);
          if (!response.ok) throw new Error("Failed to fetch currency data.");

          const data = await response.json();
          console.log("Currency API Response:", data); // Debugging

          const geoCurrency =
            useGeoLocationStore.getState().geoLocation.currency;

          //   const geoCurrency =
          //     useGeoLocationStore.getState().geoLocation.currency;
          //   const validCurrencies = [...allowedCurrencies, geoCurrency].filter(
          //     Boolean
          //   );

          // Ensure detected currency is valid
          const validCurrencies = [...allowedCurrencies, geoCurrency].filter(
            Boolean
          );
          if (!validCurrencies.includes(geoCurrency)) {
            console.warn(
              `Detected currency (${geoCurrency}) is not in the allowed list.`
            );
          }

          // Filter rates to only include allowed currencies
          const filteredRates = Object.fromEntries(
            Object.entries(data.conversion_rates).filter(([currency]) =>
              validCurrencies.includes(currency)
            )
          );

          set({
            currencyRates: filteredRates,
            errorCurrency: null,
            loadingCurrency: false,
          });

          const selectedCurrency = get().selectedCurrency;
          if (filteredRates[selectedCurrency]) {
            set({ conversionRate: filteredRates[selectedCurrency] });
          }
        } catch (err) {
          console.error("Error fetching currency rates:", err);
          set({
            errorCurrency: "Failed to load currency data.",
            loadingCurrency: false,
          });
        }
      },

      setSelectedCurrency: (currency) => {
        const rate = get().currencyRates[currency] || 1;
        set({ selectedCurrency: currency, conversionRate: rate });
      },

      initializeCurrency: () => {
        const geoCurrency =
          JSON.parse(localStorage.getItem("geoLocation"))?.currency || "NGN";
        const storedCurrency = localStorage.getItem("selectedCurrency");

        const finalCurrency = storedCurrency || geoCurrency;
        set({ selectedCurrency: finalCurrency });

        if (!Object.keys(get().currencyRates).length) {
          get().fetchCurrencyRates();
        } else {
          set({
            conversionRate: get().currencyRates[finalCurrency] || 1,
            loadingCurrency: false,
          });
        }
      },
    }),
    {
      name: "currency-store",
      getStorage: () => localStorage,
    }
  )
);

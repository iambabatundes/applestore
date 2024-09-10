import React, { createContext, useState, useEffect, useMemo } from "react";
import { useGeoLocation } from "../hooks/useGeoLocation";

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ user, children }) => {
  const [currencyRates, setCurrencyRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [conversionRate, setConversionRate] = useState(1);
  const [error, setError] = useState(null);

  const {
    geoData,
    conversionRate: geoConversionRate,
    error: geoError,
  } = useGeoLocation(user);

  // Function to fetch currency rates
  const fetchCurrencyRates = async () => {
    try {
      const response = await fetch(
        "https://v6.exchangerate-api.com/v6/6991faf3937f8f0023aff58c/latest/NGN"
      );

      if (!response.ok) throw new Error("Failed to fetch currency data.");

      const data = await response.json();

      // Filter the currencies to include only the selected ones
      const selectedCurrencies = ["NGN", "USD", "EUR", "GBP", "JPY", "INR"];
      const filteredRates = Object.keys(data.conversion_rates)
        .filter((key) => selectedCurrencies.includes(key))
        .reduce((obj, key) => {
          obj[key] = data.conversion_rates[key];
          return obj;
        }, {});

      setCurrencyRates(filteredRates);
      setError(null); // Reset error if successful
    } catch (error) {
      console.error("Error fetching currency data:", error);
      setError("Failed to load currency data. Please try again later.");
    }
  };

  // Fetch currency rates on mount
  useEffect(() => {
    fetchCurrencyRates();
  }, []);

  // Function to handle currency updates based on geoData or user preferences
  const updateCurrency = () => {
    if (geoData.currency && !user?.preferredCurrency) {
      setSelectedCurrency(geoData.currency);
      const rate = geoConversionRate || currencyRates[geoData.currency] || 1;
      setConversionRate(rate);
    } else if (user?.preferredCurrency) {
      setSelectedCurrency(user.preferredCurrency);
      const rate = currencyRates[user.preferredCurrency] || 1;
      setConversionRate(rate);
    }
  };

  useEffect(() => {
    if (Object.keys(currencyRates).length > 0) {
      updateCurrency();
    }
  }, [geoData, user, currencyRates, geoConversionRate]);

  // Load saved currency and rate from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    const savedRate = localStorage.getItem("conversionRate");

    if (savedCurrency && savedRate) {
      setSelectedCurrency(savedCurrency);
      setConversionRate(parseFloat(savedRate));
    }
  }, []);

  // Handle manual currency change
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    const rate = currencyRates[currency] || 1;
    setConversionRate(rate);

    localStorage.setItem("selectedCurrency", currency);
    localStorage.setItem("conversionRate", rate);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("preferredCurrency", selectedCurrency);
    }
  }, [selectedCurrency, user]);

  // Add a mechanism to refresh currency rates every 24 hours
  useEffect(() => {
    const fetchRates = async () => {
      const lastFetched = localStorage.getItem("lastFetched");
      const now = new Date().getTime();

      if (!lastFetched || now - lastFetched > 24 * 60 * 60 * 1000) {
        await fetchCurrencyRates();
        localStorage.setItem("lastFetched", now);
      }
    };

    fetchRates();
  }, []);

  // Sync currency changes across multiple tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "selectedCurrency") {
        setSelectedCurrency(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Memoize values to prevent unnecessary re-renders
  const memoizedCurrencyRates = useMemo(() => currencyRates, [currencyRates]);
  const memoizedConversionRate = useMemo(
    () => conversionRate,
    [conversionRate]
  );

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        conversionRate: memoizedConversionRate,
        currencyRates: memoizedCurrencyRates,
        handleCurrencyChange,
      }}
    >
      {error && (
        <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
      )}
      {geoError && (
        <div style={{ color: "red", marginBottom: "20px" }}>{geoError}</div>
      )}

      {children}
    </CurrencyContext.Provider>
  );
};

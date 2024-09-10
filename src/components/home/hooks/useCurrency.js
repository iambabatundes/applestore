import { useState, useEffect, useMemo } from "react";
import config from "../../../config.json";

export function useCurrency(defaultCurrency = "NGN", onCurrencyChange, user) {
  const [currencyRates, setCurrencyRates] = useState({});
  const [conversionRate, setConversionRate] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the conversion rates on mount

  const fetchCurrencyRates = async () => {
    setLoading(true); // Start loading

    setLoading(true); // Start loading
    try {
      const now = new Date().getTime();
      const lastFetched = localStorage.getItem("lastFetched");
      const cachedRates = localStorage.getItem("currencyRates");

      // Check if data in localStorage is less than 24 hours old
      if (
        cachedRates &&
        lastFetched &&
        now - lastFetched < 24 * 60 * 60 * 1000
      ) {
        setCurrencyRates(JSON.parse(cachedRates));
        setLoading(false);
        return;
      }

      const response = await fetch(config.currencyApi);
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

      // Store the filtered rates in state and localStorage
      setCurrencyRates(filteredRates);
      localStorage.setItem("currencyRates", JSON.stringify(filteredRates));
      localStorage.setItem("lastFetched", now);
      setError(null);
    } catch (error) {
      console.error("Error fetching currency data:", error);
      setError("Failed to load currency data. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchCurrencyRates();
  }, []);

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

  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    const savedRate = localStorage.getItem("conversionRate");

    if (savedCurrency && savedRate) {
      setSelectedCurrency(savedCurrency);
      setConversionRate(parseFloat(savedRate));
    }
  }, []);

  // Handle currency changes
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    const rate = currencyRates[currency] || 1;
    setConversionRate(rate);
    onCurrencyChange(currency, rate);

    // Store in localStorage
    localStorage.setItem("selectedCurrency", currency);
    localStorage.setItem("conversionRate", rate);

    // Broadcast the currency change to other tabs
    const channel = new BroadcastChannel("currency");
    channel.postMessage({ currency });
  };

  // Sync currency changes across multiple tabs using the BroadcastChannel API
  useEffect(() => {
    const channel = new BroadcastChannel("currency");
    channel.onmessage = (event) => {
      if (event.data.currency) {
        setSelectedCurrency(event.data.currency);
      }
    };
    return () => channel.close();
  }, []);

  // If a user is logged in, store the preferred currency
  useEffect(() => {
    if (user) {
      localStorage.setItem("preferredCurrency", selectedCurrency);
    }
  }, [selectedCurrency, user]);

  // Automatically refresh currency rates every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrencyRates();
    }, 1000 * 60 * 10); // Every 10 minutes

    return () => clearInterval(interval);
  }, []);

  // Memoize values to prevent unnecessary re-renders
  const memoizedCurrencyRates = useMemo(() => currencyRates, [currencyRates]);
  const memoizedConversionRate = useMemo(
    () => conversionRate,
    [conversionRate]
  );

  return {
    selectedCurrency,
    conversionRate: memoizedConversionRate,
    currencyRates: memoizedCurrencyRates,
    handleCurrencyChange,
    onCurrencyChange,
    error,
    loading,
  };
}

import { useState, useEffect, useMemo } from "react";
import config from "../../../config.json";

export function useCurrency(onCurrencyChange) {
  const [currencyRates, setCurrencyRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [conversionRate, setConversionRate] = useState(1);
  const [errorCurrency, setErrorCurrency] = useState(null);
  const [loadingCurrency, setLoadingCurrency] = useState(true);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      setLoadingCurrency(true);
      try {
        const response = await fetch(config.currencyApi);
        if (!response.ok) throw new Error("Failed to fetch currency data.");

        const data = await response.json();
        setCurrencyRates(data.conversion_rates);
        localStorage.setItem(
          "currencyRates",
          JSON.stringify(data.conversion_rates)
        );
        setErrorCurrency(null);
      } catch (err) {
        console.error("Error fetching currency rates:", err);
        setErrorCurrency("Failed to load currency data.");
      } finally {
        setLoadingCurrency(false);
      }
    };

    const cachedRates = localStorage.getItem("currencyRates");
    if (cachedRates) {
      setCurrencyRates(JSON.parse(cachedRates));
      setLoadingCurrency(false);
    } else {
      fetchCurrencyRates();
    }
  }, []);

  useEffect(() => {
    const detectedCurrency =
      JSON.parse(localStorage.getItem("geoLocation"))?.currency || "USD";
    setSelectedCurrency(detectedCurrency);
  }, []);

  useEffect(() => {
    if (selectedCurrency && currencyRates[selectedCurrency]) {
      setConversionRate(currencyRates[selectedCurrency]);
    } else {
      setConversionRate(1); // Default to 1 if rate not found
    }
  }, [selectedCurrency, currencyRates]);

  // const handleCurrencyChange = (currency) => {
  //   setSelectedCurrency(currency);
  //   const rate = currencyRates[currency] || 1;
  //   setConversionRate(rate);
  //   onCurrencyChange(currency, rate);
  //   localStorage.setItem("selectedCurrency", currency);
  // };

  return {
    selectedCurrency,
    conversionRate,
    currencyRates,
    // handleCurrencyChange,
    errorCurrency,
    loadingCurrency,
    setSelectedCurrency,
    setConversionRate,
  };
}

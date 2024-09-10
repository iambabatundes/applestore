import { useState, useEffect } from "react";

export function useGeoLocation(user) {
  const [geoData, setGeoData] = useState({ country: "", currency: "" });
  const [conversionRate, setConversionRate] = useState(1); // Default conversion rate
  const [error, setError] = useState(null); // Error state to track any issues

  useEffect(() => {
    if (!user) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.ipgeolocation.io/ipgeo?apiKey=YOUR_API_KEY&lat=${latitude}&long=${longitude}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch geolocation data.");
            }
            const data = await response.json();
            const country = data.country_name;
            const currency = data.currency.code;

            setGeoData({ country, currency });

            // Fetch conversion rate (base currency can be 'NGN' or any default)
            const conversionResponse = await fetch(
              `https://api.exchangerate-api.com/v4/latest/${currency}`
            );
            if (!conversionResponse.ok) {
              throw new Error("Failed to fetch conversion rate data.");
            }
            const conversionData = await conversionResponse.json();
            const conversionRateToNGN = conversionData.rates?.["NGN"] ?? 1;

            setConversionRate(conversionRateToNGN);
            setError(null); // Reset any previous errors
          } catch (err) {
            console.error(
              "Error fetching geolocation or conversion data:",
              err
            );
            setError("Unable to retrieve location or currency data.");
          }
        },
        (geoError) => {
          console.error("Error getting user's location:", geoError);
          setError("Location access denied or unavailable.");
        }
      );
    }
  }, [user]);

  return { geoData, conversionRate, error };
}

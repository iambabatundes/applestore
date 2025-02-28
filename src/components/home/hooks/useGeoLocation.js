import { useState, useEffect } from "react";

export function useGeoLocation() {
  const [geoLocation, setGeoLocation] = useState({ country: "", currency: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error("Failed to fetch location data.");

        const data = await response.json();
        setGeoLocation({
          country: data.country_name,
          currency: data.currency,
        });

        // Store in localStorage to reduce API calls
        localStorage.setItem("geoLocation", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching geolocation:", err);
        setError("Could not fetch location data.");
      } finally {
        setLoading(false);
      }
    };

    const cachedLocation = localStorage.getItem("geoLocation");
    if (cachedLocation) {
      setGeoLocation(JSON.parse(cachedLocation));
      setLoading(false);
    } else {
      fetchGeoLocation();
    }
  }, []);

  return { geoLocation, loading, error };
}

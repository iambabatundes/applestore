import { useState, useEffect } from "react";

export function useGeoLocation(user) {
  const [geoLocation, setGeoLocation] = useState("");

  useEffect(() => {
    if (!user) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.ipgeolocation.io/ipgeo?apiKey=74d7025b99284e5ab87ede8a6b623e9b&lat=${latitude}&long=${longitude}`
            );
            const data = await response.json();
            setGeoLocation(data.country_name);
          } catch (error) {
            console.error("Error fetching geolocation data: ", error);
          }
        },
        (error) => {
          console.error("Error getting user's location: ", error);
        }
      );
    }
  }, [user]);

  return geoLocation;
}

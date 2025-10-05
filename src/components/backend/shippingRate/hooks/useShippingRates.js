import { useState } from "react";
import { getAddressFromCoordinates } from "../utils/geoUtils";
import { getShippingRates } from "../../../../services/shippingService";
import { toast } from "react-toastify";

export function useShippingRates() {
  const [shippingRates, setShippingRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShippingRates = async () => {
    setLoading(true);
    setError(null);
    try {
      const shippingRates = await getShippingRates();

      // Handle geocoding errors gracefully
      const ratesWithAddresses = await Promise.all(
        shippingRates.map(async (rate) => {
          try {
            const address = await getAddressFromCoordinates(
              rate.storeLocation.lat,
              rate.storeLocation.lon
            );
            return { ...rate, address };
          } catch (error) {
            // If geocoding fails, return rate without address
            console.warn("Failed to geocode rate:", rate._id, error);
            return { ...rate, address: "Address not available" };
          }
        })
      );
      setShippingRates(ratesWithAddresses);
    } catch (error) {
      console.error("Error fetching shipping rates:", error);

      if (error.response?.status === 500 || !error.response) {
        setError(error);
        toast.error("Failed to load shipping rates");
      } else {
        setShippingRates([]);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    shippingRates,
    loading,
    error,
    setShippingRates,
    fetchShippingRates,
  };
}

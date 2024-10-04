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
    try {
      const { data: shippingRates } = await getShippingRates();
      const ratesWithAddresses = await Promise.all(
        shippingRates.map(async (rate) => {
          const address = await getAddressFromCoordinates(
            rate.storeLocation.lat,
            rate.storeLocation.lon
          );
          return { ...rate, address };
        })
      );
      setShippingRates(ratesWithAddresses);
    } catch (error) {
      setError(error);
      toast.error("Failed to load shipping rates");
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

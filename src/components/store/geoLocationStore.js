import { create } from "zustand";
import { getGeoLocations } from "../../services/geoLocationService";

export const useGeoLocationStore = create((set) => ({
  geoLocation: { country: "", currency: "" },
  loading: true,
  error: null,

  fetchGeoLocation: async () => {
    try {
      const { data } = await getGeoLocations();
      console.log("GeoLocation API Response:", data);

      if (!data.currency) throw new Error("Currency not found in response");

      set({
        geoLocation: {
          country: data.country_name,
          currency: data.currency,
        },
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching geolocation:", error);
      set({ error: "Could not fetch location data.", loading: false });
    }
  },
}));

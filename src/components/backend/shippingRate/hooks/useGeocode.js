import axios from "axios";

export const useGeocode = () => {
  const getCoordinates = async (storeName) => {
    const apiKey = "your_api_key_here";
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        storeName
      )}&key=${apiKey}`
    );
    if (response.data && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lon: lng };
    } else {
      throw new Error("No coordinates found");
    }
  };

  const fetchLocationSuggestions = async (query) => {
    const apiKey = "your_api_key_here";
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    );
    if (response.data && response.data.results.length > 0) {
      return response.data.results.map((result) => result.formatted);
    }
    return [];
  };

  return { getCoordinates, fetchLocationSuggestions };
};

import axios from "axios";

export const getAddressFromCoordinates = async (lat, lon) => {
  try {
    const apiKey = "e62227997ef1470d95fa3a67338d71f0";
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`
    );

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const { formatted } = response.data.results[0];
      return formatted;
    }
    return "Address not available";
  } catch (error) {
    console.error("Error fetching address:", error);

    // Check if it's an auth error
    if (error.response?.status === 401) {
      console.error("OpenCage API key is invalid or quota exceeded");
    }

    return "Address not available"; // Return fallback instead of crashing
  }
};

export const getCoordinates = async (storeName) => {
  try {
    const apiKey = "e62227997ef1470d95fa3a67338d71f0";
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        storeName
      )}&key=${apiKey}`
    );

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lon: lng };
    } else {
      throw new Error("No coordinates found");
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    throw new Error("Geocoding failed");
  }
};

export const fetchLocationSuggestions = async ({
  query,
  setLocationSuggestions,
}) => {
  try {
    const apiKey = "e62227997ef1470d95fa3a67338d71f0";
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    );

    if (response.data && response.data.results.length > 0) {
      setLocationSuggestions(
        response.data.results.map((result) => result.formatted)
      );
    }
  } catch (error) {
    console.error("Failed to fetch location suggestions:", error);
  }
};

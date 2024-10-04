import axios from "axios";

export const getAddressFromCoordinates = async (lat, lon) => {
  try {
    const apiKey = "6caceb376bd94337be94112f6e9dfc9a";
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`
    );
    const { formatted } = response.data.results[0];
    return formatted;
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Unknown Address";
  }
};

export const getCoordinates = async (storeName) => {
  try {
    const apiKey = "d6b91191327c4224b64fed489e5a4207";
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
    const apiKey = "0636d54539ea4a298f36acf75edcf3c8";
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

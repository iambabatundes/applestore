import { publicHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/geolocation`;

export async function getGeoLocations() {
  try {
    return publicHttpService.get(apiEndPoint);
  } catch (err) {
    console.error("Failed to fetch geolocations:", err);
    throw err;
  }
}

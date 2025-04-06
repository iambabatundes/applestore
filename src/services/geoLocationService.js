import http from "../services/httpService";

const apiEndPoint = import.meta.env.VITE_APIURL + "geolocation";

export function getGeoLocations() {
  return http.get(apiEndPoint);
}

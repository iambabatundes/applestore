import { publicHttpService } from "./http/index.js";

const buildEndpoint = (path = "") => `/api/geolocation${path}`;

export async function getGeoLocations(params = {}) {
  try {
    return await publicHttpService.get(buildEndpoint(), { params });
  } catch (err) {
    console.error("Failed to fetch geolocations:", err);
    throw err;
  }
}

export async function getGeoLocation(locationId) {
  try {
    return await publicHttpService.get(buildEndpoint(`/${locationId}`));
  } catch (err) {
    console.error("Failed to fetch geolocation:", err);
    throw err;
  }
}

export async function getGeoLocationsByCountry(countryCode, params = {}) {
  try {
    return await publicHttpService.get(
      buildEndpoint(`/country/${countryCode}`),
      { params }
    );
  } catch (err) {
    console.error("Failed to fetch geolocations by country:", err);
    throw err;
  }
}

export async function getGeoLocationsByRegion(region, params = {}) {
  try {
    return await publicHttpService.get(buildEndpoint(`/region/${region}`), {
      params,
    });
  } catch (err) {
    console.error("Failed to fetch geolocations by region:", err);
    throw err;
  }
}

export async function getNearbyLocations(
  latitude,
  longitude,
  radius = 10,
  params = {}
) {
  try {
    const searchParams = {
      lat: latitude,
      lng: longitude,
      radius,
      ...params,
    };
    return await publicHttpService.get(buildEndpoint("/nearby"), {
      params: searchParams,
    });
  } catch (err) {
    console.error("Failed to fetch nearby locations:", err);
    throw err;
  }
}

export async function searchGeoLocations(query, params = {}) {
  try {
    const searchParams = {
      q: query,
      ...params,
    };
    return await publicHttpService.get(buildEndpoint("/search"), {
      params: searchParams,
    });
  } catch (err) {
    console.error("Failed to search geolocations:", err);
    throw err;
  }
}

// Geocoding functions
export async function geocodeAddress(address) {
  try {
    return await publicHttpService.post(buildEndpoint("/geocode"), { address });
  } catch (err) {
    console.error("Failed to geocode address:", err);
    throw err;
  }
}

export async function reverseGeocode(latitude, longitude) {
  try {
    return await publicHttpService.post(buildEndpoint("/reverse-geocode"), {
      lat: latitude,
      lng: longitude,
    });
  } catch (err) {
    console.error("Failed to reverse geocode:", err);
    throw err;
  }
}

// Cached geolocation service with browser geolocation integration
export class GeoLocationManager {
  constructor() {
    this.currentPosition = null;
    this.watchId = null;
  }

  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000, // 5 minutes
    };

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = position;
          resolve(position);
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        { ...defaultOptions, ...options }
      );
    });
  }

  async getNearbyLocationsFromCurrentPosition(radius = 10) {
    if (!this.currentPosition) {
      await this.getCurrentPosition();
    }

    const { latitude, longitude } = this.currentPosition.coords;
    return getNearbyLocations(latitude, longitude, radius);
  }

  startWatchingPosition(callback, options = {}) {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser");
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = position;
        callback(position);
      },
      (error) => {
        console.error("Geolocation watch error:", error);
        callback(null, error);
      },
      options
    );

    return this.watchId;
  }

  stopWatchingPosition() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}

// Export singleton instance
export const geoLocationManager = new GeoLocationManager();

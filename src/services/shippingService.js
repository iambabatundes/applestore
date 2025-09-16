import {
  publicHttpService,
  adminHttpService,
  userHttpService,
} from "./http/index.js";

const shippingRatesPath = "/api/shipping-rates";

function shippingRateUrl(id) {
  return `${shippingRatesPath}/${id}`;
}

// Public functions - viewing shipping rates and calculating costs
export async function getShippingRates() {
  try {
    const { data } = await publicHttpService.get(shippingRatesPath);
    return data;
  } catch (err) {
    console.error("Failed to fetch shipping rates:", err);
    throw err;
  }
}

export async function getShippingRate(shippingId) {
  try {
    const { data } = await publicHttpService.get(shippingRateUrl(shippingId));
    return data;
  } catch (err) {
    console.error("Failed to fetch shipping rate:", err);
    throw err;
  }
}

export async function calculateShipping(destination, items, weight = null) {
  try {
    const { data } = await publicHttpService.post(
      `${shippingRatesPath}/calculate`,
      {
        destination,
        items,
        weight,
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to calculate shipping:", err);
    throw err;
  }
}

export async function getShippingRatesByRegion(region) {
  try {
    const { data } = await publicHttpService.get(
      `${shippingRatesPath}/region/${region}`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch shipping rates by region:", err);
    throw err;
  }
}

// User functions - getting personalized shipping options
export async function getUserShippingOptions(cartItems, shippingAddress) {
  try {
    const { data } = await userHttpService.post(
      `${shippingRatesPath}/options`,
      {
        items: cartItems,
        address: shippingAddress,
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to get user shipping options:", err);
    throw err;
  }
}

// Admin functions - managing shipping rates
export async function getAllShippingRates() {
  try {
    const { data } = await adminHttpService.get(shippingRatesPath);
    return data;
  } catch (err) {
    console.error("Failed to fetch all shipping rates:", err);
    throw err;
  }
}

export async function saveShippingRate(shipping) {
  try {
    const { data } = await adminHttpService.post(shippingRatesPath, shipping);
    return data;
  } catch (err) {
    console.error("Failed to save shipping rate:", err);
    throw err;
  }
}

export async function updateShippingRate(shippingId, shipping) {
  try {
    const { data } = await adminHttpService.put(
      shippingRateUrl(shippingId),
      shipping
    );
    return data;
  } catch (err) {
    console.error("Failed to update shipping rate:", err);
    throw err;
  }
}

export async function deleteShippingRate(shippingId) {
  try {
    const { data } = await adminHttpService.delete(shippingRateUrl(shippingId));
    return data;
  } catch (err) {
    console.error("Failed to delete shipping rate:", err);
    throw err;
  }
}

export async function bulkUpdateShippingRates(rates) {
  try {
    const { data } = await adminHttpService.put(`${shippingRatesPath}/bulk`, {
      rates,
    });
    return data;
  } catch (err) {
    console.error("Failed to bulk update shipping rates:", err);
    throw err;
  }
}

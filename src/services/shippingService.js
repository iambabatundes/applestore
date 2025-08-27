import { httpService, adminHttpService } from "../services/httpService";
const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/shipping-rates`;

function shippingRateUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getShippingRates() {
  try {
    const { data } = await httpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch shipping rates:", err);
    throw err;
  }
}

export async function getShippingRate(shippingId) {
  try {
    const { data } = await httpService.get(shippingRateUrl(shippingId));
    return data;
  } catch (err) {
    console.error("Failed to fetch shipping rate:", err);
    throw err;
  }
}

export async function saveShippingRate(shipping) {
  try {
    const { data } = await adminHttpService.post(apiEndPoint, shipping);
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

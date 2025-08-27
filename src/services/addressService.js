import { adminHttpService, userHttpService } from "../services/httpService";
const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/addresses`;

function addressUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getAddresses() {
  try {
    const { data } = await adminHttpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch addresses:", err);
    throw err;
  }
}

export async function getAddress(addressId) {
  try {
    const { data } = await adminHttpService.get(addressUrl(addressId));
    return data;
  } catch (err) {
    console.error("Failed to fetch address:", err);
    throw err;
  }
}

export async function getUserAddress() {
  try {
    const { data } = await userHttpService.get(`${apiEndPoint}/me`);
    return data;
  } catch (err) {
    console.error("Failed to fetch user address:", err);
    throw err;
  }
}

export async function saveAddress(address) {
  try {
    const { data } = await userHttpService.post(apiEndPoint, address);
    return data;
  } catch (err) {
    console.error("Failed to save address:", err);
    throw err;
  }
}

export async function updateAddress(addressId, address) {
  try {
    const { data } = await userHttpService.put(addressUrl(addressId), address);
    return data;
  } catch (err) {
    console.error("Failed to update address:", err);
    throw err;
  }
}

export async function deleteAddress(addressId) {
  try {
    const { data } = await adminHttpService.delete(addressUrl(addressId));
    return data;
  } catch (err) {
    console.error("Failed to delete address:", err);
    throw err;
  }
}

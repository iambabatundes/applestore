import { adminHttpService, userHttpService } from "./http/index";

// Use relative path - let services handle their base URLs
const addressesPath = "/api/addresses";

function addressUrl(id) {
  return `${addressesPath}/${id}`;
}

// Admin functions - can access all addresses
export async function getAddresses() {
  try {
    const { data } = await adminHttpService.get(addressesPath);
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

// User functions - can only access their own addresses
export async function getUserAddresses() {
  // Renamed for clarity - users typically have multiple addresses
  try {
    const { data } = await userHttpService.get(`${addressesPath}/me`);
    return data;
  } catch (err) {
    console.error("Failed to fetch user addresses:", err);
    throw err;
  }
}

export async function saveAddress(address) {
  try {
    const { data } = await userHttpService.post(addressesPath, address);
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

// Security concern: Should users be able to delete any address?
// Consider making this user-specific or admin-only
export async function deleteAddress(addressId) {
  try {
    const { data } = await userHttpService.delete(addressUrl(addressId)); // Changed to userHttpService
    return data;
  } catch (err) {
    console.error("Failed to delete address:", err);
    throw err;
  }
}

// Admin-only delete function (if needed)
export async function adminDeleteAddress(addressId) {
  try {
    const { data } = await adminHttpService.delete(addressUrl(addressId));
    return data;
  } catch (err) {
    console.error("Failed to delete address (admin):", err);
    throw err;
  }
}

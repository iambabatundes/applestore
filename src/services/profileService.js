import { userHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/users/profile`;

function createFormData(user) {
  const formData = new FormData();

  for (const key in user) {
    if (key === "_id") continue;
    if (key === "profileImage" && user[key] && user[key].file) {
      formData.append("profileImage", user[key].file);
    } else if (key === "address" && user[key]) {
      // Serialize address or flatten its fields
      formData.append("address", JSON.stringify(user[key])); // Option 1: Serialize
      // Option 2: Flatten (uncomment if server expects flat fields)
      // formData.append("addressLine", user[key].addressLine || "");
      // formData.append("city", user[key].city || "");
      // formData.append("state", user[key].state || "");
      // formData.append("country", user[key].country || "");
      // formData.append("postalCode", user[key].postalCode || "");
    } else {
      formData.append(key, user[key] || "");
    }
  }

  // Log FormData for debugging
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  return formData;
}

export async function updateUser(user) {
  try {
    const formData = createFormData(user);
    const { data } = await userHttpService.put(apiEndPoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    console.error("Failed to update user profile:", err);
    throw err;
  }
}

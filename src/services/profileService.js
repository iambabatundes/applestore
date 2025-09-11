import { userHttpService } from "../services/httpService";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/users/profile`;

function createFormData(user) {
  const formData = new FormData();

  for (const key in user) {
    if (key === "_id") continue;

    if (key === "profileImage" && user[key] && user[key].file) {
      formData.append("profileImage", user[key].file);
    } else if (key === "address" && user[key]) {
      if (user[key].addressLine)
        formData.append("address.addressLine", user[key].addressLine);
      if (user[key].city) formData.append("address.city", user[key].city);
      if (user[key].state) formData.append("address.state", user[key].state);
      if (user[key].country)
        formData.append("address.country", user[key].country);
      if (user[key].postalCode)
        formData.append("address.postalCode", user[key].postalCode);
    } else if (key === "gender" && user[key]) {
      // Capitalize the first letter to match backend validation
      const capitalizedGender =
        user[key].charAt(0).toUpperCase() + user[key].slice(1).toLowerCase();
      formData.append(key, capitalizedGender);
    } else if (key === "phoneNumber" && user[key]) {
      // Normalize phone number before sending
      try {
        const parsed = parsePhoneNumberFromString(user[key], "NG");
        const normalizedPhone = parsed ? parsed.number : user[key];
        formData.append(key, normalizedPhone);
      } catch (error) {
        formData.append(key, user[key]);
      }
    } else if (
      user[key] !== null &&
      user[key] !== undefined &&
      user[key] !== ""
    ) {
      formData.append(key, user[key]);
    }
  }

  return formData;
}

export async function updateUser(user) {
  try {
    const formData = createFormData(user);
    const response = await userHttpService.put(apiEndPoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Backend returns { message, user, contactInfo, verificationNotices?, pendingVerifications? }
    return response.data;
  } catch (err) {
    console.error("Failed to update user profile:", err);
    throw err;
  }
}

// New function to send verification code for secondary contact
export async function sendVerificationCode(contactType) {
  try {
    const { data } = await userHttpService.post(
      `${apiEndPoint}/send-verification`,
      {
        contactType, // 'email' or 'phone'
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to send verification code:", err);
    throw err;
  }
}

// New function to verify contact update
export async function verifyContactUpdate(contactType, code) {
  try {
    const { data } = await userHttpService.post(
      `${apiEndPoint}/verify-contact`,
      {
        contactType,
        code,
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to verify contact:", err);
    throw err;
  }
}

// New function to get user profile with contact status
export async function getUserProfileWithContactStatus() {
  try {
    const { data } = await userHttpService.get(`${apiEndPoint}/contact-status`);
    return data;
  } catch (err) {
    console.error("Failed to get user profile with contact status:", err);
    throw err;
  }
}

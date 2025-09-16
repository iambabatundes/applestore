import {
  adminHttpService,
  publicHttpService,
  userHttpService,
} from "./http/index.js";

// Use consistent base URL construction
const getApiEndpoint = (path = "") => {
  const baseUrl = import.meta.env.VITE_API_URL;
  return path ? `${baseUrl}/api/users/${path}` : `${baseUrl}/api/users`;
};

// Registration Flow (Multi-step)
export async function initiateRegistration(contactData) {
  try {
    const { data } = await publicHttpService.post(
      getApiEndpoint("initiate"),
      contactData
    );
    return data;
  } catch (err) {
    console.error("Failed to initiate registration:", err);
    throw err;
  }
}

export async function verifyContact({ registrationToken, channel, code }) {
  try {
    const { data } = await publicHttpService.post(
      getApiEndpoint("verify-contact"),
      {
        registrationToken,
        channel,
        code,
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to verify contact:", err);
    throw err;
  }
}

export async function completeRegistration(profileData) {
  try {
    const { data } = await publicHttpService.post(
      getApiEndpoint("complete"),
      profileData
    );
    return data;
  } catch (err) {
    console.error("Failed to complete registration:", err);
    throw err;
  }
}

export async function resendVerificationCode({ registrationToken, channel }) {
  try {
    const { data } = await publicHttpService.post(
      getApiEndpoint("resend-code"),
      {
        registrationToken,
        channel,
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to resend verification code:", err);
    throw err;
  }
}

// User Profile Management (aligned with UserHttpService)
export async function getUserProfile() {
  try {
    // Use the built-in method from UserHttpService
    const { data } = await userHttpService.getProfile();
    return data;
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    throw err;
  }
}

export async function updateUserProfile(profileData) {
  try {
    // Check if profileData contains file uploads
    const hasFiles = profileData.profileImage && profileData.profileImage.file;

    if (hasFiles) {
      // Handle file upload separately using the service method
      const formData = createFormData(profileData);
      const { data } = await userHttpService.post("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } else {
      // Use the built-in method for simple updates
      const { data } = await userHttpService.updateProfile(profileData);
      return data;
    }
  } catch (err) {
    console.error("Failed to update user profile:", err);
    throw err;
  }
}

export async function uploadUserAvatar(file) {
  try {
    const { data } = await userHttpService.uploadAvatar(file);
    return data;
  } catch (err) {
    console.error("Failed to upload avatar:", err);
    throw err;
  }
}

export async function deleteUserAvatar() {
  try {
    const { data } = await userHttpService.deleteAvatar();
    return data;
  } catch (err) {
    console.error("Failed to delete avatar:", err);
    throw err;
  }
}

export async function changeUserPassword(currentPassword, newPassword) {
  try {
    const { data } = await userHttpService.changePassword(
      currentPassword,
      newPassword
    );
    return data;
  } catch (err) {
    console.error("Failed to change password:", err);
    throw err;
  }
}

export async function updateUserEmail(newEmail, password) {
  try {
    const { data } = await userHttpService.updateEmail(newEmail, password);
    return data;
  } catch (err) {
    console.error("Failed to update email:", err);
    throw err;
  }
}

export async function verifyNewUserEmail(token) {
  try {
    const { data } = await userHttpService.verifyNewEmail(token);
    return data;
  } catch (err) {
    console.error("Failed to verify new email:", err);
    throw err;
  }
}

// Account Management
export async function getUserAccountSettings() {
  try {
    const { data } = await userHttpService.getAccountSettings();
    return data;
  } catch (err) {
    console.error("Failed to fetch account settings:", err);
    throw err;
  }
}

export async function updateUserAccountSettings(settings) {
  try {
    const { data } = await userHttpService.updateAccountSettings(settings);
    return data;
  } catch (err) {
    console.error("Failed to update account settings:", err);
    throw err;
  }
}

export async function getUserNotificationPreferences() {
  try {
    const { data } = await userHttpService.getNotificationPreferences();
    return data;
  } catch (err) {
    console.error("Failed to fetch notification preferences:", err);
    throw err;
  }
}

export async function updateUserNotificationPreferences(preferences) {
  try {
    const { data } = await userHttpService.updateNotificationPreferences(
      preferences
    );
    return data;
  } catch (err) {
    console.error("Failed to update notification preferences:", err);
    throw err;
  }
}

// Admin Operations (for admin users)
export async function getUsers(params = {}) {
  try {
    const { data } = await adminHttpService.get(getApiEndpoint(), { params });
    return data;
  } catch (err) {
    console.error("Failed to fetch users:", err);
    throw err;
  }
}

export async function getUser(userId) {
  try {
    const { data } = await adminHttpService.get(getApiEndpoint(userId));
    return data;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    throw err;
  }
}

export async function deleteUser(userId) {
  try {
    const { data } = await adminHttpService.delete(getApiEndpoint(userId));
    return data;
  } catch (err) {
    console.error("Failed to delete user:", err);
    throw err;
  }
}

// User Addresses (leveraging UserHttpService methods)
export async function getUserAddresses() {
  try {
    const { data } = await userHttpService.getAddresses();
    return data;
  } catch (err) {
    console.error("Failed to fetch addresses:", err);
    throw err;
  }
}

export async function createUserAddress(addressData) {
  try {
    const { data } = await userHttpService.createAddress(addressData);
    return data;
  } catch (err) {
    console.error("Failed to create address:", err);
    throw err;
  }
}

export async function updateUserAddress(addressId, addressData) {
  try {
    const { data } = await userHttpService.updateAddress(
      addressId,
      addressData
    );
    return data;
  } catch (err) {
    console.error("Failed to update address:", err);
    throw err;
  }
}

export async function deleteUserAddress(addressId) {
  try {
    const { data } = await userHttpService.deleteAddress(addressId);
    return data;
  } catch (err) {
    console.error("Failed to delete address:", err);
    throw err;
  }
}

// Payment Methods
export async function getUserPaymentMethods() {
  try {
    const { data } = await userHttpService.getPaymentMethods();
    return data;
  } catch (err) {
    console.error("Failed to fetch payment methods:", err);
    throw err;
  }
}

export async function addUserPaymentMethod(paymentData) {
  try {
    const { data } = await userHttpService.addPaymentMethod(paymentData);
    return data;
  } catch (err) {
    console.error("Failed to add payment method:", err);
    throw err;
  }
}

// Utility Functions
function createFormData(user) {
  const formData = new FormData();

  for (const key in user) {
    if (key === "_id") {
      continue;
    } else if (key === "profileImage") {
      if (user[key] && user[key].file) {
        formData.append("profileImage", user[key].file);
      }
    } else if (Array.isArray(user[key])) {
      user[key].forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (user[key] != null) {
      formData.append(key, user[key]);
    }
  }

  return formData;
}

// Cache Management
export function invalidateUserCache(pattern = null) {
  userHttpService.invalidateUserCache(pattern);
}

export function getUserCacheMetrics() {
  return userHttpService.getCacheMetrics();
}

// Legacy support (for backward compatibility)
export async function createUser(user) {
  console.warn("createUser is deprecated, use registration flow instead");
  return createUserLegacy(user);
}

async function createUserLegacy(user) {
  try {
    const { data } = await publicHttpService.post(getApiEndpoint(), {
      firstName: user.firstName,
      username: user.username,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: user.password,
    });
    return data;
  } catch (err) {
    console.error("Failed to create user:", err);
    throw err;
  }
}

export async function updateUser(user) {
  console.warn("updateUser is deprecated, use updateUserProfile instead");
  return updateUserProfile(user);
}

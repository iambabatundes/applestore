import {
  adminHttpService,
  publicHttpService,
  userHttpService,
} from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/users`;

function userUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getUsers() {
  try {
    const { data } = await adminHttpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch users:", err);
    throw err;
  }
}

export async function getUser(userId) {
  try {
    const { data } = await adminHttpService.get(userUrl(userId));
    return data;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    throw err;
  }
}

export async function getUserProfile() {
  console.log("Fetching user profile from:", `${apiEndPoint}/me`);
  try {
    const { data } = await userHttpService.get(`${apiEndPoint}/me`);
    console.log("User profile response:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    throw err;
  }
}

// Step 1: Initiate registration with just email or phone
export async function initiateRegistration(contactData) {
  try {
    const { data } = await publicHttpService.post(
      `${apiEndPoint}/initiate`,
      contactData
    );
    return data;
  } catch (err) {
    console.error("Failed to initiate registration:", err);
    throw err;
  }
}

// Step 2: Verify the email/phone code
export async function verifyContact({ registrationToken, channel, code }) {
  try {
    const { data } = await publicHttpService.post(
      `${apiEndPoint}/verify-contact`,
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

// Step 3: Complete registration with profile info
export async function completeRegistration(profileData) {
  try {
    const { data } = await publicHttpService.post(
      `${apiEndPoint}/complete`,
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
      `${apiEndPoint}/resend-code`,
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

// Keep existing functions for backward compatibility
export async function createUser(user) {
  try {
    const { data } = await publicHttpService.post(apiEndPoint, {
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

export async function sendVerificationCode({ registrationToken, channel }) {
  try {
    const { data } = await publicHttpService.post(
      `${apiEndPoint}/send-verification`,
      {
        registrationToken,
        channel,
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to send verification code:", err);
    throw err;
  }
}

export async function verifyUser({ registrationToken, channel, code }) {
  try {
    const { data } = await publicHttpService.post(`${apiEndPoint}/verify`, {
      registrationToken,
      channel,
      code,
    });
    return data;
  } catch (err) {
    console.error("Failed to verify user:", err);
    throw err;
  }
}

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
      user[key].forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, user[key]);
    }
  }
  return formData;
}

export async function updateUser(user) {
  try {
    const formData = createFormData(user);
    const { data } = await userHttpService.put(
      `${apiEndPoint}/profile`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to update user:", err);
    throw err;
  }
}

export async function deleteUser(userId) {
  try {
    const { data } = await adminHttpService.delete(userUrl(userId));
    return data;
  } catch (err) {
    console.error("Failed to delete user:", err);
    throw err;
  }
}

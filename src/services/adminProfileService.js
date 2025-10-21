import { adminHttpService } from "./http/index";

const PROFILE_PATH = "/api/admins/profile";

function clearAdminCache() {
  adminHttpService.clearCache();
}

function createFormData(profileData) {
  const formData = new FormData();

  // Extract profile image file if present
  let imageFile = null;
  if (profileData.adminProfileImage?.file) {
    imageFile = profileData.adminProfileImage.file;
  } else if (profileData.profileImage?.file) {
    imageFile = profileData.profileImage.file;
  }

  if (imageFile) {
    formData.append("adminProfileImage", imageFile);
  }

  const fieldsToExclude = ["_id", "adminProfileImage", "profileImage", "role"];

  Object.keys(profileData).forEach((key) => {
    if (fieldsToExclude.includes(key)) return;

    const value = profileData[key];

    if (value === null || value === undefined || value === "") return;

    if (key === "gender") {
      const capitalizedGender =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      formData.append(key, capitalizedGender);
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}

export async function getAdminProfile() {
  try {
    const response = await adminHttpService.get(PROFILE_PATH);

    // Debug log to verify response structure
    console.log("📥 Admin Profile Response:", {
      hasData: !!response.data,
      hasAdmin: !!response.data?.data?.admin,
      hasProfileImage: !!response.data?.data?.admin?.adminProfileImage,
      profileImageData: response.data?.data?.admin?.adminProfileImage,
    });

    // Extract admin from nested structure
    const admin =
      response.data?.data?.admin || response.data?.admin || response.data;

    if (!admin) {
      throw new Error("Invalid response structure from server");
    }

    // Verify profile image population
    if (admin.adminProfileImage) {
      if (typeof admin.adminProfileImage === "string") {
        console.warn(
          "⚠️ Profile image is not populated! Got ID:",
          admin.adminProfileImage
        );
      } else {
        console.log(
          "✅ Profile image is properly populated:",
          admin.adminProfileImage
        );
      }
    }

    return { data: { admin } };
  } catch (error) {
    console.error("❌ Failed to fetch admin profile:", error);
    throw {
      code: "PROFILE_FETCH_FAILED",
      message: "Failed to load profile data",
      originalError: error,
    };
  }
}

export async function updateAdminProfile(profileData) {
  try {
    const formData = createFormData(profileData);

    const response = await adminHttpService.put(PROFILE_PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Debug log
    console.log("📤 Profile Update Response:", {
      hasData: !!response.data,
      hasAdmin: !!response.data?.data?.admin,
      hasProfileImage: !!response.data?.data?.admin?.adminProfileImage,
      profileImageData: response.data?.data?.admin?.adminProfileImage,
    });

    // Clear cache after successful update
    clearAdminCache();

    // Extract admin from nested structure
    const admin =
      response.data?.data?.admin || response.data?.admin || response.data;

    return { data: { admin } };
  } catch (error) {
    console.error("❌ Failed to update admin profile:", error);

    // Enhanced error handling
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        throw {
          code: data.code || "VALIDATION_ERROR",
          message: data.message || "Validation failed",
          errors: data.errors || [],
        };
      } else if (status === 403) {
        throw {
          code: "INSUFFICIENT_PERMISSIONS",
          message:
            data.message || "You do not have permission to update this profile",
        };
      } else if (status === 409) {
        throw {
          code: data.code || "DUPLICATE_FIELD",
          message: data.message || "This value is already in use",
        };
      }
    }

    throw {
      code: "NETWORK_ERROR",
      message: "Failed to connect to server. Please try again.",
    };
  }
}

export async function updateAdminPassword(
  adminId,
  currentPassword,
  newPassword
) {
  try {
    const response = await adminHttpService.put(
      `/api/admins/${adminId}/password`,
      { currentPassword, newPassword }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update password:", error);
    throw error;
  }
}

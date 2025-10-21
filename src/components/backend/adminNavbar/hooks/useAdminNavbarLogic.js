import { useEffect } from "react";
import { useAdminNavStore } from "../../store/adminNavbarStore";
import config from "../../../../config.json";

export function useAdminNavbarLogic(user) {
  const {
    currentUser,
    profileDetails,
    dropdownOpen,
    modalOpen,
    notifications,
    isEditing,
    profileImage,
    isSubmitting,
    errors,
    successMessage,
    initializeUser,
    fetchProfile, // NEW: Use this to fetch from backend
    toggleDropdown,
    toggleModal,
    fetchNotifications,
    setIsEditing,
    handleInputChange,
    handleProfileImageChange,
    submitProfileUpdate,
  } = useAdminNavStore();

  // Initialize or fetch profile on mount
  useEffect(() => {
    if (user) {
      // If user prop exists, initialize with it
      initializeUser(user);
    } else {
      // If no user prop, fetch from backend
      fetchProfile();
    }
  }, [user, initializeUser, fetchProfile]);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const firstName = currentUser?.firstName || currentUser?.email || "Admin";

  const getUserImageUrl = () => {
    // Check for preview (new upload)
    if (profileImage?.preview) {
      return profileImage.preview;
    }

    // Check for URL from backend
    if (currentUser?.adminProfileImage?.url) {
      return currentUser.adminProfileImage.url;
    }

    // Check for filename
    if (currentUser?.adminProfileImage?.filename) {
      return `${config.mediaUrl}/uploads/${currentUser.adminProfileImage.filename}`;
    }

    return null;
  };

  const userImage = getUserImageUrl();

  return {
    currentUser,
    profileDetails,
    dropdownOpen,
    modalOpen,
    notifications,
    isEditing,
    profileImage,
    isSubmitting,
    errors,
    successMessage,
    firstName,
    userImage,
    toggleDropdown,
    toggleModal,
    setIsEditing,
    handleInputChange,
    handleProfileImageChange,
    submitProfileUpdate,
  };
}

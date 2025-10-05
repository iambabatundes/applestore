import { useEffect } from "react";
import defaultUserImage from "../../images/user.png";
import { useAdminNavStore } from "../../store/adminNavbarStore";

export function useAdminNavbarLogic(user) {
  const {
    currentUser,
    profileDetails,
    dropdownOpen,
    modalOpen,
    notifications,
    isEditing,
    profileImage,
    initializeUser,
    toggleDropdown,
    toggleModal,
    fetchNotifications,
    setIsEditing,
    handleInputChange,
    handleProfileImageChange,
    submitProfileUpdate,
    isCollapsed,
    isHidden,
  } = useAdminNavStore();

  useEffect(() => {
    if (user) initializeUser(user);
  }, [user, initializeUser]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const firstName = currentUser?.firstName || currentUser?.email || "Admin";
  const userImage = currentUser?.profileImage?.filename
    ? `http://localhost:4000/uploads/${currentUser.profileImage.filename}`
    : defaultUserImage;

  return {
    currentUser,
    profileDetails,
    dropdownOpen,
    modalOpen,
    notifications,
    isEditing,
    profileImage,
    firstName,
    userImage,
    toggleDropdown,
    toggleModal,
    setIsEditing,
    handleInputChange,
    handleProfileImageChange,
    submitProfileUpdate,
    isCollapsed,
    isHidden,
  };
}

import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "zustand";
import {
  updateUser,
  sendVerificationCode,
  verifyContactUpdate,
} from "../../../../services/profileService";
import { toast } from "react-toastify";
import { authStore } from "../../../../services/authService";

export const useUserProfile = () => {
  const { user: initialUser, setUser } = useStore(authStore);

  const [userData, setUserData] = useState(() => {
    if (!initialUser)
      return {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        profileImage: null,
        address: {
          addressLine: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
      };

    return {
      ...initialUser,
      firstName: initialUser.firstName || "",
      lastName: initialUser.lastName || "",
      username: initialUser.username || "",
      email: initialUser.email || "",
      phoneNumber: initialUser.phoneNumber || "",
      gender: initialUser.gender
        ? initialUser.gender.charAt(0).toUpperCase() +
          initialUser.gender.slice(1).toLowerCase()
        : "",
      dateOfBirth: initialUser.dateOfBirth || "",
      profileImage: initialUser.profileImage || null,
      address: {
        addressLine: initialUser.address?.addressLine || "",
        city: initialUser.address?.city || "",
        state: initialUser.address?.state || "",
        country: initialUser.address?.country || "",
        postalCode: initialUser.address?.postalCode || "",
      },
    };
  });

  const [profileImage, setProfileImage] = useState(initialUser?.profileImage);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [greeting, setGreeting] = useState("Good day");
  const [contactInfo, setContactInfo] = useState(null);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [verificationLoading, setVerificationLoading] = useState(false);

  useEffect(() => {
    if (initialUser) {
      console.log("Syncing userData with fresh user data:", initialUser);

      const syncedUserData = {
        ...initialUser,
        firstName: initialUser.firstName || "",
        lastName: initialUser.lastName || "",
        username: initialUser.username || "",
        email: initialUser.email || "",
        phoneNumber: initialUser.phoneNumber || "",
        gender: initialUser.gender
          ? initialUser.gender.charAt(0).toUpperCase() +
            initialUser.gender.slice(1).toLowerCase()
          : "",
        dateOfBirth: initialUser.dateOfBirth || "",
        profileImage: initialUser.profileImage || null,
        address: {
          addressLine: initialUser.address?.addressLine || "",
          city: initialUser.address?.city || "",
          state: initialUser.address?.state || "",
          country: initialUser.address?.country || "",
          postalCode: initialUser.address?.postalCode || "",
        },
      };

      setUserData(syncedUserData);
      setProfileImage(initialUser.profileImage || null);
    } else {
      // Reset to empty state if no user
      setUserData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        profileImage: null,
        address: {
          addressLine: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
      });
      setProfileImage(null);
    }
  }, [initialUser]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) setGreeting("Good morning");
    else if (currentHour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleProfileImageChange = useCallback((file, preview) => {
    if (file) {
      setProfileImage({ file, preview });
      setUserData((prevState) => ({
        ...prevState,
        profileImage: { file, preview },
      }));
    } else {
      setProfileImage(null);
      setUserData((prevState) => ({
        ...prevState,
        profileImage: null,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for backend - remove any undefined/null fields except profileImage
      const updatePayload = {
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        username: userData.username || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
        gender: userData.gender || "",
        dateOfBirth: userData.dateOfBirth || "",
        address: {
          addressLine: userData.address?.addressLine || "",
          city: userData.address?.city || "",
          state: userData.address?.state || "",
          country: userData.address?.country || "",
          postalCode: userData.address?.postalCode || "",
        },
      };

      // Only include profileImage if there's a new file
      if (userData.profileImage && userData.profileImage.file) {
        updatePayload.profileImage = userData.profileImage;
      }

      console.log("Updating user profile with payload:", updatePayload);
      const response = await updateUser(updatePayload);

      if (response.user) {
        console.log(
          "Profile update successful, updating auth store:",
          response.user
        );

        // Update auth store first
        setUser(response.user);

        // Then update local state to match
        const updatedUserData = {
          ...response.user,
          firstName: response.user.firstName || "",
          lastName: response.user.lastName || "",
          username: response.user.username || "",
          email: response.user.email || "",
          phoneNumber: response.user.phoneNumber || "",
          gender: response.user.gender
            ? response.user.gender.charAt(0).toUpperCase() +
              response.user.gender.slice(1).toLowerCase()
            : "",
          dateOfBirth: response.user.dateOfBirth || "",
          profileImage: response.user.profileImage || null,
          address: {
            addressLine: response.user.address?.addressLine || "",
            city: response.user.address?.city || "",
            state: response.user.address?.state || "",
            country: response.user.address?.country || "",
            postalCode: response.user.address?.postalCode || "",
          },
        };

        setUserData(updatedUserData);
        setProfileImage(response.user.profileImage || null);
      }

      // Handle contact info and verification notices
      if (response.contactInfo) {
        setContactInfo(response.contactInfo);
      }

      if (response.pendingVerifications) {
        setPendingVerifications(response.pendingVerifications);
      }

      if (response.verificationNotices) {
        // Show notices about new contacts added
        response.verificationNotices.forEach((notice) => {
          toast.info(notice.message);
        });
      }

      toast.success(response.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Error updating user profile:",
        error.response?.data || error
      );

      // Handle specific backend error responses
      const errorMessage = error.response?.data?.error;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((msg) => toast.error(msg));
      } else if (typeof errorMessage === "string") {
        toast.error(errorMessage);
      } else {
        toast.error("Error updating profile");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle sending verification code for secondary contact
  const handleSendVerification = async (contactType) => {
    setVerificationLoading(true);
    try {
      const response = await sendVerificationCode(contactType);
      toast.success(response.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to send verification code";
      toast.error(errorMessage);
    } finally {
      setVerificationLoading(false);
    }
  };

  // Handle verifying contact with code
  const handleVerifyContact = async (contactType, code) => {
    setVerificationLoading(true);
    try {
      const response = await verifyContactUpdate(contactType, code);

      if (response.user) {
        setUser(response.user);

        // Update local state to match
        const updatedUserData = {
          ...response.user,
          firstName: response.user.firstName || "",
          lastName: response.user.lastName || "",
          username: response.user.username || "",
          email: response.user.email || "",
          phoneNumber: response.user.phoneNumber || "",
          gender: response.user.gender
            ? response.user.gender.charAt(0).toUpperCase() +
              response.user.gender.slice(1).toLowerCase()
            : "",
          dateOfBirth: response.user.dateOfBirth || "",
          profileImage: response.user.profileImage || null,
          address: {
            addressLine: response.user.address?.addressLine || "",
            city: response.user.address?.city || "",
            state: response.user.address?.state || "",
            country: response.user.address?.country || "",
            postalCode: response.user.address?.postalCode || "",
          },
        };

        setUserData(updatedUserData);
      }

      if (response.contactInfo) {
        setContactInfo(response.contactInfo);
      }

      // Remove from pending verifications
      setPendingVerifications((prev) =>
        prev.filter((p) => p.type !== contactType)
      );

      toast.success(response.message);
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Verification failed";
      toast.error(errorMessage);
    } finally {
      setVerificationLoading(false);
    }
  };

  return {
    userData,
    setUserData,
    profileImage,
    setProfileImage,
    loading,
    isEditing,
    setIsEditing,
    greeting,
    handleSubmit,
    handleProfileImageChange,
    contactInfo,
    pendingVerifications,
    setPendingVerifications,
    verificationLoading,
    handleSendVerification,
    handleVerifyContact,
  };
};

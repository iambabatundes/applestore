import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "zustand";
import { updateUser } from "../../../../services/profileService";

import { toast } from "react-toastify";
import { authStore } from "../../../../services/authService";

export const useUserProfile = () => {
  const { user: initialUser, setUser } = useStore(authStore);

  const [userData, setUserData] = useState({
    ...initialUser,
    firstName: initialUser.firstName || "",
    lastName: initialUser.lastName || "",
    username: initialUser.username || "",
    email: initialUser.email || "",
    phoneNumber: initialUser.phoneNumber || "",
    gender: initialUser.gender || "",
    dateOfBirth: initialUser.dateOfBirth || "",
    profileImage: initialUser.profileImage || null,
    address: {
      addressLine: initialUser.address?.addressLine || "",
      city: initialUser.address?.city || "",
      state: initialUser.address?.state || "",
      country: initialUser.address?.country || "",
      postalCode: initialUser.address?.postalCode || "",
    },
  });

  const [profileImage, setProfileImage] = useState(initialUser.profileImage);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [greeting, setGreeting] = useState("Good day");

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
      setProfileImage({});
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
      const updatedUser = {
        ...userData,
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
      // Remove unexpected top-level fields
      delete updatedUser.city;
      delete updatedUser.state;
      delete updatedUser.country;
      delete updatedUser.zipCode;
      if (userData.profileImage && userData.profileImage.file) {
        updatedUser.profileImage = userData.profileImage.file;
      } else {
        delete updatedUser.profileImage;
      }
      const { data } = await updateUser(updatedUser);
      setUser(data);
      setUserData(data);
      setProfileImage(data.profileImage || {});
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(
        "Error updating user profile:",
        error.response?.data || error
      );
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     // const updatedUser = { ...userData };

  //     const updatedUser = {
  //       ...userData,
  //       name: userData.name || "",
  //       email: userData.email || "",
  //     };
  //     if (userData.profileImage && userData.profileImage.file) {
  //       updatedUser.profileImage = userData.profileImage.file;
  //     } else {
  //       delete updatedUser.profileImage;
  //     }
  //     const { data } = await updateUser(updatedUser);
  //     setUser(data);
  //     setUserData(data);
  //     setProfileImage(data.profileImage);
  //     toast.success("Profile updated successfully");
  //   } catch (error) {
  //     // console.error("Error updating user profile:", error);
  //     console.error(
  //       "Error updating user profile:",
  //       error.response?.data || error
  //     );
  //     toast.error("Error updating profile");
  //   } finally {
  //     setLoading(false);
  //     setIsEditing(false);
  //   }
  // };

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
  };
};

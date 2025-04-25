import React, { useState, useEffect, useCallback } from "react";
import { updateUser } from "../../../../services/profileService";

import { toast } from "react-toastify";

export const useUserProfile = (initialUser, setUser) => {
  const [userData, setUserData] = useState({
    ...initialUser,
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
      const updatedUser = { ...userData };
      if (userData.profileImage && userData.profileImage.file) {
        updatedUser.profileImage = userData.profileImage.file;
      } else {
        delete updatedUser.profileImage;
      }
      const { data } = await updateUser(updatedUser);
      setUser(data);
      setUserData(data);
      setProfileImage(data.profileImage);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
      setIsEditing(false);
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
  };
};

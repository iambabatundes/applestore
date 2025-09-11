import React from "react";
import { useStore } from "zustand";
import ProfileEditForm from "./common/ProfileEditForm";
import ProfileDisplay from "./common/ProfileDisplay";
import TopProduct from "../topProduct";
import { authStore } from "../../../services/authService";

export default function MyProfile({
  handleSubmit,
  profileImage,
  setProfileImage,
  userData,
  setUserData,
  loading,
  isEditing,
  setIsEditing,
  handleProfileImageChange,
  contactInfo,
  pendingVerifications,
  handleSendVerification,
  handleVerifyContact,
  verificationLoading,
}) {
  const { user } = useStore(authStore);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset userData to current user data on cancel
    if (user) {
      setUserData({
        ...user,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        // Normalize gender here too
        gender: user.gender
          ? user.gender.charAt(0).toUpperCase() +
            user.gender.slice(1).toLowerCase()
          : "",
        dateOfBirth: user.dateOfBirth || "",
        profileImage: user.profileImage || null,
        address: {
          addressLine: user.address?.addressLine || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          country: user.address?.country || "",
          postalCode: user.address?.postalCode || "",
        },
      });
      setProfileImage(user.profileImage || null);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <section className="profile-section">
      {isEditing ? (
        <ProfileEditForm
          user={user}
          handleSubmit={handleSubmit}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          userData={userData}
          setUserData={setUserData}
          onCancel={handleCancel}
          loading={loading}
          handleProfileImageChange={handleProfileImageChange}
          contactInfo={contactInfo}
          pendingVerifications={pendingVerifications}
          handleSendVerification={handleSendVerification}
          handleVerifyContact={handleVerifyContact}
          verificationLoading={verificationLoading}
        />
      ) : (
        <>
          <ProfileDisplay
            user={user}
            onEdit={handleEdit}
            contactInfo={contactInfo}
            pendingVerifications={pendingVerifications}
            handleSendVerification={handleSendVerification}
            handleVerifyContact={handleVerifyContact}
            verificationLoading={verificationLoading}
          />
          <TopProduct />
        </>
      )}
    </section>
  );
}

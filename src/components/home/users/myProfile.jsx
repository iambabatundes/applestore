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
}) {
  const { user } = useStore(authStore);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
        />
      ) : (
        <>
          <ProfileDisplay user={user} onEdit={handleEdit} />
          <TopProduct />
        </>
      )}
    </section>
  );
}

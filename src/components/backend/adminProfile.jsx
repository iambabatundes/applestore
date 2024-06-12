import React from "react";
import { FaEdit } from "react-icons/fa";
import "../backend/common/styles/adminProfile.css";
import ProfileImage from "./profileImage";

const AdminProfile = ({
  user,
  isOpen,
  onClose,
  isEditing,
  setIsEditing,
  profileImage,
  setProfileImage,
  handleProfileImageChange,
  handleInputChange,
  handleSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="adminProfile__modal">
      <div className="adminProfileModal-content">
        <button className="adminProfile__close" onClick={onClose}>
          &times;
        </button>
        <h2 className="adminProfile__heading">Profile</h2>
        {!isEditing ? (
          <section>
            <div className="adminProfile__icon">
              <FaEdit
                className="edit-icon"
                onClick={() => setIsEditing(true)}
              />
            </div>
            <div className="adminProfile__modal-body">
              <div className="profile-details">
                <div className="profile-image-container">
                  <ProfileImage
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    handleProfileImageChange={handleProfileImageChange}
                    readOnly
                  />
                </div>
                <div className="profile-info">
                  <div className="profile-field">
                    <strong>First Name:</strong> {user.firstName}
                  </div>
                  <div className="profile-field">
                    <strong>Last Name:</strong> {user.lastName}
                  </div>
                  <div className="profile-field">
                    <strong>Username:</strong> {user.username}
                  </div>
                  <div className="profile-field">
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div className="profile-field">
                    <strong>Phone Number:</strong> {user.phoneNumber}
                  </div>
                  <div className="profile-field">
                    <strong>Date of Birth:</strong> {user.dateOfBirth}
                  </div>
                  <div className="profile-field">
                    <strong>Address:</strong> {user.address}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <form className="modal-body" onSubmit={handleSubmit}>
            <div className="adminProfile__formMain">
              <div className="adminProfile__image-container">
                <ProfileImage
                  profileImage={profileImage}
                  setProfileImage={setProfileImage}
                  handleProfileImageChange={handleProfileImageChange}
                />
                <div className="profile__label">
                  <label className="profile-label">
                    First Name:
                    <input
                      type="text"
                      name="firstName"
                      value={user.firstName || ""}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div>
                  <label className="profile-label">
                    Last Name:
                    <input
                      type="text"
                      name="lastName"
                      value={user.lastName || ""}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div>
                  <label className="profile-label">
                    Username:
                    <input
                      type="text"
                      name="username"
                      value={user.username || ""}
                      onChange={handleInputChange}
                      disabled
                    />
                  </label>
                </div>
              </div>

              <section className="adminProfile__form">
                <div>
                  <label className="profile-label">
                    Email:
                    <input
                      type="email"
                      name="email"
                      value={user.email || ""}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div>
                  <label className="profile-label">
                    Phone Number:
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={user.phoneNumber || ""}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div>
                  <label className="profile-label">
                    Date of Birth:
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={user.dateOfBirth || ""}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div>
                  <label className="profile-label">
                    Address:
                    <textarea
                      name="address"
                      value={user.address || ""}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <button type="submit" className="save-button">
                  Save
                </button>
              </section>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;

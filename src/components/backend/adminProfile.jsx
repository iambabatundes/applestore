import React from "react";
import {
  FaEdit,
  FaTimes,
  FaSave,
  FaExclamationCircle,
  FaCheckCircle,
} from "react-icons/fa";
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
  isSubmitting,
  errors,
  successMessage,
}) => {
  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="adminProfile__modal">
      <div className="adminProfileModal-content">
        <button
          className="adminProfile__close"
          onClick={onClose}
          disabled={isSubmitting}
        >
          &times;
        </button>

        <h2 className="adminProfile__heading">Profile</h2>

        {successMessage && (
          <div className="adminProfile__message adminProfile__message--success">
            <FaCheckCircle />
            <span>{successMessage}</span>
          </div>
        )}

        {errors?.general && (
          <div className="adminProfile__message adminProfile__message--error">
            <FaExclamationCircle />
            <span>{errors.general}</span>
          </div>
        )}

        {!isEditing ? (
          <section>
            <div
              className="adminProfile__icon"
              onClick={() => setIsEditing(true)}
            >
              <FaEdit className="edit-icon" />
              Update Profile
            </div>
            <div className="adminProfile__modal-body">
              <div className="profile-details">
                <div className="profile-image-container">
                  <ProfileImage
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    handleProfileImageChange={handleProfileImageChange}
                    disabled={true}
                  />
                </div>
                <div className="profile-info">
                  <div className="profile-field">
                    <strong>First Name:</strong> {user?.firstName || "N/A"}
                  </div>
                  <div className="profile-field">
                    <strong>Last Name:</strong> {user?.lastName || "N/A"}
                  </div>
                  <div className="profile-field">
                    <strong>Email:</strong> {user?.email || "N/A"}
                  </div>
                  <div className="profile-field">
                    <strong>Phone Number:</strong> {user?.phoneNumber || "N/A"}
                  </div>
                  <div className="profile-field">
                    <strong>Date of Birth:</strong> {user?.dateOfBirth || "N/A"}
                  </div>
                  <div className="profile-field">
                    <strong>Gender:</strong> {user?.gender || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="modal-body">
            <div className="adminProfile__formMain">
              <div className="adminProfile__image-container">
                <ProfileImage
                  profileImage={profileImage}
                  setProfileImage={setProfileImage}
                  handleProfileImageChange={handleProfileImageChange}
                  disabled={isSubmitting}
                  error={errors?.profileImage}
                />

                <div className="profile__label">
                  <label className="profile-label">
                    First Name:
                    {/* <span className="required">*</span> */}
                    <input
                      type="text"
                      name="firstName"
                      value={user?.firstName || ""}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={errors?.firstName ? "input-error" : ""}
                    />
                    {errors?.firstName && (
                      <span className="error-message">
                        <FaExclamationCircle /> {errors.firstName}
                      </span>
                    )}
                  </label>
                </div>

                <div>
                  <label className="profile-label">
                    Last Name:
                    {/* <span className="required">*</span> */}
                    <input
                      type="text"
                      name="lastName"
                      value={user?.lastName || ""}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={errors?.lastName ? "input-error" : ""}
                    />
                    {errors?.lastName && (
                      <span className="error-message">
                        <FaExclamationCircle /> {errors.lastName}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              <section className="adminProfile__form">
                <div>
                  <label className="profile-label">
                    Email:
                    {/* <span className="required">*</span> */}
                    <input
                      type="email"
                      name="email"
                      value={user?.email || ""}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={errors?.email ? "input-error" : ""}
                    />
                    {errors?.email && (
                      <span className="error-message">
                        <FaExclamationCircle /> {errors.email}
                      </span>
                    )}
                  </label>
                </div>

                <div>
                  <label className="profile-label">
                    Phone Number:
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={user?.phoneNumber || ""}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      placeholder="+1234567890"
                      className={errors?.phoneNumber ? "input-error" : ""}
                    />
                    {errors?.phoneNumber && (
                      <span className="error-message">
                        <FaExclamationCircle /> {errors.phoneNumber}
                      </span>
                    )}
                  </label>
                </div>

                <div>
                  <label className="profile-label">
                    Date of Birth:
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={user?.dateOfBirth || ""}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={errors?.dateOfBirth ? "input-error" : ""}
                    />
                    {errors?.dateOfBirth && (
                      <span className="error-message">
                        <FaExclamationCircle /> {errors.dateOfBirth}
                      </span>
                    )}
                  </label>
                </div>

                <div>
                  <label className="profile-label">
                    Gender:
                    <select
                      name="gender"
                      value={user?.gender || "Male"}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className={errors?.gender ? "input-error" : ""}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors?.gender && (
                      <span className="error-message">
                        <FaExclamationCircle /> {errors.gender}
                      </span>
                    )}
                  </label>
                </div>

                <div className="adminProfile__actions">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-button"
                    disabled={isSubmitting}
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleFormSubmit}
                    className="save-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span> Saving...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;

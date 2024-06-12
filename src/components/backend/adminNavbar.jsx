import React, { useState, useEffect, useCallback } from "react";
import defaultUserImage from "./images/user.png";
import logo from "../../logo.svg";
import "./styles/adminNavbar.css";
import "../backend/common/styles/darkMode.css";
import Icon from "../icon";
import { FaSearch, FaMoon, FaSun } from "react-icons/fa";
import AdminProfile from "./adminProfile";
import AdminNotification from "./common/adminNotification";
import io from "socket.io-client";
import { getNotifications } from "../../services/notificationService";
import { updateUser } from "../../services/profileService";

const socket = io("http://localhost:4000");

export default function AdminNavbar({
  companyName,
  count,
  user,
  handleToggle,
  handleLogout,
  darkMode,
  toggleDarkMode,
}) {
  const [profileDetails, setProfileDetails] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phoneNumber: user.phoneNumber,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
    profileImage: user.profileImage,
  });
  const [currentUser, setCurrentUser] = useState(user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [profileImage, setProfileImage] = useState(null);

  const userName = currentUser?.username || currentUser?.email || "Admin";
  const userImage = currentUser?.profileImage?.filename
    ? `http://localhost:4000/uploads/${currentUser.profileImage.filename}`
    : defaultUserImage;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProfileImageChange = useCallback((file, preview) => {
    if (file) {
      setProfileImage({ file, preview });
      setProfileDetails((prevState) => ({
        ...prevState,
        profileImage: { file, preview },
      }));
    } else {
      setProfileImage(null);
      setProfileDetails((prevState) => ({
        ...prevState,
        profileImage: null,
      }));
    }
  }, []);

  const fetchNotification = useCallback(async () => {
    try {
      const { data: notifications } = await getNotifications();
      setNotifications(notifications);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

  useEffect(() => {
    fetchNotification();

    socket.on(`notification-${currentUser._id}`, (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    return () => {
      socket.off(`notification-${currentUser._id}`);
    };
  }, [currentUser._id, fetchNotification]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) setProfileDetails(currentUser); // Reset form data when opening the modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...profileDetails };
      if (profileDetails.profileImage && profileDetails.profileImage.file) {
        updatedUser.profileImage = profileDetails.profileImage.file;
      } else {
        delete updatedUser.profileImage;
      }
      const { data } = await updateUser(updatedUser, currentUser._id);
      setCurrentUser(data);
      setProfileDetails(data);
      toggleModal();
    } catch (error) {
      console.error("Failed to update user profile", error);
    }
  };

  return (
    <header className={`admin-navbar ${darkMode ? "dark-mode" : ""}`}>
      <div className="admin-navbar__left">
        <Icon menu onClick={handleToggle} />
        <img src={logo} alt="Company logo" className="company-logo" />
        <h1 className="company-name">{companyName}</h1>
      </div>
      <div className="admin-navbar__center">
        <div className="admin-navbar__search">
          <FaSearch />
          <input type="text" placeholder="Search..." />
        </div>
        <div className="admin-navbar__comments">
          <i className="fa fa-comment" aria-hidden="true"></i>
          <span>{count}</span>
        </div>
      </div>

      <div className="admin-navbar__right">
        <div className="admin-navbar__welcome">
          <h4>Welcome,</h4>
          <span className="admin__userName">{userName}</span>
        </div>
        <div className="admin-navbar__notifications">
          <AdminNotification notifications={notifications} />
        </div>
        <div className="admin-navbar__user" onClick={toggleDropdown}>
          <img src={userImage} alt="User" className="user-image" />
          <div
            className={`adminNavbar__dropdown ${dropdownOpen ? "open" : ""}`}
          >
            <div className="dropdown-item" onClick={toggleModal}>
              Profile
            </div>
            <div className="dropdown-item">Settings</div>
            <div className="dropdown-item" onClick={handleLogout}>
              Logout
            </div>
          </div>
        </div>
        <div
          className="admin-navbar__dark-mode-toggle"
          onClick={toggleDarkMode}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </div>
      </div>

      <AdminProfile
        user={profileDetails}
        handleSubmit={handleSubmit}
        isOpen={modalOpen}
        onClose={toggleModal}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleInputChange={handleInputChange}
        profileImage={profileDetails.profileImage}
        setProfileImage={setProfileImage}
        handleProfileImageChange={handleProfileImageChange}
      />
    </header>
  );
}

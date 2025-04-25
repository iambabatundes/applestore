import React, { useState, useEffect, useCallback } from "react";
import defaultUserImage from "./images/user.png";
import "./styles/adminNavbar.css";
import "../backend/common/styles/darkMode.css";
import Icon from "../icon";
import { FaSearch } from "react-icons/fa";
import AdminProfile from "./adminProfile";

import { getNotifications } from "../../services/notificationService";
import { updateUser } from "../../services/profileService";

// Material UI imports
import { Avatar, Badge, Switch, Grid, IconButton } from "@mui/material";
import { FaMoon, FaSun } from "react-icons/fa";

export default function AdminNavbar({
  companyName,
  count,
  user,
  handleToggle,
  handleLogout,
  darkMode,
  toggleDarkMode,
  logo,
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

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2 * 1024 * 1024 && file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      setProfileImage({ file, preview });
      setProfileDetails((prevState) => ({
        ...prevState,
        profileImage: { file, preview },
      }));
    } else {
      alert("Please select an image file smaller than 2MB.");
    }
  };

  const fetchNotification = useCallback(async () => {
    try {
      const { data: notifications } = await getNotifications();
      setNotifications(notifications);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  }, []);

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
    <nav className={`admin-navbar ${darkMode ? "dark-mode" : ""}`}>
      <section className="adminNavbar__main">
        <div className="admin-navbar__left">
          <IconButton onClick={handleToggle}>
            <Icon menu />
          </IconButton>
          <img src={logo} alt="Company logo" className="company-logo" />
          {/* <h1 className="company-name">{companyName}</h1> */}
        </div>

        <div className="admin-navbar__center">
          <form className="admin-navbar__search">
            <input
              type="text"
              className="adminSearch-input"
              placeholder="Search..."
            />
            <button className="adminSearch-button">
              <i className="fa fa-search"></i>
            </button>
          </form>

          <div className="admin-navbar__notifications">
            <i className="fa fa-comment" aria-hidden="true"></i>
            <span>{count}</span>
          </div>

          <div className="admin-navbar__comments">
            <i className="fa fa-comment" aria-hidden="true"></i>
            <span>{notifications.length}</span>
          </div>
        </div>

        <div item className="admin-navbar__right">
          <div className="admin-navbar__welcome">
            <h4>Welcome,</h4>
            <span className="admin__userName">{userName}</span>
          </div>

          <div className="admin-navbar__user" onClick={toggleDropdown}>
            <Avatar
              src={userImage}
              alt={userName}
              sx={{ width: 40, height: 40 }}
            >
              {!userImage && userName.charAt(0)}
            </Avatar>
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
          <div className="admin-navbar__dark-mode-toggle">
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              color="default"
              icon={<FaMoon />}
              checkedIcon={<FaSun />}
              inputProps={{ "aria-label": "dark mode toggle" }}
            />
          </div>
        </div>
      </section>

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
    </nav>
  );
}

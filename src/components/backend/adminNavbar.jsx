import { useMemo, useEffect, useState } from "react";
import "./styles/adminNavbar.css";
import "../backend/common/styles/darkMode.css";
import Icon from "../icon";
import AdminProfile from "./adminProfile";

import { Switch, IconButton, Tooltip } from "@mui/material";
import { FaMoon, FaSun } from "react-icons/fa";
import BellIcon from "./icons/BellIcon";
import CommentIcon from "./icons/CommentIcon";
import UserDropdown from "./adminNavbar/UserDropdown";
import { useAdminNavbarLogic } from "./adminNavbar/hooks/useAdminNavbarLogic";
import { getDynamicGreeting } from "./utils/greetingService";

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
  const {
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
  } = useAdminNavbarLogic(user);

  // Dynamic greeting state
  const [greetingData, setGreetingData] = useState(() =>
    getDynamicGreeting(firstName, user?.lastLogin, {
      variant: "full",
      showEmoji: true,
    })
  );

  // Update greeting every minute and when user changes
  useEffect(() => {
    const updateGreeting = () => {
      setGreetingData(
        getDynamicGreeting(firstName, user.lastLogin, {
          variant: "full",
          showEmoji: true,
        })
      );
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [firstName, user?.lastLogin]);

  const safeNotifications = notifications || [];

  return (
    <nav className={`admin-navbar ${darkMode ? "dark-mode" : ""}`}>
      <section className="adminNavbar__main">
        <div className="admin-navbar__left">
          <IconButton onClick={handleToggle} aria-label="Toggle menu">
            <Icon menu />
          </IconButton>

          <img
            src={logo}
            alt={`${companyName} logo`}
            className="company-logo"
          />
        </div>

        <div className="admin-navbar__center">
          <form
            className="admin-navbar__search"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              className="adminSearch-input"
              placeholder="Search..."
              aria-label="Search"
            />
            <button
              type="submit"
              className="adminSearch-button"
              aria-label="Submit search"
            >
              <i className="fa fa-search"></i>
            </button>
          </form>

          <Tooltip title="Messages" arrow>
            <div className="admin-navbar__notifications">
              <CommentIcon />
              <span className="badge">{count || 0}</span>
            </div>
          </Tooltip>

          <Tooltip title="Notifications" arrow>
            <div className="admin-navbar__comments">
              <BellIcon />
              <span className="badge">{safeNotifications.length}</span>
            </div>
          </Tooltip>
        </div>

        <div className="admin-navbar__right">
          <div className="admin-navbar__welcome">
            <div className="greeting-primary">
              <h4 className="greeting-text">{greetingData.greeting},</h4>
              <span className="admin__userName">{firstName || "User"}</span>
            </div>

            {greetingData.context && (
              <p className="greeting-context">{greetingData.context}</p>
            )}

            {/* Optional: Show recurring message or weather */}
            {/* {(greetingData.recurring || greetingData.weather) && (
              <Tooltip
                title={greetingData.weather || greetingData.recurring}
                placement="bottom"
                arrow
              >
                <span className="greeting-badge">
                  {greetingData.weather ? "🌤️" : "👋"}
                </span>
              </Tooltip>
            )} */}
          </div>

          <UserDropdown
            firstName={firstName}
            userImage={userImage}
            dropdownOpen={dropdownOpen}
            toggleDropdown={toggleDropdown}
            toggleModal={toggleModal}
            handleLogout={handleLogout}
          />

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
        handleSubmit={submitProfileUpdate}
        isOpen={modalOpen}
        onClose={toggleModal}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleInputChange={(e) =>
          handleInputChange(e.target.name, e.target.value)
        }
        profileImage={profileImage}
        setProfileImage={setIsEditing}
        handleProfileImageChange={handleProfileImageChange}
      />
    </nav>
  );
}

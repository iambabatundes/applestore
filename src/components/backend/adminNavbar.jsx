import "./styles/adminNavbar.css";
import "../backend/common/styles/darkMode.css";
import Icon from "../icon";
import AdminProfile from "./adminProfile";

// Material UI imports
import { Switch, IconButton } from "@mui/material";
import { FaMoon, FaSun } from "react-icons/fa";
import { useAdminNavStore } from "./store/adminNavbarStore";
import BellIcon from "./icons/BellIcon";
import CommentIcon from "./icons/CommentIcon";
import UserDropdown from "./adminNavbar/UserDropdown";
import { useAdminNavbarLogic } from "./adminNavbar/hooks/useAdminNavbarLogic";

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
    userName,
    userImage,
    toggleDropdown,
    toggleModal,
    setIsEditing,
    handleInputChange,
    handleProfileImageChange,
    submitProfileUpdate,
  } = useAdminNavbarLogic(user);

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
            <CommentIcon />
            <span>{count}</span>
          </div>

          <div className="admin-navbar__comments">
            <BellIcon />
            <span>{notifications.length}</span>
          </div>
        </div>

        <div className="admin-navbar__right">
          <div className="admin-navbar__welcome">
            <h4>Welcome,</h4>
            <span className="admin__userName">{userName}</span>
          </div>

          <UserDropdown
            userName={userName}
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
        setProfileImage={handleProfileImageChange}
        handleProfileImageChange={(e) =>
          handleProfileImageChange(e.target.files[0])
        }
      />
    </nav>
  );
}

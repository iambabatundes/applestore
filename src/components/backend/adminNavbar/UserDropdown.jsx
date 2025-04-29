import { Avatar } from "@mui/material";
import "./styles/UserDropDown.css";

export default function UserDropdown({
  userName,
  userImage,
  dropdownOpen,
  toggleDropdown,
  toggleModal,
  handleLogout,
}) {
  return (
    <div className="admin-navbar__user" onClick={toggleDropdown}>
      <Avatar src={userImage} alt={userName} sx={{ width: 40, height: 40 }}>
        {!userImage && userName.charAt(0)}
      </Avatar>
      <div className={`adminNavbar__dropdown ${dropdownOpen ? "open" : ""}`}>
        <div className="dropdown-item" onClick={toggleModal}>
          Profile
        </div>
        <div className="dropdown-item">Settings</div>
        <div className="dropdown-item" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
}

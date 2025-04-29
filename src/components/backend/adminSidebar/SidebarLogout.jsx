import LogoutIcon from "./icons/LogoutIcon";

export default function SidebarLogout({ isCollapsed, handleLogout }) {
  return (
    <div className="adminSidebar-logout" onClick={handleLogout}>
      {!isCollapsed && <button className="adminSidebar-btn">Logout</button>}
      <LogoutIcon />
    </div>
  );
}

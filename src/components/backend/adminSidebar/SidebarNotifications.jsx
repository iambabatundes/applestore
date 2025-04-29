import BellIcon from "./icons/BellIcon";

export default function SidebarNotifications({ notifications, isCollapsed }) {
  return (
    <div className="adminSidebar__notifications">
      <BellIcon />
      {!isCollapsed && <span>{notifications.length}</span>}
    </div>
  );
}

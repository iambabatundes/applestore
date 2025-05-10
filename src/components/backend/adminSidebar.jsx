import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAdminSidebarStore } from "./store/adminSideBarStore";

import "./styles/adminSidebar.css";
import "../backend/common/styles/darkMode.css";
import SidebarLogout from "./adminSidebar/SidebarLogout";
import SidebarNotifications from "./adminSidebar/SidebarNotifications";
import SidebarDarkModeToggle from "./adminSidebar/SidebarDarkModeToggle";
import AngleRightIcon from "./adminSidebar/icons/AngleRightIcon";
import AngleLeftIcon from "./adminSidebar/icons/AngleLeftIcon";
import { useAdminSidebarScroll } from "./adminSidebar/hooks/useAdminSidebarScroll";
import SidebarLinks from "./adminSidebar/SidebarLinks";
import CommentIcon from "./icons/CommentIcon";

export default function AdminSidebar({
  darkMode,
  sidebarLinks,
  selectedLink,
  setSelectedLink,
  isMobileMenuOpen,
  setSelectedDropdownLink,
  selectedDropdownLink,
  count,
  toggleDarkMode,
  notifications,
  handleLogout,
  setIsMobileMenuOpen,
}) {
  const { isCollapsed, isHidden, toggleCollapse } = useAdminSidebarStore();

  const sidebarRef = useRef(null);

  // Close sidebar on outside click (for mobile only)
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        isMobileMenuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`admin-sidebar ${isMobileMenuOpen ? "open" : ""} ${
        isCollapsed ? "collapsed" : ""
      } ${isHidden ? "sidebar-hidden" : ""} ${darkMode ? "dark-mode" : ""}`}
      role="navigation"
      aria-label="Admin sidebar"
    >
      <button className="collapse-btn" onClick={toggleCollapse}>
        {isCollapsed ? <AngleRightIcon /> : <AngleLeftIcon />}
      </button>

      <SidebarLinks
        sidebarLinks={sidebarLinks}
        selectedLink={selectedLink}
        setSelectedLink={setSelectedLink}
        isCollapsed={isCollapsed}
        selectedDropdownLink={selectedDropdownLink}
        setSelectedDropdownLink={setSelectedDropdownLink}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="adminSidebar__comments">
        <CommentIcon />
        {!isCollapsed && <span>{count}</span>}
      </div>

      <SidebarNotifications
        notifications={notifications}
        isCollapsed={isCollapsed}
      />

      {!isCollapsed && (
        <SidebarDarkModeToggle
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}

      <SidebarLogout isCollapsed={isCollapsed} handleLogout={handleLogout} />
    </aside>
  );
}

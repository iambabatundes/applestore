import React from "react";
import { Link } from "react-router-dom";
import "./styles/adminSidebar.css";
import "../backend/common/styles/darkMode.css";

export default function AdminSidebar({
  darkMode,
  sidebarLinks,
  selectedLink,
  setSelectedLink,
  isMobileMenuOpen,
  setSelectedDropdownLink,
  selectedDropdownLink,
}) {
  return (
    <aside
      className={`admin-sidebar ${isMobileMenuOpen ? "open" : ""} ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      <ul>
        {sidebarLinks.map((link) => (
          <li key={link.to} className="sidebar-item">
            <Link
              to={link.to}
              onClick={() => setSelectedLink(link.to)}
              className={selectedLink === link.to ? "active" : ""}
            >
              <i className={`fa ${link.icon}`} />
              {link.label}
            </Link>
            {link.dropdown && link.dropdown.length > 0 && (
              <ul
                className={`dropdown ${selectedLink === link.to ? "open" : ""}`}
              >
                {link.dropdown.map((submenu) => (
                  <li key={submenu.to}>
                    <Link
                      to={submenu.to}
                      onClick={() => setSelectedDropdownLink(submenu.to)}
                      className={
                        selectedDropdownLink === submenu.to ? "active" : ""
                      }
                    >
                      {submenu.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

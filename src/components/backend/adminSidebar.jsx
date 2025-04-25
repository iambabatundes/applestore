import React from "react";
import { Link } from "react-router-dom";
import { Switch } from "@mui/material";
import { FaMoon, FaSun } from "react-icons/fa";
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
  count,
  toggleDarkMode,
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

      <div className="">
        <i className="fa fa-comment" aria-hidden="true"></i>
        <span>{count} this is new</span>
      </div>

      <div className="admin-navbar__dark-mode-toggles">
        <Switch
          checked={darkMode}
          onChange={toggleDarkMode}
          color="default"
          icon={<FaMoon />}
          checkedIcon={<FaSun />}
          inputProps={{ "aria-label": "dark mode toggle" }}
        />
      </div>
    </aside>
  );
}

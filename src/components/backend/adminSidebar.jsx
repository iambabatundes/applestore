import React from "react";
import { Link } from "react-router-dom";
import "./styles/adminSidebar.css";

export default function AdminSidebar({
  selectedLink,
  setSelectedLink,
  isMobileMenuOpen,
  sidebarLinks,
  setSelectedDropdownLink,
  selectedDropdownLink,
}) {
  return (
    <section>
      <aside className="admin-sidebar">
        <ul>
          {sidebarLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                onClick={() => setSelectedLink(link.to)}
                className={selectedLink === link.to ? "active" : ""}
              >
                {link.label}
              </Link>
              {link.dropdown && link.dropdown.length > 0 && (
                <ul className="dropdown">
                  {link.dropdown.map((submenu) => (
                    <li key={submenu.to}>
                      <Link
                        to={submenu.to}
                        onClick={() => setSelectedDropdownLink(submenu.to)} // Update the selectedDropdownLink state
                        className={
                          selectedDropdownLink === submenu.to
                            ? "active" // Use a different CSS class for dropdown link highlighting
                            : ""
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
    </section>
  );
}

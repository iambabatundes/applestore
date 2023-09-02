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
                <i className={`fa ${link.icon}`} />
                {link.label}
              </Link>
              {link.dropdown && link.dropdown.length > 0 && (
                <ul
                  className={`dropdown ${
                    selectedLink === link.to ? "open" : ""
                  }`}
                >
                  {/* Only render the submenu if the current parent link is selected */}
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
    </section>
  );
}

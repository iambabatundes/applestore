import { Link } from "react-router-dom";
import "../../backend/styles/adminSidebar.css";

export default function SidebarLinks({
  sidebarLinks,
  selectedLink,
  setSelectedLink,
  isCollapsed,
  selectedDropdownLink,
  setSelectedDropdownLink,
  setIsMobileMenuOpen,
}) {
  return (
    <ul>
      {sidebarLinks.map((link) => {
        // Extract the icon component
        const IconComponent = link.icon;

        return (
          <li key={link.to} className="sidebar-item">
            <Link
              to={link.to}
              onClick={() => {
                setSelectedLink(link.to);
                if (!link.dropdown) {
                  setIsMobileMenuOpen(false);
                }
              }}
              className={selectedLink === link.to ? "active" : ""}
              title={isCollapsed ? link.label : ""}
            >
              {/* Render the icon as a React component */}
              {IconComponent && (
                <IconComponent size={20} className="sidebar-icon" />
              )}
              {!isCollapsed && (
                <span className="sidebar-label">{link.label}</span>
              )}
            </Link>

            {!isCollapsed && link.dropdown && selectedLink === link.to && (
              <ul className="dropdown open">
                {link.dropdown.map((submenu) => (
                  <li key={submenu.to}>
                    <Link
                      to={submenu.to}
                      onClick={() => {
                        setSelectedDropdownLink(submenu.to);
                        setIsMobileMenuOpen(false);
                      }}
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
        );
      })}
    </ul>
  );
}

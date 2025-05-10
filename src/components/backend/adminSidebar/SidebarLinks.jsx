import { Link } from "react-router-dom";

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
      {sidebarLinks.map((link) => (
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
            <i className={`fa ${link.icon}`} />
            {!isCollapsed && link.label}
          </Link>

          {!isCollapsed && link.dropdown && selectedLink === link.to && (
            <ul className="dropdown open">
              {link.dropdown.map((submenu) => (
                <li key={submenu.to}>
                  <Link
                    to={submenu.to}
                    onClick={() => {
                      setSelectedDropdownLink(submenu.to);
                      setIsMobileMenuOpen(false); // Close sidebar on sublink click
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
      ))}
    </ul>
  );
}

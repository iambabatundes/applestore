import { Link } from "react-router-dom";

export default function SidebarLinks({
  sidebarLinks,
  selectedLink,
  setSelectedLink,
  isCollapsed,
  selectedDropdownLink,
  setSelectedDropdownLink,
}) {
  return (
    <ul>
      {sidebarLinks.map((link) => (
        <li key={link.to} className="sidebar-item">
          <Link
            to={link.to}
            onClick={() => setSelectedLink(link.to)}
            className={selectedLink === link.to ? "active" : ""}
            title={isCollapsed ? link.label : ""}
          >
            <i className={`fa ${link.icon}`} />
            {!isCollapsed && link.label}
          </Link>

          {!isCollapsed && link.dropdown && (
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
  );
}

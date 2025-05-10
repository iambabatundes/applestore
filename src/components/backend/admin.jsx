import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminNavbar from "./adminNavbar";
import "./styles/admin.css"; // Good, clean import
import "../backend/common/styles/darkMode.css";
import Dashboard from "./dashboard";
import CreatePost from "./createPost";
import AddProduct from "./addProduct";
import AdminSidebar from "./adminSidebar";
import AdminLogin from "./adminLogin";
import { useAdminAuthStore } from "./store/useAdminAuthStore";
import AdminSkeleton from "./skeleton/adminSkeleton";
import { sidebarLinks } from "./config/adminRoutesConfig";
import useAdminStore from "./admin/useAdminStore";
import { useAdminSidebarStore } from "./store/adminSideBarStore";

const Admin = ({ companyName, count, userName, logo }) => {
  const navigate = useNavigate();

  const { adminUser, isAuthenticated, loading, fetchAdminUser, logout } =
    useAdminAuthStore();
  const {
    selectedLink,
    setSelectedLink,
    isMobileMenuOpen,
    toggleMobileMenu,
    selectedDropdownLink,
    setSelectedDropdownLink,
    darkMode,
    toggleDarkMode,
  } = useAdminStore();

  const { isCollapsed, isHidden } = useAdminSidebarStore();

  useEffect(() => {
    fetchAdminUser(navigate);
  }, [fetchAdminUser, navigate]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  if (loading) return <AdminSkeleton darkMode={darkMode} />;
  if (!isAuthenticated) return <AdminLogin setAuth={() => {}} />;

  const notifications = () => {
    console.log("notification");
  };

  const links = sidebarLinks(darkMode, adminUser);

  return (
    <section className={darkMode ? "admin-wrapper dark-mode" : "admin-wrapper"}>
      <AdminNavbar
        companyName={companyName}
        count={count}
        handleToggle={toggleMobileMenu}
        userName={userName}
        handleLogout={logout}
        user={adminUser}
        darkMode={darkMode}
        logo={logo}
        toggleDarkMode={toggleDarkMode}
      />
      <section
        className={`admin-container ${
          isHidden
            ? "sidebar-hidden"
            : isCollapsed
            ? "sidebar-collapsed"
            : isMobileMenuOpen
            ? ""
            : "sidebar-closed"
        }`}
      >
        <AdminSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
          sidebarLinks={links}
          selectedDropdownLink={selectedDropdownLink}
          setSelectedDropdownLink={setSelectedDropdownLink}
          darkMode={darkMode}
          count={count}
          toggleDarkMode={toggleDarkMode}
          notifications={notifications}
          handleLogout={logout}
          setIsMobileMenuOpen={toggleMobileMenu}
        />
        {/* <section className="admin-main-content"> */}
        <section
          className={`admin-main-content ${
            isMobileMenuOpen ? "sidebar-open" : "sidebar-closed"
          }`}
        >
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            {links.map((link) => (
              <Route key={link.to} path={link.to} element={link.content} />
            ))}
            {links.flatMap((link) =>
              link.dropdown.map((submenu) => (
                <Route
                  key={submenu.to}
                  path={submenu.to}
                  element={submenu.content}
                />
              ))
            )}
            <Route
              path="/admin/add-product/:id"
              element={<AddProduct user={adminUser} />}
            />
            <Route path="/admin/create/:id" element={<CreatePost />} />
          </Routes>
        </section>
      </section>
    </section>
  );
};

export default Admin;

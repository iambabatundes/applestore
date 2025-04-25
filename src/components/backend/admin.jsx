import React, { useState, useCallback, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminNavbar from "./adminNavbar";
import "./styles/admin.css";
import "../backend/common/styles/darkMode.css";
import Dashboard from "./dashboard";
import CreatePost from "./createPost";
import AllPosts from "./allPosts";
import AddProduct from "./addProduct";
import AllProduct from "./allProducts";
import GeneralSettings from "./generalSettings";
import AppearanceSettings from "./appearanceSettings";
import Upload from "./upload";
import NewMedia from "./newMedia";
import AllPages from "./allPages";
import Profile from "./profile";
import AllUsers from "./allUsers";
import NewPage from "./newPage";
import Updates from "./updates";
import SEO from "./seo";
import AdminSidebar from "./adminSidebar";
import AddCategories from "./categories/addCategory";
import Orders from "./orders";
import Promotion from "./promotion";
import AddPostTags from "./allPosts/addPostTags";
import AddPostCategories from "./allPosts/addPostCategories";
import AdminLogin from "./adminLogin";
import useAdminUser from "./hooks/useAdminUser";
import Promotions from "./promotions/promotions";
import Coupon from "./coupon";
import ShippingRate from "./shippingRate/shippingRate";
import TaxRate from "./taxRate/taxRate";
import AddTags from "./tags/addTags";

const Admin = ({ companyName, count, userName, logo }) => {
  const [selectedLink, setSelectedLink] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDropdownLink, setSelectedDropdownLink] = useState(null);
  const navigate = useNavigate();
  const {
    adminUser,
    isAuthenticated,
    loading,
    // setIsAuthenticated,
    // setAdminUser,
    handleLogout,
  } = useAdminUser(navigate);

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const handleToggle = useCallback(() => {
    setMobileMenuOpen((prevState) => !prevState);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // if (!isAuthenticated) {
  //   return <AdminLogin setAuth={setIsAuthenticated} />;
  // }

  if (loading) {
    return <p>Loading...</p>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <AdminLogin setAuth={() => {}} />;
  }

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const sidebarLinks = [
    {
      label: "Dashboard",
      to: "/admin/home",
      content: <Dashboard darkMode={darkMode} />,
      icon: "fa-tachometer",
      dropdown: [
        { label: "Home", to: "/admin/home", content: <Dashboard /> },
        { label: "Updates", to: "/admin/updates", content: <Updates /> },
        { label: "SEO", to: "/admin/seo", content: <SEO /> },
        {
          label: "Shipping Rate",
          to: "/admin/shipping",
          content: <ShippingRate />,
        },
        {
          label: "Tax Rate",
          to: "/admin/tax-rate",
          content: <TaxRate />,
        },
      ],
    },
    {
      label: "Posts",
      to: "/admin/posts",
      icon: "fa-pencil-square-o",
      content: <AllPosts darkMode={darkMode} />,
      dropdown: [
        {
          label: "All Posts",
          to: "/admin/posts",
          content: <AllPosts />,
        },
        {
          label: "Create Post",
          to: "/admin/create",
          content: <CreatePost adminUser={adminUser} />,
        },
        {
          label: "Categories",
          to: "/admin/posts-categories",
          content: <AddPostCategories />,
        },
        {
          label: "Tags",
          to: "/admin/posts-tags",
          content: <AddPostTags />,
        },
      ],
    },
    {
      label: "Products",
      to: "/admin/all-products",
      content: <AllProduct />,
      icon: "fa-tag",
      dropdown: [
        {
          label: "All Products",
          to: "/admin/all-products",
          content: <AllProduct />,
        },
        {
          label: "Add Product",
          to: "/admin/add-product",
          content: <AddProduct darkMode={darkMode} user={adminUser} />,
        },
        {
          label: "Categories",
          to: "/admin/add-categories",
          content: <AddCategories />,
        },
        {
          label: "Tags",
          to: "/admin/add-tags",
          content: <AddTags />,
        },
      ],
    },
    {
      label: "Media",
      to: "/admin/upload",
      content: <Upload />,
      icon: "fa-tag",
      dropdown: [
        {
          label: "Library",
          to: "/admin/upload",
          content: <Upload />,
        },
        {
          label: "Add New",
          to: "/admin/new-media",
          content: <NewMedia />,
        },
      ],
    },
    {
      label: "Orders",
      to: "/admin/orders",
      icon: "fa-file",
      content: <Orders />,
      dropdown: [
        {
          label: "All Order",
          to: "/admin/orders",
          content: <Orders />,
        },
        {
          label: "All Pages",
          to: "/admin/all-pages",
          content: <AllPages />,
        },
      ],
    },
    {
      label: "Promotion",
      to: "/admin/promotions",
      icon: "fa-file",
      content: <Promotion />,
      dropdown: [
        {
          label: "Create",
          to: "/admin/create-promotions",
          content: <Promotions />,
        },
      ],
    },
    {
      label: "Coupon",
      to: "/admin/coupons",
      icon: "fa-file",
      content: <Coupon />,
      dropdown: [
        {
          label: "Create",
          to: "/admin/create-promotions",
          content: <Promotions />,
        },
      ],
    },
    {
      label: "Pages",
      to: "/admin/all-pages",
      icon: "fa-file",
      content: <AllPages />,
      dropdown: [
        {
          label: "All Pages",
          to: "/admin/all-pages",
          content: <AllPages />,
        },
        {
          label: "Add New",
          to: "/admin/new-page",
          content: <NewPage />,
        },
      ],
    },
    {
      label: "Users",
      to: "/admin/all-users",
      icon: "fa-users",
      content: <AllUsers />,
      dropdown: [
        {
          label: "All Users",
          to: "/admin/all-users",
          content: <AllUsers />,
        },
        {
          label: "Add New",
          to: "/admin/new-user",
          content: <NewPage />,
        },
        {
          label: "Profile",
          to: "/admin/profile",
          content: <Profile />,
        },
      ],
    },
    {
      label: "Settings",
      to: "/admin/general",
      icon: "fa-cog",
      content: <GeneralSettings />,
      dropdown: [
        {
          label: "General Settings",
          to: "/admin/general",
          content: <GeneralSettings />,
        },
        {
          label: "Appearance",
          to: "/admin/appearance",
          content: <AppearanceSettings />,
        },
      ],
    },
  ];

  return (
    <section className={darkMode ? "dark-mode" : ""}>
      <AdminNavbar
        companyName={companyName}
        count={count}
        handleToggle={handleToggle}
        userName={userName}
        handleLogout={handleLogout}
        user={adminUser}
        darkMode={darkMode}
        logo={logo}
        toggleDarkMode={toggleDarkMode}
      />
      <section className="admin-container">
        <AdminSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
          sidebarLinks={sidebarLinks}
          selectedDropdownLink={selectedDropdownLink}
          setSelectedDropdownLink={setSelectedDropdownLink}
          darkMode={darkMode}
          count={count}
          toggleDarkMode={toggleDarkMode}
        />
        <section className="admin-main-content">
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            {sidebarLinks.map((link) => (
              <Route key={link.to} path={link.to} element={link.content} />
            ))}
            {sidebarLinks.flatMap((link) =>
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

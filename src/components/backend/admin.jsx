import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import AdminNavbar from "./adminNavbar";
import Dashboard from "./dashboard";
import CreatePost from "./createPost";
import AddProduct from "./addProduct";
import AllProduct from "./allProducts";
import AllPosts from "./allPosts";
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
import Settings from "./settings";
import "./styles/admin.css";
import AdminSidebar from "./adminSidebar";
import ProductEdit from "./productEdit";

const Admin = ({ companyName, count }) => {
  const sidebarLinks = [
    {
      label: "Dashboard",
      to: "/admin/home",
      content: null,
      icon: "fa-tachometer",
      dropdown: [
        { label: "Home", to: "/admin/home", content: <Dashboard /> },
        { label: "Updates", to: "/admin/updates", content: <Updates /> },
        { label: "SEO", to: "/admin/seo", content: <SEO /> },
      ],
    },
    {
      label: "Posts",
      to: "/admin/posts",
      icon: "fa-pencil-square-o",
      content: null,
      dropdown: [
        {
          label: "All Posts",
          to: "/admin/posts",
          content: <AllPosts />,
        },
        {
          label: "Create Post",
          to: "/admin/create",
          content: <CreatePost />,
        },
      ],
    },
    {
      label: "Media",
      to: "/admin/upload",
      content: null,
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
      label: "Products",
      to: "/admin/products",
      content: null,
      icon: "fa-tag",
      dropdown: [
        {
          label: "All Products",
          to: "/admin/products",
          content: <ProductEdit />,
        },
        {
          label: "Add Product",
          to: "/admin/add-product",
          content: <AddProduct />,
        },
      ],
    },

    {
      label: "Pages",
      to: "/admin/all-pages", // Corrected URL
      icon: "fa-file",
      content: null,
      dropdown: [
        {
          label: "All Pages",
          to: "/admin/all-pages", // Set the appropriate URLs
          content: <AllPages />, // Use your specific components here
        },
        {
          label: "Add New",
          to: "/admin/new-page", // Set the appropriate URLs
          content: <NewPage />, // Use your specific components here
        },
      ],
    },
    {
      label: "Users",
      to: "/admin/all-users", // Corrected URL
      icon: "fa-users",
      content: null,
      dropdown: [
        {
          label: "All Users",
          to: "/admin/all-users", // Set the appropriate URLs
          content: <AllUsers />, // Use your specific components here
        },
        {
          label: "Add New",
          to: "/admin/new-user", // Set the appropriate URLs
          content: <NewPage />, // Use your specific components here
        },
        {
          label: "Profile",
          to: "/admin/profile", // Set the appropriate URLs
          content: <Profile />, // Use your specific components here
        },
      ],
    },
    {
      label: "Settings",
      to: "/admin/general", // Corrected URL
      icon: "fa-cog",
      content: null,
      dropdown: [
        {
          label: "General Settings",
          to: "/admin/general", // Set the appropriate URLs
          content: <GeneralSettings />, // Use your specific components here
        },
        {
          label: "Appearance",
          to: "/admin/appearance", // Set the appropriate URLs
          content: <AppearanceSettings />, // Use your specific components here
        },
      ],
    },
    // ... other links
  ];

  const [selectedLink, setSelectedLink] = useState(null);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDropdownLink, setSelectedDropdownLink] = useState(null);

  const handleToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <section>
      <AdminNavbar
        companyName={companyName}
        count={count}
        handleToggle={handleToggle}
      />
      <section className="admin-container">
        <AdminSidebar
          isMobileMenuOpen={isMobileMenuOpen}
          selectedLink={selectedLink}
          setSelectedLink={setSelectedLink}
          sidebarLinks={sidebarLinks}
          selectedDropdownLink={selectedDropdownLink}
          setSelectedDropdownLink={setSelectedDropdownLink}
        />

        <section className="admin-main-content">
          <Routes>
            <Route path="/admin" element={<Dashboard />} />
            {sidebarLinks.map((link) => (
              <Route key={link.to} path={link.to} element={link.content} />
            ))}
          </Routes>

          <Routes>
            {sidebarLinks.flatMap((link) =>
              link.dropdown.map((submenu) => (
                <Route
                  key={submenu.to}
                  path={submenu.to}
                  element={submenu.content}
                />
              ))
            )}
          </Routes>
        </section>
      </section>
    </section>
  );
};

export default Admin;

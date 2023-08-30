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
import Settings from "./settings";
import "./styles/admin.css";
import AdminSidebar from "./adminSidebar";
import ProductEdit from "./productEdit";

const Admin = ({ companyName, count }) => {
  const sidebarLinks = [
    {
      label: "Dashboard",
      to: "/admin/dashboard",
      content: <Dashboard />,
      dropdown: [],
    },
    {
      label: "Posts",
      to: "/admin/posts",
      content: <AllPosts />,
      dropdown: [
        {
          label: "All Posts",
          to: "/admin/posts/edits",
          content: <AllPosts />,
        },
        {
          label: "Create Post",
          to: "/admin/posts/create",
          content: <CreatePost />,
        },
      ],
    },
    {
      label: "Products",
      to: "/admin/products",
      content: <AllProduct />,
      dropdown: [
        {
          label: "All Products",
          to: "/admin/products/edits",
          content: <ProductEdit />,
        },
        {
          label: "Add Product",
          to: "/admin/products/add",
          content: <AddProduct />,
        },
      ],
    },

    {
      label: "Settings",
      to: "/admin/settings", // Corrected URL
      content: <Settings />,
      dropdown: [
        {
          label: "General Settings",
          to: "/admin/settings/general", // Set the appropriate URLs
          content: <GeneralSettings />, // Use your specific components here
        },
        {
          label: "Appearance",
          to: "/admin/settings/appearance", // Set the appropriate URLs
          content: <AppearanceSettings />, // Use your specific components here
        },
      ],
    },
    // ... other links
  ];
  const [selectedLink, setSelectedLink] = useState(sidebarLinks[0].to);
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

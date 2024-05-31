import React, { useState, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import AdminNavbar from "./adminNavbar";
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
import "./styles/admin.css";
import AdminSidebar from "./adminSidebar";
import AddTags from "./addTags";
import AddCategories from "./categories/addCategory";
import Orders from "./orders";
import Promotion from "./promotion";
import AddPostTags from "./allPosts/addPostTags";
import AddPostCategories from "./allPosts/addPostCategories";

const Admin = ({ companyName, count, userName }) => {
  const [selectedLink, setSelectedLink] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDropdownLink, setSelectedDropdownLink] = useState(null);

  const handleToggle = useCallback(() => {
    setMobileMenuOpen((prevState) => !prevState);
  }, []);

  const sidebarLinks = [
    {
      label: "Dashboard",
      to: "/admin/home",
      content: <Dashboard />,
      icon: "fa-tachometer",
      dropdown: [
        { label: "Home", to: "/admin/home", content: <Dashboard /> },
        { label: "Updates", to: "/admin/updates", content: <Updates /> },
        { label: "SEO", to: "/admin/seo", content: <SEO /> },
        { label: "Promotion", to: "/admin/promotion", content: <Promotion /> },
      ],
    },
    {
      label: "Posts",
      to: "/admin/posts",
      icon: "fa-pencil-square-o",
      content: <AllPosts />,
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
          content: <AddProduct />,
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
    <section>
      <AdminNavbar
        companyName={companyName}
        count={count}
        handleToggle={handleToggle}
        userName={userName}
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
            {sidebarLinks.flatMap((link) =>
              link.dropdown.map((submenu) => (
                <Route
                  key={submenu.to}
                  path={submenu.to}
                  element={submenu.content}
                />
              ))
            )}
            <Route path="/admin/add-product/:id" element={<AddProduct />} />
          </Routes>
        </section>
      </section>
    </section>
  );
};

export default Admin;

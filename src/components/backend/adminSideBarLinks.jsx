import React from "react";
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
// import Settings from "./settings";
import "./styles/admin.css";
import AddCategories from "./categories/addCategory";
import AddTags from "./addTags";
import Orders from "./orders";
import Payments from "./payments";

export default function adminSideBarLinks({
  blogPosts,
  setBlogPosts,
  mediaData,
  selectedFilter,
  handleFilterChange,
  handleDateChange,
  selectedDate,
  uniqueDates,
  handleSearch,
  mediaSearch,
  filteredMedia,
  setLoading,
  setMediaData,
  setUniqueDates,
  selectedMedia,
  maxFileSize,
  setMaxFileSize,
  loading,
}) {
  const sidebarLinks = [
    {
      label: "Dashboard",
      to: "/admin/home",
      icon: "fa-tachometer",
      content: <Dashboard />,
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
      content: <AllPosts blogPosts={blogPosts} setBlogPosts={setBlogPosts} />,
      dropdown: [
        {
          label: "All Posts",
          to: "/admin/posts",
          content: (
            <AllPosts blogPosts={blogPosts} setBlogPosts={setBlogPosts} />
          ),
        },
        {
          label: "Create New Post",
          to: "/admin/create",
          content: (
            <CreatePost
              mediaData={mediaData}
              selectedFilter={selectedFilter}
              handleFilterChange={handleFilterChange}
              handleDateChange={handleDateChange}
              selectedDate={selectedDate}
              uniqueDates={uniqueDates}
              handleSearch={handleSearch}
              mediaSearch={mediaSearch}
              filteredMedia={filteredMedia}
              blogPosts={blogPosts}
              setBlogPosts={setBlogPosts}
              addNewPost={(newPost) => {
                setBlogPosts((prevPosts) => [newPost, ...prevPosts]);
              }}
            />
          ),
        },
      ],
    },
    {
      label: "Media",
      to: "/admin/upload",
      icon: "fa-tag",
      content: <Upload />,
      dropdown: [
        {
          label: "Library",
          to: "/admin/upload",
          content: (
            <Upload
              loading={loading}
              setLoading={setLoading}
              // mediaData={mediaData}
              setMediaData={setMediaData}
              uniqueDates={uniqueDates}
              setUniqueDates={setUniqueDates}
              selectedMedia={selectedMedia}
              maxFileSize={maxFileSize}
              setMaxFileSize={setMaxFileSize}
              handleDateChange={handleDateChange}
              handleFilterChange={handleFilterChange}
              selectedDate={selectedDate}
              selectedFilter={selectedFilter}
              filteredMedia={filteredMedia}
              handleSearch={handleSearch}
              mediaSearch={mediaSearch}
              blogPosts={blogPosts}
            />
          ),
        },
        {
          label: "Add new",
          to: "/admin/new-media",
          content: <NewMedia />,
        },
      ],
    },
    {
      label: "Product",
      to: "/admin/all-products",
      icon: "fa-tag",
      content: <AllProduct />,
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
      label: "Orders",
      to: "/admin/orders", // Corrected URL
      icon: "fa-file",
      content: <Orders />,
      dropdown: [
        {
          label: "All Pages",
          to: "/admin/all-pages", // Set the appropriate URLs
          content: <AllPages />, // Use your specific components here
        },
      ],
    },

    {
      label: "Payments",
      to: "/admin/payments", // Corrected URL
      icon: "fa-file",
      content: <Payments />,
      dropdown: [
        {
          label: "All Pages",
          to: "/admin/all-pages", // Set the appropriate URLs
          content: <AllPages />, // Use your specific components here
        },
      ],
    },

    {
      label: "Pages",
      to: "/admin/all-pages", // Corrected URL
      icon: "fa-file",
      content: <AllPages />,
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
      content: <AllUsers />,
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
      content: <GeneralSettings />,
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
    // Define other sidebar links similarly
  ];
  return sidebarLinks;
}
